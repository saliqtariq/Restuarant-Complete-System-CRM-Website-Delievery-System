import { NextRequest } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";

export async function POST(request: NextRequest) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return Response.json({ error: "Email and code are required" }, { status: 400 });
    }

    // Look up the verification record
    const { data, error: dbError } = await supabaseAdmin
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (dbError || !data) {
      return Response.json(
        { error: "Invalid verification code. Please check and try again." },
        { status: 400 }
      );
    }

    // Check expiry
    if (new Date(data.expires_at) < new Date()) {
      return Response.json(
        { error: "Verification code has expired. Please request a new one.", expired: true },
        { status: 400 }
      );
    }

    // Code is valid — mark the user's email as verified via app_metadata
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      data.user_id,
      { app_metadata: { email_verified: true } }
    );

    if (updateError) {
      console.error("Failed to update user app_metadata:", updateError);
      return Response.json({ error: "Failed to verify email" }, { status: 500 });
    }

    // Clean up the verification record
    await supabaseAdmin.from("email_verifications").delete().eq("email", email);

    return Response.json({ success: true, verified: true });
  } catch (err) {
    console.error("Verify email error:", err);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
