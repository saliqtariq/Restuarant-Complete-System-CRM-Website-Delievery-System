import { Resend } from "resend";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { getVerificationEmailHtml } from "@/lib/emails/VerificationEmail";
import { getRequiredEnv } from "@/lib/env";
import { generateOtpCode } from "@/lib/security/otp";
import { hashOtp } from "@/lib/security/crypto";
import { normalizeText } from "@/lib/security/validation";

const resend = new Resend(getRequiredEnv("RESEND_API_KEY", { minLength: 20 }));
const OTP_EXPIRY_MS = 10 * 60 * 1000;

export type SendVerificationResult =
  | { ok: true }
  | { ok: false; error: string; status: number };

export async function sendVerificationCode(params: {
  email: string;
  firstName?: string;
  mode: "initial" | "resend";
  resendCooldownMs?: number;
}): Promise<SendVerificationResult> {
  const { email, firstName, mode, resendCooldownMs = 60 * 1000 } = params;
  const normalizedEmail = email;
  const code = generateOtpCode();
  const codeHash = await hashOtp(code);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MS).toISOString();

  if (mode === "initial") {
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (profileError || !profile) {
      if (profileError) console.error("Profile lookup error:", profileError);
      return { ok: true };
    }

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(profile.id);

    if (authError || !authUser.user) {
      if (authError) console.error("Auth lookup error:", authError);
      return { ok: true };
    }

    if (authUser.user.app_metadata?.email_verified) {
      return { ok: true };
    }

    await supabaseAdmin.from("email_verifications").delete().eq("email", normalizedEmail);

    const { error: dbError } = await supabaseAdmin
      .from("email_verifications")
      .insert({
        email: normalizedEmail,
        user_id: profile.id,
        code: codeHash,
        expires_at: expiresAt,
      });

    if (dbError) {
      console.error("DB error storing verification code:", dbError);
      return { ok: false, error: "Failed to store verification code", status: 500 };
    }

    const resolvedFirstName = normalizeText(
      String(firstName || authUser.user.user_metadata?.first_name || "there"),
      40
    );

    return sendEmail(normalizedEmail, code, resolvedFirstName);
  }

  // resend mode
  const { data: existing, error: lookupError } = await supabaseAdmin
    .from("email_verifications")
    .select("user_id, created_at")
    .eq("email", normalizedEmail)
    .maybeSingle();

  if (lookupError || !existing) {
    if (lookupError) console.error("Verification lookup error:", lookupError);
    return { ok: true };
  }

  if (existing.created_at) {
    const elapsed = Date.now() - new Date(existing.created_at).getTime();
    if (elapsed < resendCooldownMs) {
      return { ok: false, error: "Please wait before requesting another code", status: 429 };
    }
  }

  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.getUserById(existing.user_id);

  if (authError || !authUser.user) {
    if (authError) console.error("Auth lookup error:", authError);
    return { ok: true };
  }

  if (authUser.user.app_metadata?.email_verified) {
    return { ok: true };
  }

  const resolvedFirstName = normalizeText(
    String(authUser.user.user_metadata?.first_name || "there"),
    40
  );

  const { error: dbError } = await supabaseAdmin
    .from("email_verifications")
    .update({
      code: codeHash,
      expires_at: expiresAt,
      created_at: new Date().toISOString(),
    })
    .eq("email", normalizedEmail);

  if (dbError) {
    console.error("DB error updating verification code:", dbError);
    return { ok: false, error: "Failed to generate new code", status: 500 };
  }

  return sendEmail(normalizedEmail, code, resolvedFirstName);
}

async function sendEmail(
  email: string,
  code: string,
  firstName: string
): Promise<SendVerificationResult> {
  const { error: emailError } = await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "Abraham's Table <onboarding@resend.dev>",
    to: email,
    subject: "Verify Your Email - Abraham's Table",
    html: getVerificationEmailHtml({ code, firstName }),
  });

  if (emailError) {
    console.error("Resend email error:", emailError);
    return { ok: false, error: "Failed to send verification email", status: 500 };
  }

  return { ok: true };
}
