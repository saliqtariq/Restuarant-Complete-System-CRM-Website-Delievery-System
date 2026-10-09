import { cookies } from "next/headers";
import { getRequiredEnv } from "@/lib/env";
import {
  createSignedToken,
  timingSafeEqual,
  verifySignedToken,
} from "@/lib/security/crypto";

export const TAKEAWAY_SESSION_COOKIE = "takeaway_session";
const TAKEAWAY_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function getTakeawaySessionSecret(): string {
  const secret = process.env.TAKEAWAY_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("TAKEAWAY_SESSION_SECRET must be set and at least 32 characters long.");
  }
  return secret;
}

export function verifyTakeawayPassword(password: string): boolean {
  const expectedPassword = process.env.TAKEAWAY_PASSWORD;
  if (!expectedPassword) return false;
  return timingSafeEqual(password, expectedPassword);
}

export async function createTakeawaySessionToken(): Promise<string> {
  return createSignedToken("takeaway", getTakeawaySessionSecret(), TAKEAWAY_SESSION_MAX_AGE_SECONDS);
}

export async function verifyTakeawaySessionToken(token: string): Promise<boolean> {
  const secret = process.env.TAKEAWAY_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  return verifySignedToken(token, secret, "takeaway");
}

export function getTakeawaySessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: TAKEAWAY_SESSION_MAX_AGE_SECONDS,
  };
}

export async function isTakeawaySessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(TAKEAWAY_SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifyTakeawaySessionToken(token);
}
