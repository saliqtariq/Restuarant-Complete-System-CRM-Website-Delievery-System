import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";

export async function GET(req: Request) {
  try {
    await requireAdmin();
    const { searchParams } = new URL(req.url);
    const since = searchParams.get("since");

    let query = supabaseAdmin
      .from("orders")
      .select("id, order_number, customer_name, grand_total, order_type, created_at, status")
      .neq("status", "awaiting_payment")
      .order("created_at", { ascending: false })
      .limit(10);

    if (since) {
      query = query.gt("created_at", since);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ orders: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Unauthorized" }, { status: 401 });
  }
}
