"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/auth/admin";
import {
  createKdsSessionToken,
  getKdsSessionCookieOptions,
  isKdsSessionValid,
  isValidKdsStatus,
  KDS_SESSION_COOKIE,
  verifyKdsPassword,
} from "@/lib/auth/kds";
import { fetchCookingOrders } from "@/lib/kds/orders";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { cookies, headers } from "next/headers";
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

  try {
    return (await fetchCookingOrders()) as KdsOrder[];
  } catch (error) {
    console.error("getKdsOrders error:", error);
    return [];
  }
}

export async function updateKdsOrderStatus(
  orderId: string,
  newStatus: string
): Promise<{ success: boolean; error?: string }> {
  const hasKdsAccess = await isKdsAuthenticated();
  if (!hasKdsAccess) return { success: false, error: "Unauthorized" };

  if (!isValidKdsStatus(newStatus)) {
    return { success: false, error: "Invalid order status" };
  }

  const { error } = await supabaseAdmin
    .from("orders")
    .update({ status: newStatus })
    .eq("id", orderId);

  if (error) {
    console.error("updateKdsOrderStatus error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/kds");
  revalidatePath("/dashboard");

  return { success: true };
}

export async function logoutKds() {
  (await cookies()).delete(KDS_SESSION_COOKIE);
  redirect("/kds/login");
}

export async function loginKds(password: string): Promise<{ success: boolean; error?: string }> {
  const headerStore = await headers();
  const ip = getClientIp(headerStore);

  const ipLimit = await rateLimit(`kds-login:ip:${ip}`, 10, 60 * 60 * 1000);
  if (ipLimit.limited) {
    return {
      success: false,
      error: `Too many login attempts. Please try again in ${ipLimit.retryAfter} seconds.`,
    };
  }

  if (!process.env.KDS_PASSWORD) {
    return { success: false, error: "KDS password not configured on server." };
  }

  if (verifyKdsPassword(password)) {
    const token = await createKdsSessionToken();
    (await cookies()).set(KDS_SESSION_COOKIE, token, getKdsSessionCookieOptions());
    return { success: true };
  }

  return { success: false, error: "Invalid password" };
}

export async function isKdsAuthenticated(): Promise<boolean> {
  if (await isKdsSessionValid()) return true;

  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!adminToken) return false;
  return verifyAdminSessionToken(adminToken);
}
