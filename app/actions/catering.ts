"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { supabase } from "@/backend/supabase";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";
import { OrderRow } from "./dashboard";

// ─── Types ───────────────────────────────────────────────

export type CateringRequestRow = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  event_type: string;
  guest_count: string;
  event_date: string | null;
  notes: string | null;
  status: string;
  created_at: string;
  updated_at: string;
};

export type CateringRequestStatus = "new" | "contacted" | "confirmed" | "cancelled";

// ─── Public: Submit a catering request (from website) ────

export async function submitCateringRequest(formData: {
  name: string;
  phone: string;
  email?: string;
  eventType: string;
  guestCount: string;
  eventDate: string;
  notes: string;
}): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase.from("catering_requests").insert({
    name: formData.name,
    phone: formData.phone,
    email: formData.email || null,
    event_type: formData.eventType,
    guest_count: formData.guestCount,
    event_date: formData.eventDate || null,
    notes: formData.notes || null,
    status: "new",
  });

  if (error) {
    console.error("submitCateringRequest error:", error);
    return { success: false, error: error.message };
  }
  return { success: true };
}

// ─── Admin: Get all catering requests ────────────────────

export async function getCateringRequests(): Promise<CateringRequestRow[]> {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("catering_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCateringRequests error:", error);
    return [];
  }
  return data ?? [];
}

// ─── Admin: Update catering request status ───────────────

export async function updateCateringRequestStatus(
  requestId: string,
  newStatus: CateringRequestStatus
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("catering_requests")
    .update({ status: newStatus, updated_at: new Date().toISOString() })
    .eq("id", requestId);

  if (error) {
    console.error("updateCateringRequestStatus error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/catering");
  return { success: true };
}

// ─── Admin: Get catering-related orders ──────────────────

export async function getCateringOrders(): Promise<OrderRow[]> {
  await requireAdmin();

  // Fetch orders whose item names contain catering-related keywords
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .or(
      "customer_name.ilike.%catering%,customer_name.ilike.%party%"
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCateringOrders query1 error:", error);
  }

  // Also fetch orders whose order_items contain catering keywords
  const { data: cateringItemOrders, error: error2 } = await supabaseAdmin
    .from("order_items")
    .select("order_id")
    .or(
      "item_name.ilike.%Party Fries Box%,item_name.ilike.%Catering Burger Box%,item_name.ilike.%Party Drinks Box%,item_name.ilike.%Custom Family Party Box%,item_name.ilike.%Custom%Party%Box%"
    );

  if (error2) {
    console.error("getCateringOrders query2 error:", error2);
  }

  const orderIdsFromItems = (cateringItemOrders ?? []).map((r) => r.order_id);

  // Combine and deduplicate
  const allOrderIds = new Set<string>();
  (data ?? []).forEach((o) => allOrderIds.add(o.id));
  orderIdsFromItems.forEach((id) => allOrderIds.add(id));

  if (allOrderIds.size === 0) return [];

  // Fetch full order rows for combined IDs
  const { data: finalOrders, error: error3 } = await supabaseAdmin
    .from("orders")
    .select("*")
    .in("id", Array.from(allOrderIds))
    .order("created_at", { ascending: false });

  if (error3) {
    console.error("getCateringOrders final error:", error3);
    return [];
  }

  return finalOrders ?? [];
}
