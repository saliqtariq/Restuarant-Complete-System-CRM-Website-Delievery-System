import { NextRequest } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { getVerificationEmailHtml } from "@/lib/emails/VerificationEmail";
import { generateOtpCode } from "@/lib/security/otp";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { isBodyParsingError, readJsonBody } from "@/lib/security/request";
import { isValidEmail, normalizeEmail, normalizeText } from "@/lib/security/validation";

const resend = new Resend(process.env.RESEND_API_KEY);
const RESEND_COOLDOWN_MS = 60 * 1000;
const GENERIC_RESPONSE = {
  success: true,
  message: "If a pending verification exists, a code will be sent shortly.",
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const ipLimit = await rateLimit(`resend-verification:ip:${ip}`, 10, 60 * 60 * 1000);
    if (ipLimit.limited) {
      return Response.json(
        { error: "Too many verification requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const { email } = await readJsonBody<{ email?: unknown }>(request, 10_000);

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    const emailLimit = await rateLimit(
      `resend-verification:email:${normalizedEmail}`,
      3,
      60 * 60 * 1000
    );
    if (emailLimit.limited) {
      return Response.json(
        { error: "Please wait before requesting another code" },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } }
      );
    }

    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("email_verifications")
      .select("user_id, created_at")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (lookupError || !existing) {
      if (lookupError) console.error("Verification lookup error:", lookupError);
      return Response.json(GENERIC_RESPONSE);
    }

    if (existing.created_at) {
      const elapsed = Date.now() - new Date(existing.created_at).getTime();
      if (elapsed < RESEND_COOLDOWN_MS) {
        return Response.json(
          { error: "Please wait before requesting another code" },
          { status: 429 }
        );
      }
    }

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(existing.user_id);

    if (authError || !authUser.user) {
      if (authError) console.error("Auth lookup error:", authError);
      return Response.json(GENERIC_RESPONSE);
    }

    if (authUser.user.app_metadata?.email_verified) {
      return Response.json(GENERIC_RESPONSE);
    }

    const firstName = normalizeText(
      String(authUser.user.user_metadata?.first_name || "there"),
      40
    );
    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const { error: dbError } = await supabaseAdmin
      .from("email_verifications")
      .update({
        code,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
      })
      .eq("email", normalizedEmail);

    if (dbError) {
      console.error("DB error updating verification code:", dbError);
      return Response.json({ error: "Failed to generate new code" }, { status: 500 });
    }

    const { error: emailError } = await resend.emails.send({
      from: "Abraham's Table <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: "Verify Your Email - Abraham's Table",
      html: getVerificationEmailHtml({ code, firstName }),
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      return Response.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return Response.json(GENERIC_RESPONSE);
  } catch (err) {
    if (isBodyParsingError(err)) {
      const message = err instanceof Error ? err.message : "Invalid request body";
      const status = message.includes("large") ? 413 : 400;
      return Response.json({ error: message }, { status });
    }

    console.error("Resend verification error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
