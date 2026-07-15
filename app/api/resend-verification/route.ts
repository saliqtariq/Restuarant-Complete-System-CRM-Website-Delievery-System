import { NextRequest } from "next/server";
import { Resend } from "resend";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { getVerificationEmailHtml } from "@/lib/emails/VerificationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: "Email is required" }, { status: 400 });
    }

    // Look up existing verification record to get user_id
    const { data: existing } = await supabaseAdmin
      .from("email_verifications")
      .select("user_id")
      .eq("email", email)
      .single();

    if (!existing) {
      return Response.json(
        { error: "No pending verification found for this email. Please sign up first." },
        { status: 404 }
      );
    }

    // Get user data for the greeting name
    const { data: { user } } = await supabaseAdmin.auth.admin.getUserById(existing.user_id);
    const firstName = user?.user_metadata?.first_name || "there";

    // Generate new 6-digit OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Update the existing record with the new code
    const { error: dbError } = await supabaseAdmin
      .from("email_verifications")
      .update({ code, expires_at: expiresAt })
      .eq("email", email);

    if (dbError) {
      console.error("DB error updating verification code:", dbError);
      return Response.json({ error: "Failed to generate new code" }, { status: 500 });
    }

    // Send email via Resend
    const { error: emailError } = await resend.emails.send({
      from: "Abraham's Table <onboarding@resend.dev>",
      to: email,
      subject: "Verify Your Email — Abraham's Table",
      html: getVerificationEmailHtml({ code, firstName }),
    });

    if (emailError) {
      console.error("Resend email error:", emailError);
      return Response.json({ error: "Failed to send verification email" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Resend verification error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
