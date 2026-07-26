"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";

export type Reservation = {
  id: string;
  customer_name: string;
  phone: string;
  reservation_date: string;
  reservation_time: string;
  number_of_guests: number;
  table_number: string | null;
  status: string;
  created_at: string;
};

export async function getReservations(): Promise<Reservation[]> {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select("*")
    .order("reservation_date", { ascending: false })
    .order("reservation_time", { ascending: false });

  if (error) {
    console.error("getReservations error:", error);
    return [];
  }
  return data ?? [];
}

export async function updateReservationStatus(
  id: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("reservations")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    console.error("updateReservationStatus error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/reservations");
  return { success: true };
}
