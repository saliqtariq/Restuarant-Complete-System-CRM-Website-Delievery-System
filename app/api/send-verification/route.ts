import { NextRequest } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { getVerificationEmailHtml } from "@/lib/emails/VerificationEmail";
import { generateOtpCode } from "@/lib/security/otp";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { isBodyParsingError, readJsonBody } from "@/lib/security/request";
import { isValidEmail, normalizeEmail, normalizeText } from "@/lib/security/validation";

const resend = new Resend(process.env.RESEND_API_KEY);
const GENERIC_RESPONSE = {
  success: true,
  message: "If this account can be verified, a code will be sent shortly.",
};

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request.headers);
    const ipLimit = await rateLimit(`send-verification:ip:${ip}`, 10, 60 * 60 * 1000);
    if (ipLimit.limited) {
      return Response.json(
        { error: "Too many verification requests. Please try again later." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter) } }
      );
    }

    const { email, firstName } = await readJsonBody<{
      email?: unknown;
      firstName?: unknown;
    }>(request, 10_000);

    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    const normalizedEmail = normalizeEmail(email);
    const emailLimit = await rateLimit(
      `send-verification:email:${normalizedEmail}`,
      3,
      60 * 60 * 1000
    );
    if (emailLimit.limited) {
      return Response.json(
        { error: "Please wait before requesting another code." },
        { status: 429, headers: { "Retry-After": String(emailLimit.retryAfter) } }
      );
    }

    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();

    if (profileError || !profile) {
      if (profileError) console.error("Profile lookup error:", profileError);
      return Response.json(GENERIC_RESPONSE);
    }

    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.getUserById(profile.id);

    if (authError || !authUser.user) {
      if (authError) console.error("Auth lookup error:", authError);
      return Response.json(GENERIC_RESPONSE);
    }

    if (authUser.user.app_metadata?.email_verified) {
      return Response.json(GENERIC_RESPONSE);
    }

    const code = generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabaseAdmin.from("email_verifications").delete().eq("email", normalizedEmail);

    const { error: dbError } = await supabaseAdmin
      .from("email_verifications")
      .insert({
        email: normalizedEmail,
        user_id: profile.id,
        code,
        expires_at: expiresAt,
      });

    if (dbError) {
      console.error("DB error storing verification code:", dbError);
      return Response.json({ error: "Failed to store verification code" }, { status: 500 });
    }

    const { error: emailError } = await resend.emails.send({
      from: "Abraham's Table <onboarding@resend.dev>",
      to: normalizedEmail,
      subject: "Verify Your Email - Abraham's Table",
      html: getVerificationEmailHtml({
        code,
        firstName: normalizeText(
          String(firstName || authUser.user.user_metadata?.first_name || "there"),
          40
        ),
      }),
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

    console.error("Send verification error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
