import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { z } from "zod";

const reservationSchema = z.object({
  customer_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  phone: z
    .string()
    .trim()
    .regex(/^03[0-9]{9}$/, "Phone number must start with 03 and be exactly 11 digits"),
  reservation_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  reservation_time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format"),
  number_of_guests: z.number().int().min(1).max(50),
  table_number: z.string().max(50).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid reservation details" },
        { status: 400 }
      );
    }

    const {
      customer_name,
      phone,
      reservation_date,
      reservation_time,
      number_of_guests,
      table_number,
    } = parsed.data;

    // ── Capacity check ───────────────────────────────────────────────────────
    // Fetch config
    const { data: config } = await supabaseAdmin
      .from("restaurant_capacity_config")
      .select("max_tables_per_slot, slot_duration_minutes")
      .eq("id", 1)
      .single();

    const maxTablesPerSlot = config?.max_tables_per_slot ?? 2;
    const slotDuration = config?.slot_duration_minutes ?? 90;

    // Count how many RESERVATIONS already overlap with the requested time window.
    // A reservation at H:MM overlaps if its time falls within ±slotDuration minutes.
    const [rHour, rMin] = reservation_time.split(":").map(Number);
    const rStartMinutes = rHour * 60 + rMin;
    const windowStart = rStartMinutes - slotDuration; // exclusive lower bound (minutes)
    const windowEnd   = rStartMinutes + slotDuration; // exclusive upper bound (minutes)

    // Fetch all active reservations on the same date
    const { data: existing } = await supabaseAdmin
      .from("reservations")
      .select("reservation_time")
      .eq("reservation_date", reservation_date)
      .in("status", ["pending", "confirmed"]);

    // Count bookings whose time falls inside the overlap window
    const overlappingBookings = (existing ?? []).filter((r) => {
      const [h, m] = r.reservation_time.split(":").map(Number);
      const mins = h * 60 + m;
      return mins > windowStart && mins < windowEnd;
    }).length;

    if (overlappingBookings >= maxTablesPerSlot) {
      return NextResponse.json(
        {
          error:
            `Sorry, all ${maxTablesPerSlot} reservable tables are taken for this time slot. ` +
            `Please choose a different time.`,
        },
        { status: 409 }
      );
    }
    // ── End capacity check ───────────────────────────────────────────────────

    // Insert into Supabase
    const { data: reservation, error } = await supabaseAdmin
      .from("reservations")
      .insert([
        {
          customer_name,
          phone,
          reservation_date,
          reservation_time,
          number_of_guests,
          table_number: table_number || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "Failed to create reservation" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, reservation });
  } catch (error) {
    console.error("Reservation API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
