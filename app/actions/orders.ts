"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { revalidatePath } from "next/cache";
import { OrderRow } from "./dashboard";

export type OrderStatus =
  | "awaiting_payment"
  | "pending"
  | "cooking"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export async function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) {
    console.error("updateOrderStatus error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}

export async function updatePaymentStatus(
  orderId: string,
  newPaymentStatus: "approved" | "rejected"
): Promise<{ success: boolean; error?: string }> {
  // If approved, we also move the order out of 'awaiting_payment' into 'pending'
  const updates: any = { payment_status: newPaymentStatus };
  if (newPaymentStatus === "approved") {
    updates.status = "pending";
  } else if (newPaymentStatus === "rejected") {
    updates.status = "cancelled";
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (error) {
    console.error("updatePaymentStatus error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
  return { success: true };
}

export type OrderItemRow = {
  id: string;
  order_id: string;
  item_name: string;
  quantity: number;
  price: string;
  image: string;
};

export async function getOrderItems(orderId: string): Promise<OrderItemRow[]> {
  const { data, error } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", orderId);

  if (error) {
    console.error("getOrderItems error:", error);
    return [];
  }
  return data ?? [];
}

export async function getOrders(type?: "all" | "pickup" | "delivery"): Promise<OrderRow[]> {
  let query = supabaseAdmin
    .from("orders")
    .select("*")
    .neq("status", "awaiting_payment")
    .order("created_at", { ascending: false });

  if (type === "pickup" || type === "delivery") {
    query = query.eq("order_type", type);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getOrders error:", error);
    return [];
  }
  return data ?? [];
}

export async function getPendingPayments(): Promise<OrderRow[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .eq("status", "awaiting_payment")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getPendingPayments error:", error);
    return [];
  }
  return data ?? [];
}
