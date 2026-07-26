import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { z } from "zod";

const reservationSchema = z.object({
  customer_name: z.string().trim().min(2, "Name must be at least 2 characters").max(80),
  phone: z.string().trim().min(7, "Invalid phone number").max(20),
  reservation_date: z.string(), // YYYY-MM-DD
  reservation_time: z.string(), // HH:MM
  number_of_guests: z.number().int().min(1).max(50),
  table_number: z.string().max(50).optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = reservationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid reservation details", details: parsed.error.format() },
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
