import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { calculateOrderTotals } from "@/lib/checkout/pricing";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { isBodyParsingError, readJsonBody } from "@/lib/security/request";
import { isValidPhone, normalizeText } from "@/lib/security/validation";
import { randomInt } from "crypto";
import { z } from "zod";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        name: z.string().trim().min(1).max(500),
        price: z.string().max(50).optional().default(""),
        image: z.string().max(300).optional().default(""),
        quantity: z.number().int().min(1).max(20),
      })
    )
    .min(1)
    .max(30),
  delivery: z.object({
    type: z.enum(["pickup", "delivery"]).optional().default("delivery"),
    fullName: z.string().trim().min(2).max(80),
    phone: z.string().trim().min(7).max(20),
    city: z.string().trim().max(80).optional().default("N/A"),
    address: z.string().trim().max(250).optional().default("N/A"),
    paymentMethod: z
      .enum(["cod", "easypaisa", "jazzcash", "card", "safepay"])
      .optional()
      .default("cod"),
    couponCode: z.string().max(50).optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const limited = await rateLimit(`checkout:${ip}`, 8, 10 * 60 * 1000);
    if (limited.limited) {
      return NextResponse.json(
        { error: "Too many checkout attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    const body = await readJsonBody<unknown>(req, 30_000);
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid checkout details" }, { status: 400 });
    }

    const { items, delivery } = parsed.data;

    if (!isValidPhone(delivery.phone)) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
    }

    const orderType = delivery.type === "pickup" ? "pickup" : "delivery";
    const totals = await calculateOrderTotals(items, orderType, delivery.couponCode);

    const orderNumber = `ORD-${randomInt(100000, 1000000)}`;

    const authHeader = req.headers.get("authorization");
    let userId = null;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      const { data: { user } } = await supabaseAdmin.auth.getUser(token);
      if (user) userId = user.id;
    }

    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          user_id: userId,
          order_number: orderNumber,
          order_type: orderType,
          customer_name: normalizeText(delivery.fullName, 80),
          phone: normalizeText(delivery.phone, 20),
          city: normalizeText(delivery.city || "N/A", 80),
          delivery_address: normalizeText(delivery.address || "N/A", 250),
          subtotal: totals.subtotal,
          delivery_fee: totals.deliveryFee,
          gst: totals.gst,
          grand_total: totals.grandTotal,
          payment_method: delivery.paymentMethod,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order Insert Error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    const orderItems = totals.items.map((item) => ({
      order_id: order.id,
      item_name: item.item_name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order Items Insert Error:", itemsError);
      await supabaseAdmin.from("orders").delete().eq("id", order.id);
      return NextResponse.json({ error: "Failed to save order items" }, { status: 500 });
    }

    return NextResponse.json({ success: true, orderNumber: order.order_number });
  } catch (error) {
    if (isBodyParsingError(error)) {
      const message = error instanceof Error ? error.message : "Invalid request body";
      const status = message.includes("large") ? 413 : 400;
      return NextResponse.json({ error: message }, { status });
    }

    const message = error instanceof Error ? error.message : "Internal Server Error";
    const status = message.includes("Invalid") || message.includes("empty") ? 400 : 500;
    console.error("Checkout API Error:", error);
    return NextResponse.json(
      { error: message },
      { status }
    );
  }
}
