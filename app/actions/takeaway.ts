"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/auth/admin";
import {
  createTakeawaySessionToken,
  getTakeawaySessionCookieOptions,
  isTakeawaySessionValid,
  TAKEAWAY_SESSION_COOKIE,
  verifyTakeawayPassword,
} from "@/lib/auth/takeaway";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { calculateOrderTotals } from "@/lib/checkout/pricing";
import { revalidatePath } from "next/cache";
import { randomInt } from "crypto";

export type TakeawayCartItem = {
  name: string;
  price: string;
  image: string;
  quantity: number;
  notes?: string;
};

export type RecentTakeawayOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  subtotal: number;
  gst: number;
  grand_total: number;
  payment_method: TakeawayPaymentMethod;
  status: string;
  created_at: string;
  order_items: {
    item_name: string;
    quantity: number;
    price: string;
  }[];
};

export type CreateTakeawayOrderResult =
  | { success: true; orderNumber: string }
  | { success: false; error: string };

export type TakeawayPaymentMethod = "cash" | "card";

export async function isTakeawayAuthenticated(): Promise<boolean> {
  if (await isTakeawaySessionValid()) return true;

  const cookieStore = await cookies();
  const adminToken = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!adminToken) return false;
  return verifyAdminSessionToken(adminToken);
}

export async function requireTakeawayAuth(): Promise<void> {
  if (!(await isTakeawayAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export async function loginTakeaway(password: string): Promise<{ success: boolean; error?: string }> {
  const headerStore = await headers();
  const ip = getClientIp(headerStore);

  const ipLimit = await rateLimit(`takeaway-login:ip:${ip}`, 10, 60 * 60 * 1000);
  if (ipLimit.limited) {
    return {
      success: false,
      error: `Too many login attempts. Please try again in ${ipLimit.retryAfter} seconds.`,
    };
  }

  if (!process.env.TAKEAWAY_PASSWORD) {
    return { success: false, error: "Takeaway password not configured on server." };
  }

  if (verifyTakeawayPassword(password)) {
    const token = await createTakeawaySessionToken();
    (await cookies()).set(TAKEAWAY_SESSION_COOKIE, token, getTakeawaySessionCookieOptions());
    return { success: true };
  }

  return { success: false, error: "Invalid password" };
}

export async function logoutTakeaway() {
  (await cookies()).delete(TAKEAWAY_SESSION_COOKIE);
  redirect("/takeaway/login");
}

export async function createTakeawayOrder(
  items: TakeawayCartItem[],
  paymentMethod: TakeawayPaymentMethod = "cash"
): Promise<CreateTakeawayOrderResult> {
  try {
    await requireTakeawayAuth();

    if (!items || items.length === 0) {
      return { success: false, error: "Cart is empty." };
    }

    // Validate & price items using the canonical pricing logic (DB prices, not client prices)
    const totals = await calculateOrderTotals(items, "pickup");

    // Generate a clean 4-digit token (1000 - 9999). If taken, retry.
    let orderNumber = String(randomInt(1000, 10000));
    for (let attempts = 0; attempts < 5; attempts++) {
      const { data: existing } = await supabaseAdmin
        .from("orders")
        .select("id")
        .eq("order_number", orderNumber)
        .maybeSingle();

      if (!existing) break;
      orderNumber = String(randomInt(1000, 10000));
    }

    // Insert the order directly as "cooking" — no pending/approval step
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: null,
          order_number: orderNumber,
          order_type: "takeaway",
          customer_name: `Customer #${orderNumber}`,
          phone: "N/A",
          city: "N/A",
          delivery_address: "N/A",
          subtotal: totals.subtotal,
          delivery_fee: 0,
          gst: totals.gst,
          grand_total: totals.grandTotal,
          payment_method: paymentMethod,
          // Directly cooking — skip pending/approval queue
          status: "cooking",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("createTakeawayOrder insert error:", orderError);
      return { success: false, error: "Failed to save order. Please try again." };
    }

    // Build order items, appending optional kitchen notes directly to item_name if present
    const notesMap = new Map<string, string>();
    items.forEach((it) => {
      if (it.notes && it.notes.trim()) {
        notesMap.set(it.name, it.notes.trim());
      }
    });

    const orderItems = totals.items.map((item) => {
      const note = notesMap.get(item.item_name);
      const finalName = note ? `${item.item_name} [Note: ${note}]` : item.item_name;
      return {
        order_id: order.id,
        item_name: finalName,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
      };
    });

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("createTakeawayOrder items insert error:", itemsError);
      // Roll back the order row if items failed
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return { success: false, error: "Failed to save order items. Please try again." };
    }

    // Revalidate so Dashboard and KDS pick up the new order immediately
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/orders");
    revalidatePath("/kds");

    return { success: true, orderNumber };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    console.error("createTakeawayOrder error:", err);
    return { success: false, error: message };
  }
}

export async function getRecentTakeawayOrders(): Promise<RecentTakeawayOrder[]> {
  try {
    await requireTakeawayAuth();

    const { data, error } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, customer_name, subtotal, gst, grand_total, payment_method, status, created_at, order_items(item_name, quantity, price)")
      .eq("order_type", "takeaway")
      .order("created_at", { ascending: false })
      .limit(20);

    if (error) {
      console.error("getRecentTakeawayOrders error:", error);
      return [];
    }

    return (data || []) as unknown as RecentTakeawayOrder[];
  } catch (err) {
    console.error("getRecentTakeawayOrders caught:", err);
    return [];
  }
}
