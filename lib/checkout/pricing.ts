import { supabaseAdmin } from "@/backend/supabaseServer";
import { calculateCouponDiscount, isCouponValid } from "@/lib/checkout/coupon";
import { getCatalogItem } from "@/lib/menu/catalog";

const DELIVERY_FEE = 150;
const GST_RATE = 0.16;

export type CheckoutCartItem = {
  name: string;
  price: string; // kept for display only — NEVER used for price calculation
  image: string;
  quantity: number;
};

export type ValidatedOrderItem = {
  item_name: string;
  quantity: number;
  price: string;
  image: string;
  unitPrice: number;
};

export type OrderTotals = {
  subtotal: number;
  deliveryFee: number;
  discount: number;
  gst: number;
  grandTotal: number;
  items: ValidatedOrderItem[];
};

/**
 * Resolve the authoritative unit price for an item strictly from the database.
 * The client-sent price is NEVER used — this prevents price manipulation attacks.
 * Returns null if:
 *   - The item does not exist in the database
 *   - The item is marked as unavailable
 */
async function resolveUnitPrice(name: string): Promise<{ price: number; image: string } | null> {
  const { data: menuItem } = await supabaseAdmin
    .from("menu_items")
    .select("name, price, is_available, image_url")
    .ilike("name", name.trim())
    .maybeSingle();

  // If not found in database table, fallback to static CATALOG if present
  if (!menuItem) {
    const catalogItem = getCatalogItem(name);
    if (catalogItem) {
      return {
        price: catalogItem.price,
        image: catalogItem.image,
      };
    }
    return null;
  }

  // Item marked unavailable → reject
  if (menuItem.is_available === false) return null;

  return {
    price: Number(menuItem.price),
    image: menuItem.image_url || "",
  };
}

export async function calculateOrderTotals(
  items: CheckoutCartItem[],
  orderType: "pickup" | "delivery",
  couponCode?: string
): Promise<OrderTotals> {
  if (!items.length) {
    throw new Error("Cart is empty");
  }

  let subtotal = 0;
  const validatedItems: ValidatedOrderItem[] = [];

  for (const item of items) {
    if (!item.name || !Number.isInteger(item.quantity) || item.quantity <= 0) {
      throw new Error("Invalid cart item");
    }

    const resolved = await resolveUnitPrice(item.name);

    if (resolved === null) {
      // Item unknown or unavailable — reject the entire order with a clear message
      throw new Error(`"${item.name}" is not available or does not exist on our menu.`);
    }

    const lineTotal = resolved.price * item.quantity;
    subtotal += lineTotal;

    validatedItems.push({
      item_name: item.name,
      quantity: item.quantity,
      price: `RS ${resolved.price}`,
      // Use DB image if available, fall back to client-sent image (images are not a security concern)
      image: resolved.image || item.image || "",
      unitPrice: resolved.price,
    });
  }

  let discount = 0;
  if (couponCode) {
    const { data: coupon } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", couponCode)
      .eq("is_active", true)
      .single();

    if (coupon) {
      if (isCouponValid(coupon, subtotal)) {
        discount = calculateCouponDiscount(coupon, subtotal);
      }
    }
  }

  const deliveryFee = orderType === "pickup" ? 0 : subtotal > 0 ? DELIVERY_FEE : 0;
  const taxableAmount = Math.max(0, subtotal - discount);
  const gst = taxableAmount * GST_RATE;
  const grandTotal = taxableAmount + deliveryFee + gst;

  return {
    subtotal,
    deliveryFee,
    discount,
    gst,
    grandTotal,
    items: validatedItems,
  };
}

export { parseDisplayPrice } from "@/lib/menu/catalog";
