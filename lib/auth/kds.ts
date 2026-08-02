import { cookies } from "next/headers";
import { getRequiredEnv } from "@/lib/env";
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
  return getRequiredEnv("KDS_SESSION_SECRET", { minLength: 32 });
}

export function verifyKdsPassword(password: string): boolean {
  const expectedPassword = getRequiredEnv("KDS_PASSWORD", { minLength: 8 });
  return timingSafeEqual(password, expectedPassword);
}

export async function createKdsSessionToken(): Promise<string> {
  return createSignedToken("kds", getKdsSessionSecret(), KDS_SESSION_MAX_AGE_SECONDS);
}

export async function verifyKdsSessionToken(token: string): Promise<boolean> {
  const secret = getRequiredEnv("KDS_SESSION_SECRET", { minLength: 32 });
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
