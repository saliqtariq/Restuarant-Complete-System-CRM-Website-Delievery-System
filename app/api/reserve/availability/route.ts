import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";

// GET /api/reserve/availability?date=YYYY-MM-DD
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }

  // Fetch config
  const { data: config } = await supabaseAdmin
    .from("restaurant_capacity_config")
    .select("max_tables_per_slot, slot_duration_minutes")
    .eq("id", 1)
    .single();

  const maxTablesPerSlot = config?.max_tables_per_slot ?? 2;
  const slotDuration = config?.slot_duration_minutes ?? 90;

  // Fetch all active reservations for that date
  const { data: reservations, error } = await supabaseAdmin
    .from("reservations")
    .select("reservation_time")
    .eq("reservation_date", date)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }

  // Generate all time slots (11:00 – 23:00, every 30 min)
  const slots: {
    time: string;
    tablesBooked: number;
    tablesRemaining: number;
    isFull: boolean;
  }[] = [];

  for (let h = 11; h <= 23; h++) {
    for (const m of [0, 30]) {
      const timeStr = `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
      const slotMinutes = h * 60 + m;
      const windowStart = slotMinutes - slotDuration;
      const windowEnd   = slotMinutes + slotDuration;

      // Count bookings whose time overlaps with this slot's window
      const tablesBooked = (reservations ?? []).filter((r) => {
        const [rh, rm] = r.reservation_time.split(":").map(Number);
        const rMins = rh * 60 + rm;
        return rMins > windowStart && rMins < windowEnd;
      }).length;

      const tablesRemaining = Math.max(0, maxTablesPerSlot - tablesBooked);
      slots.push({
        time: timeStr,
        tablesBooked,
        tablesRemaining,
        isFull: tablesRemaining === 0,
      });
    }
  }

  return NextResponse.json({ slots, maxTablesPerSlot });
}
