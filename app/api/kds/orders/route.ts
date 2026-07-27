import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  // Check KDS session cookie OR admin session
  const cookieStore = await cookies();
  const hasKdsSession = cookieStore.get("kds_session")?.value === "true";
  const hasAdminSession = !hasKdsSession ? await isAdminAuthenticated() : false;

  if (!hasKdsSession && !hasAdminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(`*, order_items(*)`)
    .eq("status", "cooking")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}
