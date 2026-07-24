"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";

export type CustomerRow = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  dob: string | null;
  gender: string | null;
  email_marketing: boolean;
  created_at: string;
};

export async function getCustomers(): Promise<CustomerRow[]> {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCustomers error:", error);
    return [];
  }
  return data ?? [];
}
