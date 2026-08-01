import { supabaseAdmin } from "@/backend/supabaseServer";

export async function fetchCookingOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`*, order_items(*)`)
    .eq("status", "cooking")
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data ?? [];
}
