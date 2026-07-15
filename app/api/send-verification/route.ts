import { NextRequest } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { getVerificationEmailHtml } from "@/lib/emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, firstName, userId } = await request.json();

    if (!email || !userId) {
      return Response.json({ error: "Email and userId are required" }, { status: 400 });
    }

    // Generate 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Delete any existing codes for this email
    await supabaseAdmin.from("email_verifications").delete().eq("email", email);

    // Store the new code
    const { error: dbError } = await supabaseAdmin
      .from("email_verifications")
      .insert({ email, user_id: userId, code, expires_at: expiresAt });

    if (dbError) {
      console.error("DB error storing verification code:", dbError);
      return Response.json({ error: "Failed to store verification code" }, { status: 500 });
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Abraham's Table <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Email — Abraham's Table",
      html: getVerificationEmailHtml({ code, firstName: firstName || "there" }),
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      return Response.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Send verification error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
