"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth/admin";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { OrderRow } from "./dashboard";
import { OrderItemRow } from "./orders";

export type KdsOrder = OrderRow & {
  order_items: OrderItemRow[];
};

export async function getKdsOrders(): Promise<KdsOrder[]> {
  const hasKdsAccess = await isKdsAuthenticated();
  if (!hasKdsAccess) return [];

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`*, order_items(*)`)
    .eq("status", "cooking")   // Only confirmed orders — pending stays in dashboard queue
    .order("created_at", { ascending: true }); // Oldest first

  if (error) {
    console.error("getKdsOrders error:", error);
    return [];
  }
  return data as KdsOrder[];
}

export async function updateKdsOrderStatus(
  orderId: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  const hasKdsAccess = await isKdsAuthenticated();
  if (!hasKdsAccess) return { success: false, error: "Unauthorized" };

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) {
    console.error("updateKdsOrderStatus error:", error);
    return { success: false, error: error.message };
  }

  // Revalidate both views so dashboard stays in sync with KDS
  revalidatePath("/kds");
  revalidatePath("/dashboard");
  
  return { success: true };
}

export async function logoutKds() {
  (await cookies()).delete("kds_session");
  redirect("/kds/login");
}

export async function loginKds(password: string): Promise<{ success: boolean; error?: string }> {
  const correctPassword = process.env.KDS_PASSWORD;
  if (!correctPassword) return { success: false, error: "KDS password not configured on server." };

  if (password === correctPassword) {
    (await cookies()).set("kds_session", "true", { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
    return { success: true };
  }
  return { success: false, error: "Invalid password" };
}

export async function isKdsAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const hasKdsSession = cookieStore.get("kds_session")?.value === "true";
  if (hasKdsSession) return true;
  const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!adminToken) return false;
  return verifyAdminSessionToken(adminToken);
}
