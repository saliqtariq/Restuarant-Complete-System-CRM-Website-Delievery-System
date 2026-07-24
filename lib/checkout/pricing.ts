import { supabaseAdmin } from "@/backend/supabaseServer";
import { getCatalogItem, normalizeItemName, parseDisplayPrice } from "@/lib/menu/catalog";

const DELIVERY_FEE = 150;
const GST_RATE = 0.16;

export type CheckoutCartItem = {
  name: string;
  price: string;
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

async function resolveUnitPrice(name: string, rawPriceStr?: string): Promise<number | null> {
  const normalized = normalizeItemName(name);

  const { data: menuItem } = await supabaseAdmin
    .from("menu_items")
    .select("name, price, is_available")
    .ilike("name", name)
    .maybeSingle();

  if (menuItem) {
    if (menuItem.is_available === false) return null;
    return Number(menuItem.price);
  }

  const catalogItem = getCatalogItem(normalized);
  if (catalogItem) {
    return catalogItem.price;
  }

  // Fallback for custom catering boxes / preset catering items
  if (rawPriceStr) {
    const parsed = parseDisplayPrice(rawPriceStr);
    if (parsed > 0) return parsed;
  }

  return null;
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

    const unitPrice = await resolveUnitPrice(item.name, item.price);
    if (unitPrice === null) {
      throw new Error(`Invalid or unavailable item: ${item.name}`);
    }

    const catalogItem = getCatalogItem(item.name);
    const lineTotal = unitPrice * item.quantity;
    subtotal += lineTotal;

    validatedItems.push({
      item_name: item.name,
      quantity: item.quantity,
      price: `RS ${unitPrice}`,
      image: catalogItem?.image || item.image || "",
      unitPrice,
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
      const isValid =
        (!coupon.expiry_date || new Date(coupon.expiry_date) >= new Date()) &&
        subtotal >= coupon.min_order_amount;
      
      if (isValid) {
        if (coupon.discount_type === "percentage") {
          discount = subtotal * (coupon.discount_amount / 100);
        } else {
          discount = coupon.discount_amount;
        }
        discount = Math.min(discount, subtotal);
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

export { parseDisplayPrice };
