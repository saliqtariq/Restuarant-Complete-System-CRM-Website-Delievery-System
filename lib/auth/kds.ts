import { cookies } from "next/headers";
import {
  createSignedToken,
  timingSafeEqual,
  verifySignedToken,
} from "@/lib/security/crypto";

export const KDS_SESSION_COOKIE = "kds_session";
const KDS_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export const KDS_ALLOWED_STATUSES = ["ready", "out_for_delivery", "delivered"] as const;
export type KdsOrderStatus = (typeof KDS_ALLOWED_STATUSES)[number];

function getKdsSessionSecret(): string {
  const secret = process.env.KDS_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("KDS_SESSION_SECRET or ADMIN_SESSION_SECRET must be set and at least 32 characters");
  }
  return secret;
}

export function verifyKdsPassword(password: string): boolean {
  const expectedPassword = process.env.KDS_PASSWORD;
  if (!expectedPassword) return false;
  return timingSafeEqual(password, expectedPassword);
}

export async function createKdsSessionToken(): Promise<string> {
  return createSignedToken("kds", getKdsSessionSecret(), KDS_SESSION_MAX_AGE_SECONDS);
}

export async function verifyKdsSessionToken(token: string): Promise<boolean> {
  const secret = process.env.KDS_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) return false;
  return verifySignedToken(token, secret, "kds");
}

export function getKdsSessionCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: KDS_SESSION_MAX_AGE_SECONDS,
  };
}

export async function isKdsSessionValid(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(KDS_SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifyKdsSessionToken(token);
}

export function isValidKdsStatus(status: string): status is KdsOrderStatus {
  return (KDS_ALLOWED_STATUSES as readonly string[]).includes(status);
}
