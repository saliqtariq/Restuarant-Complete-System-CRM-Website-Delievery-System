import { getRequiredEnv } from "@/lib/env";

export function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

function base64UrlEncode(value: string): string {
  return btoa(value)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(value: string): string {
  let base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return atob(base64);
}

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

export async function signPayload(payload: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return arrayBufferToBase64Url(signature);
}

export async function createSignedToken(
  subject: string,
  secret: string,
  maxAgeSeconds: number
): Promise<string> {
  const payload = JSON.stringify({
    sub: subject,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
    iat: Math.floor(Date.now() / 1000),
  });
  const payloadEncoded = base64UrlEncode(payload);
  const signature = await signPayload(payloadEncoded, secret);
  return `${payloadEncoded}.${signature}`;
}

export async function verifySignedToken(
  token: string,
  secret: string,
  expectedSubject: string
): Promise<boolean> {
  try {
    const [payloadEncoded, signature] = token.split(".");
    if (!payloadEncoded || !signature) return false;

    const expectedSignature = await signPayload(payloadEncoded, secret);
    if (!timingSafeEqual(signature, expectedSignature)) return false;

    const payload = JSON.parse(base64UrlDecode(payloadEncoded)) as {
      sub?: string;
      exp?: number;
    };

    if (payload.sub !== expectedSubject) return false;
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) return false;

    return true;
  } catch {
    return false;
  }
}

export async function hashOtp(code: string): Promise<string> {
  const pepper = getRequiredEnv("OTP_PEPPER", { minLength: 16 });
  const data = new TextEncoder().encode(`${code}:${pepper}`);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  
  // Convert ArrayBuffer to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function verifyOtp(code: string, storedHash: string): Promise<boolean> {
  const computed = await hashOtp(code);
  return timingSafeEqual(computed, storedHash);
}
