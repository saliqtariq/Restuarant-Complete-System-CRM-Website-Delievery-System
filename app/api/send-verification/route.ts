import { NextRequest } from "next/server";
import { sendVerificationCode } from "@/lib/emails/sendVerificationCode";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { isBodyParsingError, readJsonBody } from "@/lib/security/request";
import { isValidEmail, normalizeEmail } from "@/lib/security/validation";

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

    const result = await sendVerificationCode({
      email: normalizedEmail,
      firstName: typeof firstName === "string" ? firstName : undefined,
      mode: "initial",
    });

    if (!result.ok) {
      return Response.json({ error: result.error }, { status: result.status });
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
