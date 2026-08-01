"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";
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
  await requireAdmin();

  if (newStatus === "out_for_delivery") {
    // Check if a driver is assigned
    const { data: order } = await supabaseAdmin
      .from("orders")
      .select("assigned_driver_id")
      .eq("id", orderId)
      .single();

    if (!order?.assigned_driver_id) {
      return { success: false, error: "Cannot mark out for delivery without assigning a driver first." };
    }
  }

  const { data: updatedOrder, error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId)
    .select("assigned_driver_id")
    .single();

  if (error) {
    console.error("updateOrderStatus error:", error);
    return { success: false, error: error.message };
  }

  // If marked as delivered manually from the admin panel, free the driver
  if (newStatus === "delivered" && updatedOrder?.assigned_driver_id) {
    await supabaseAdmin
      .from("drivers")
      .update({ status: "Active" })
      .eq("id", updatedOrder.assigned_driver_id);
      
    // Optionally update the delivery assignment status as well
    await supabaseAdmin
      .from("delivery_assignments")
      .update({ status: "delivered" })
      .eq("order_id", orderId);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/delivery");
  return { success: true };
}

export async function updatePaymentStatus(
  orderId: string,
  newPaymentStatus: "approved" | "rejected"
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  // If approved, we also move the order out of 'awaiting_payment' into 'pending'
  const updates: { payment_status: "approved" | "rejected"; status?: OrderStatus } = {
    payment_status: newPaymentStatus,
  };
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
  await requireAdmin();
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
  await requireAdmin();
  let query = supabaseAdmin
    .from("orders")
    .select("*, driver:drivers(name, phone)")
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
  await requireAdmin();
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

// ─── Confirmation Queue Actions ───────────────────────────────────────────────

export async function confirmOrder(
  orderId: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: "cooking" })
    .eq("id", orderId);

  if (error) {
    console.error("confirmOrder error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/kds");
  return { success: true };
}

export async function rejectOrder(
  orderId: string,
  reason?: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const updates: Record<string, string> = { status: "cancelled" };
  if (reason) updates.rejection_reason = reason;

  const { error } = await supabaseAdmin
    .from("orders")
    .update(updates)
    .eq("id", orderId);

  if (error) {
    console.error("rejectOrder error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  return { success: true };
}
