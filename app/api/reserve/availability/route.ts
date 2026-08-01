import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { countOverlappingBookings, parseTimeToMinutes } from "@/lib/reservations/capacity";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";

// GET /api/reserve/availability?date=YYYY-MM-DD
export async function GET(req: Request) {
  const ip = getClientIp(req.headers);
  const limited = await rateLimit(`reserve-availability:${ip}`, 60, 60 * 60 * 1000);
  if (limited.limited) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
    );
  }

  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid or missing date" }, { status: 400 });
  }

  const { data: config } = await supabaseAdmin
    .from("restaurant_capacity_config")
    .select("max_tables_per_slot, slot_duration_minutes")
    .eq("id", 1)
    .single();

  const maxTablesPerSlot = config?.max_tables_per_slot ?? 2;
  const slotDuration = config?.slot_duration_minutes ?? 90;

  const { data: reservations, error } = await supabaseAdmin
    .from("reservations")
    .select("reservation_time")
    .eq("reservation_date", date)
    .in("status", ["pending", "confirmed"]);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch availability" }, { status: 500 });
  }

  const slots: {
    time: string;
    tablesBooked: number;
    tablesRemaining: number;
    isFull: boolean;
  }[] = [];

  for (let h = 11; h <= 23; h++) {
    for (const m of [0, 30]) {
      const timeStr = `${String(h).padStart(2, "0")}:${m === 0 ? "00" : "30"}`;
      const slotMinutes = parseTimeToMinutes(timeStr);

      const tablesBooked = countOverlappingBookings(
        reservations ?? [],
        slotMinutes,
        slotDuration
      );

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
