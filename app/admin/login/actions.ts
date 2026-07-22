"use server";

import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getAdminSessionCookieOptions,
  verifyAdminCredentials,
} from "@/lib/auth/admin";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const user = String(formData.get("username") ?? "").trim();
  const pass = String(formData.get("password") ?? "");
  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const usernameKey = user.toLowerCase() || "empty";

  const ipLimit = await rateLimit(`admin-login:ip:${ip}`, 20, 60 * 60 * 1000);
  const userLimit = await rateLimit(
    `admin-login:user:${usernameKey}:${ip}`,
    5,
    15 * 60 * 1000
  );

  if (ipLimit.limited || userLimit.limited) {
    const retryAfter = Math.max(ipLimit.retryAfter, userLimit.retryAfter);
    return {
      error: `Too many login attempts. Please try again in ${retryAfter} seconds.`,
    };
  }

  if (verifyAdminCredentials(user, pass)) {
    const token = await createAdminSessionToken();
    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_COOKIE, token, getAdminSessionCookieOptions());
    redirect("/dashboard");
  }

  return { error: "Invalid username or password" };
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_SESSION_COOKIE);
  redirect("/admin/login");
}
