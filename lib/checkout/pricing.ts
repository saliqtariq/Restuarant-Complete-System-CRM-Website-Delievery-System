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
  gst: number;
  grandTotal: number;
  items: ValidatedOrderItem[];
};

async function resolveUnitPrice(name: string): Promise<number | null> {
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
  return catalogItem?.price ?? null;
}

export async function calculateOrderTotals(
  items: CheckoutCartItem[],
  orderType: "pickup" | "delivery"
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

    const unitPrice = await resolveUnitPrice(item.name);
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

  const deliveryFee = orderType === "pickup" ? 0 : subtotal > 0 ? DELIVERY_FEE : 0;
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + deliveryFee + gst;

  return {
    subtotal,
    deliveryFee,
    gst,
    grandTotal,
    items: validatedItems,
  };
}

export { parseDisplayPrice };
