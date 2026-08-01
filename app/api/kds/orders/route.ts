import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAdminAuthenticated } from "@/lib/auth/admin";
import { isKdsSessionValid, KDS_SESSION_COOKIE } from "@/lib/auth/kds";
import { fetchCookingOrders } from "@/lib/kds/orders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const cookieStore = await cookies();
  const kdsToken = cookieStore.get(KDS_SESSION_COOKIE)?.value;
  const hasKdsSession = kdsToken ? await isKdsSessionValid() : false;
  const hasAdminSession = !hasKdsSession ? await isAdminAuthenticated() : false;

  if (!hasKdsSession && !hasAdminSession) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await fetchCookingOrders();
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch orders";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
