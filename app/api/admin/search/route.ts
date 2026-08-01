import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() || "";

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const cleanQuery = query.toLowerCase();

    // 1. Fetch Orders without restrictive limit
    const { data: allOrders, error: ordersErr } = await supabaseAdmin
      .from("orders")
      .select("id, order_number, customer_name, phone, grand_total, status, order_type, created_at")
      .order("created_at", { ascending: false });

    if (ordersErr) {
      console.error("Orders search db error:", ordersErr);
    }

    const matchingOrders = (allOrders || []).filter((o) => {
      const idStr = String(o.id || "").toLowerCase();
      const numStr = String(o.order_number || "").toLowerCase();
      const formattedNum = `ord-${numStr}`.toLowerCase();
      const formattedId = `ord-${idStr}`.toLowerCase();

      const nameStr = String(o.customer_name || "").toLowerCase();
      const phoneStr = String(o.phone || "").toLowerCase();
      const statusStr = String(o.status || "").toLowerCase();
      const typeStr = String(o.order_type || "").toLowerCase();

      return (
        numStr.includes(cleanQuery) ||
        idStr.includes(cleanQuery) ||
        formattedNum.includes(cleanQuery) ||
        formattedId.includes(cleanQuery) ||
        nameStr.includes(cleanQuery) ||
        phoneStr.includes(cleanQuery) ||
        statusStr.includes(cleanQuery) ||
        typeStr.includes(cleanQuery)
      );
    }).slice(0, 15);

    // 2. Fetch Order Items matching the text
    const { data: matchingOrderItems } = await supabaseAdmin
      .from("order_items")
      .select("order_id, item_name")
      .ilike("item_name", `%${query}%`)
      .limit(10);

    let additionalItemOrders: any[] = [];
    if (matchingOrderItems && matchingOrderItems.length > 0) {
      const itemOrderIds = matchingOrderItems.map((i) => i.order_id);
      const existingIds = new Set(matchingOrders.map((o) => o.id));
      const newIds = itemOrderIds.filter((id) => !existingIds.has(id));

      if (newIds.length > 0) {
        const { data: extraOrders } = await supabaseAdmin
          .from("orders")
          .select("id, order_number, customer_name, phone, grand_total, status, order_type, created_at")
          .in("id", newIds);

        additionalItemOrders = extraOrders || [];
      }
    }

    const finalOrders = [...matchingOrders, ...additionalItemOrders].slice(0, 15);

    // 3. Search Menu Items
    const { data: menuItems } = await supabaseAdmin
      .from("menu_items")
      .select("id, title, category, price, is_available")
      .or(`title.ilike.%${query}%,category.ilike.%${query}%`)
      .limit(10);

    // 4. Search Catering Requests
    const { data: catering } = await supabaseAdmin
      .from("catering_requests")
      .select("id, name, email, phone, event_type, status")
      .or(`name.ilike.%${query}%,email.ilike.%${query}%,event_type.ilike.%${query}%`)
      .limit(5);

    // Format unified search results
    const results = [
      ...finalOrders.map((o) => ({
        type: "order" as const,
        id: o.id,
        title: `ORD-${o.order_number || String(o.id).slice(0, 6)}`,
        subtitle: `${o.customer_name || "Guest"} • RS ${o.grand_total} • ${o.status.replace(/_/g, " ")}`,
        url: `/dashboard/orders`,
        badge: o.status,
      })),
      ...(menuItems || []).map((m) => ({
        type: "menu" as const,
        id: m.id,
        title: m.title,
        subtitle: `Category: ${m.category} • RS ${m.price}`,
        url: `/dashboard/menu`,
        badge: m.is_available ? "Available" : "Out of Stock",
      })),
      ...(catering || []).map((c) => ({
        type: "catering" as const,
        id: c.id,
        title: `Catering: ${c.name}`,
        subtitle: `${c.event_type || "Event"} • ${c.email}`,
        url: `/dashboard/catering`,
        badge: c.status || "Pending",
      })),
    ];

    return NextResponse.json({ results });
  } catch (error: any) {
    console.error("Dashboard search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
