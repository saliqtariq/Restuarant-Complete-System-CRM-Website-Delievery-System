import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { countOverlappingBookings, parseTimeToMinutes } from "@/lib/reservations/capacity";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { isBodyParsingError, readJsonBody } from "@/lib/security/request";
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
    const ip = getClientIp(req.headers);
    const limited = await rateLimit(`reserve:${ip}`, 10, 60 * 60 * 1000);
    if (limited.limited) {
      return NextResponse.json(
        { error: "Too many reservation attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    const body = await readJsonBody<unknown>(req, 10_000);
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

    const { data: config } = await supabaseAdmin
      .from("restaurant_capacity_config")
      .select("max_tables_per_slot, slot_duration_minutes")
      .eq("id", 1)
      .single();

    const maxTablesPerSlot = config?.max_tables_per_slot ?? 2;
    const slotDuration = config?.slot_duration_minutes ?? 90;

    const slotMinutes = parseTimeToMinutes(reservation_time);

    const { data: existing } = await supabaseAdmin
      .from("reservations")
      .select("reservation_time")
      .eq("reservation_date", reservation_date)
      .in("status", ["pending", "confirmed"]);

    const overlappingBookings = countOverlappingBookings(
      existing ?? [],
      slotMinutes,
      slotDuration
    );

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
      .select("id, reservation_date, reservation_time, status")
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json({ error: "Failed to create reservation" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      reservation: {
        id: reservation.id,
        reservation_date: reservation.reservation_date,
        reservation_time: reservation.reservation_time,
        status: reservation.status,
      },
    });
  } catch (error) {
    if (isBodyParsingError(error)) {
      const message = error instanceof Error ? error.message : "Invalid request body";
      const status = message.includes("large") ? 413 : 400;
      return NextResponse.json({ error: message }, { status });
    }

    console.error("Reservation API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
