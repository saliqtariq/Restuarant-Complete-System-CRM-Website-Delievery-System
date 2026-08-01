"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";

export type DeliveryAssignment = {
  id: string;
  order_id: string;
  driver_id: string;
  assigned_at: string;
  delivery_token: string;
  driver_notes?: string;
  status: string;
};

export async function assignDriverToOrder(
  orderId: string,
  driverId: string
): Promise<{ success: boolean; error?: string; token?: string }> {
  await requireAdmin();

  // 1. Generate unique token
  const token = crypto.randomUUID();

  // 2. Insert assignment
  const { data: assignment, error: assignError } = await supabaseAdmin
    .from("delivery_assignments")
    .insert([{
      order_id: orderId,
      driver_id: driverId,
      delivery_token: token,
      status: "assigned"
    }])
    .select("delivery_token")
    .single();

  if (assignError) {
    console.error("assignDriverToOrder error (assignment):", assignError);
    return { success: false, error: assignError.message };
  }

  // 3. Update order
  const { error: orderError } = await supabaseAdmin
    .from("orders")
    .update({
      assigned_driver_id: driverId,
      status: "out_for_delivery"
    })
    .eq("id", orderId);

  if (orderError) {
    console.error("assignDriverToOrder error (order):", orderError);
    return { success: false, error: orderError.message };
  }

  // 4. Update driver status
  const { error: driverError } = await supabaseAdmin
    .from("drivers")
    .update({ status: "On Delivery" })
    .eq("id", driverId);

  if (driverError) {
    console.error("assignDriverToOrder error (driver):", driverError);
    // Non-fatal, just log
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/delivery");
  
  return { success: true, token: assignment.delivery_token };
}

export async function getDeliveryAssignment(orderId: string): Promise<DeliveryAssignment | null> {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("delivery_assignments")
    .select("*")
    .eq("order_id", orderId)
    .single();

  if (error) {
    return null;
  }
  return data;
}

export async function getDeliveryByToken(token: string) {
  // Public access, no requireAdmin()
  const { data: assignment, error: assignError } = await supabaseAdmin
    .from("delivery_assignments")
    .select("*, driver:drivers(name, phone), order:orders(*)")
    .eq("delivery_token", token)
    .single();

  if (assignError || !assignment) {
    return null;
  }

  const { data: items } = await supabaseAdmin
    .from("order_items")
    .select("*")
    .eq("order_id", assignment.order_id);

  return { ...assignment, items: items ?? [] };
}

export async function markDeliveryComplete(token: string): Promise<{ success: boolean; error?: string }> {
  // Public access by token
  const assignment = await getDeliveryByToken(token);
  if (!assignment) {
    return { success: false, error: "Invalid token" };
  }

  if (assignment.status === "delivered") {
    return { success: true }; // already done
  }

  // 1. Update assignment status
  const { error: assignError } = await supabaseAdmin
    .from("delivery_assignments")
    .update({ status: "delivered" })
    .eq("delivery_token", token);

  if (assignError) {
    console.error("markDeliveryComplete error (assignment):", assignError);
    return { success: false, error: assignError.message };
  }

  // 2. Update order status
  const { error: orderError } = await supabaseAdmin
    .from("orders")
    .update({ status: "delivered" })
    .eq("id", assignment.order_id);

  if (orderError) {
    console.error("markDeliveryComplete error (order):", orderError);
    return { success: false, error: orderError.message };
  }

  // 3. Update driver status back to Active
  const { error: driverError } = await supabaseAdmin
    .from("drivers")
    .update({ status: "Active" })
    .eq("id", assignment.driver_id);

  if (driverError) {
    console.error("markDeliveryComplete error (driver):", driverError);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/delivery");
  
  return { success: true };
}
