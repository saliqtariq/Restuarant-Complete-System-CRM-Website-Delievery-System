import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { verifyOtp } from "@/lib/security/crypto";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { isBodyParsingError, readJsonBody } from "@/lib/security/request";
import { isValidEmail, isValidOtp, normalizeEmail } from "@/lib/security/validation";

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const ipLimit = await rateLimit(`verify-email:ip:${ip}`, 30, 60 * 60 * 1000);
    if (ipLimit.limited) {
      return Response.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const { email, code } = await readJsonBody<{
      email?: unknown;
      code?: unknown;
    }>(request, 10_000);

    if (
      typeof email !== "string" ||
      typeof code !== "string" ||
      !isValidEmail(email) ||
      !isValidOtp(code)
    ) {
      return Response.json({ error: "Email and code are required" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);

    const failLimit = await rateLimit(
      `verify-email:fail:${normalizedEmail}`,
      MAX_FAILED_ATTEMPTS,
      LOCK_MINUTES * 60 * 1000
    );
    if (failLimit.limited) {
      return Response.json(
        {
          error: `Too many failed attempts. Please wait ${LOCK_MINUTES} minutes or request a new code.`,
        },
        { status: 429, headers: { "Retry-After": String(failLimit.retryAfter) } }
      );
    }

    const emailLimit = await rateLimit(
      `verify-email:email:${normalizedEmail}`,
      10,
      60 * 60 * 1000
    );
    if (emailLimit.limited) {
      return Response.json(
        { error: "Too many verification attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } }
      );
    }

    const { data, error: dbError } = await supabaseAdmin
      .from("email_verifications")
      .select("email, user_id, code, expires_at")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (dbError || !data) {
      if (dbError) console.error("Verification lookup error:", dbError);
      return Response.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    if (new Date(data.expires_at) < new Date()) {
      return Response.json(
        { error: "Verification code has expired. Please request a new one.", expired: true },
        { status: 400 }
      );
    }

    const codeValid = await verifyOtp(code, data.code);
    if (!codeValid) {
      return Response.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      data.user_id,
      { app_metadata: { email_verified: true } }
    );

    if (updateError) {
      console.error("Failed to update user app_metadata:", updateError);
      return Response.json({ error: "Failed to verify email" }, { status: 500 });
    }

    await supabaseAdmin.from("email_verifications").delete().eq("email", normalizedEmail);

    return Response.json({ success: true, verified: true });
  } catch (err) {
    if (isBodyParsingError(err)) {
      const message = err instanceof Error ? err.message : "Invalid request body";
      const status = message.includes("large") ? 413 : 400;
      return Response.json({ error: message }, { status });
    }

    console.error("Verify email error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
