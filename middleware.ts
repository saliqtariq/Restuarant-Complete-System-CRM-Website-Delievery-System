import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  verifyAdminSessionToken,
} from "@/lib/auth/admin";

export async function middleware(req: NextRequest) {
  const url = req.nextUrl;

  if (url.pathname.startsWith("/dashboard")) {
    const token = req.cookies.get(ADMIN_SESSION_COOKIE)?.value;
    const isAuthenticated = token ? await verifyAdminSessionToken(token) : false;

    if (!isAuthenticated) {
      const response = NextResponse.redirect(new URL("/admin/login", req.url));
      response.cookies.delete(ADMIN_SESSION_COOKIE);
      return response;
    }
  }

  if (url.pathname === "/admin") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin"],
};
