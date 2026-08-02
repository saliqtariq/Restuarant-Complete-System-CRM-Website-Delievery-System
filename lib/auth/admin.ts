import { cookies } from "next/headers";
import { getRequiredEnv } from "@/lib/env";
import {
  createSignedToken,
  timingSafeEqual,
  verifySignedToken,
} from "@/lib/security/crypto";

export const ADMIN_SESSION_COOKIE = "admin_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24;

function getSessionSecret(): string {
  return getRequiredEnv("ADMIN_SESSION_SECRET", { minLength: 32 });
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = getRequiredEnv("ADMIN_USERNAME", { minLength: 1 });
  const expectedPassword = getRequiredEnv("ADMIN_PASSWORD", { minLength: 8 });

  return (
    timingSafeEqual(username, expectedUsername) &&
    timingSafeEqual(password, expectedPassword)
  );
}

export async function createAdminSessionToken(): Promise<string> {
  return createSignedToken("admin", getSessionSecret(), SESSION_MAX_AGE_SECONDS);
}

export async function verifyAdminSessionToken(token: string): Promise<boolean> {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  return verifySignedToken(token, secret, "admin");
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token);
}

export async function requireAdmin(): Promise<void> {
  if (!(await isAdminAuthenticated())) {
    throw new Error("Unauthorized");
  }
}

export function getAdminSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
