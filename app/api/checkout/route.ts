import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, delivery, financials } = body;

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // 1. Generate Order Number
    const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // 2. Insert into Orders Table (using Service Role Key to bypass RLS)
    const { data: order, error: orderError } = await supabaseAdmin
      .from("orders")
      .insert([
        {
          order_number: orderNumber,
          customer_name: delivery.fullName,
          phone: delivery.phone,
          city: delivery.city,
          delivery_address: delivery.address,
          subtotal: financials.subtotal,
          delivery_fee: financials.deliveryFee,
          gst: financials.gst,
          grand_total: financials.grandTotal,
          payment_method: delivery.paymentMethod || "cod",
          status: "pending",
          // user_id: we would extract this from an Auth token if the user is signed in
        },
      ])
      .select()
      .single();

    if (orderError || !order) {
      console.error("Order Insert Error:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    // 3. Insert Order Items
    const orderItems = items.map((item: any) => ({
      order_id: order.id,
      item_name: item.name,
      quantity: item.quantity,
      price: item.price,
      image: item.image,
    }));

    const { error: itemsError } = await supabaseAdmin
      .from("order_items")
      .insert(orderItems);

    if (itemsError) {
      console.error("Order Items Insert Error:", itemsError);
      // Depending on strictness, we might delete the order here if items fail
      return NextResponse.json({ error: "Failed to save order items" }, { status: 500 });
    }

    // 4. Return Success
    return NextResponse.json({ success: true, orderNumber: order.order_number });

  } catch (error) {
    console.error("Checkout API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
