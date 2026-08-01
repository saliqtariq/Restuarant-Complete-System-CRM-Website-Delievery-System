"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { isValidEmail, normalizeEmail, normalizeText } from "@/lib/security/validation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
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

const cateringRequestSchema = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().trim().regex(/^03[0-9]{9}$/, "Invalid phone number"),
  email: z.string().trim().max(254).optional(),
  eventType: z.string().trim().min(1).max(100),
  guestCount: z.string().trim().min(1).max(50),
  eventDate: z.string().trim().max(20),
  notes: z.string().trim().max(1000).optional(),
});

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
  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const limited = await rateLimit(`catering:${ip}`, 5, 60 * 60 * 1000);
  if (limited.limited) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  const parsed = cateringRequestSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || "Invalid request" };
  }

  const data = parsed.data;
  const email = data.email?.trim() || null;
  if (email && !isValidEmail(email)) {
    return { success: false, error: "Invalid email address." };
  }

  const { error } = await supabaseAdmin.from("catering_requests").insert({
    name: normalizeText(data.name, 80),
    phone: data.phone,
    email: email ? normalizeEmail(email) : null,
    event_type: normalizeText(data.eventType, 100),
    guest_count: normalizeText(data.guestCount, 50),
    event_date: data.eventDate || null,
    notes: data.notes ? normalizeText(data.notes, 1000) : null,
    status: "new",
  });

  if (error) {
    console.error("submitCateringRequest error:", error);
    return { success: false, error: "Failed to submit request. Please try again." };
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

  const allOrderIds = new Set<string>();
  (data ?? []).forEach((o) => allOrderIds.add(o.id));
  orderIdsFromItems.forEach((id) => allOrderIds.add(id));

  if (allOrderIds.size === 0) return [];

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
