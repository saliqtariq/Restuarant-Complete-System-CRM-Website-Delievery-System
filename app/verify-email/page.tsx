"use client";

import Image from "next/image";
import Link from "next/link";
import { Suspense, useState, useRef, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, CheckCircle2, MailOpen } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [verified, setVerified] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Cooldown timer for resend button
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-redirect after successful verification
  useEffect(() => {
    if (verified) {
      const timer = setTimeout(() => router.push("/signin"), 3000);
      return () => clearTimeout(timer);
    }
  }, [verified, router]);

  // Auto-focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 0) return;
    const newOtp = ["", "", "", "", "", ""];
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const focusIndex = Math.min(pasted.length, 5);
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code.");
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Verification failed.");
        if (data.expired) {
          setOtp(["", "", "", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
        setLoading(false);
        return;
      }

      setVerified(true);
      setLoading(false);
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0 || resending) return;

    setResending(true);
    setError(null);

    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setResendCooldown(60);
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to resend code.");
      }
    } catch {
      setError("Failed to resend code. Please try again.");
    }

    setResending(false);
  };

  // Mask the email for display: ab***@gmail.com
  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, (_, a, b, c) => a + "*".repeat(Math.max(b.length, 1)) + c)
    : "";

  /* ── Success state ── */
  if (verified) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center pt-6 pb-12 px-4">
        <div className="w-full max-w-[400px] flex flex-col items-center">
          <div className="relative w-20 h-20 mb-2">
            <Image src="/Mainlogowithnotext.png" alt="Abraham's Table Logo" fill className="object-contain" priority />
          </div>

          <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-4 mt-4 border-2 border-green-200">
            <CheckCircle2 size={40} className="text-green-600" />
          </div>

          <h1
            className="text-[#4a1c0d] text-4xl m-0 tracking-wider font-bold text-center"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            EMAIL VERIFIED!
          </h1>
          <p className="text-gray-500 text-sm text-center mt-2 font-medium">
            Your email has been successfully verified.
            <br />
            Redirecting to sign in...
          </p>

          <Link
            href="/signin"
            className="mt-6 w-full text-center bg-[#4a1c0d] hover:bg-[#3a1509] text-white uppercase tracking-[0.15em] py-3 px-5 rounded-none transition-all duration-300 block"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1.05rem" }}
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  /* ── OTP input state ── */
  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 pb-12 px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Logo */}
        <div className="relative w-20 h-20 mb-2">
          <Image src="/Mainlogowithnotext.png" alt="Abraham's Table Logo" fill className="object-contain" priority />
        </div>

        {/* Mail icon */}
        <div className="w-16 h-16 bg-[#faf7f5] rounded-full flex items-center justify-center mb-3 mt-2 border-2 border-[#e8ddd4]">
          <MailOpen size={28} className="text-[#4a1c0d]" />
        </div>

        {/* Heading */}
        <h1
          className="text-[#4a1c0d] text-4xl m-0 tracking-wider font-bold text-center"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          VERIFY YOUR EMAIL
        </h1>

        <p className="text-gray-500 text-sm text-center mt-2 font-medium max-w-[320px]">
          We&apos;ve sent a 6-digit code to{" "}
          <span className="text-[#4a1c0d] font-semibold">{maskedEmail}</span>
        </p>

        {/* Form */}
        <form className="w-full mt-6" onSubmit={handleVerify}>
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* OTP Inputs */}
          <div className="flex justify-center gap-2.5 mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-2xl font-bold text-[#4a1c0d] border-2 border-gray-200 rounded-lg outline-none transition-all duration-200 focus:border-[#a62116] focus:shadow-[0_0_0_3px_rgba(166,33,22,0.1)] bg-white"
                style={{ fontFamily: "var(--font-bebas)" }}
                id={`otp-input-${i}`}
                autoComplete="one-time-code"
              />
            ))}
          </div>

          {/* Timer hint */}
          <p className="text-[10px] text-gray-400 text-center mb-4">Code expires in 10 minutes</p>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading || otp.join("").length !== 6}
            className="w-full bg-[#4a1c0d] hover:bg-[#3a1509] disabled:bg-gray-400 text-white uppercase tracking-[0.15em] py-3 px-5 rounded-none transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1.05rem" }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            {loading ? "Verifying..." : "Verify Email"}
          </button>

          {/* Resend */}
          <div className="text-center mt-5">
            <p className="text-xs text-gray-400 mb-1.5">Didn&apos;t receive the code?</p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || resending}
              className="text-sm text-[#a62116] font-bold hover:underline disabled:text-gray-400 disabled:no-underline transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              {resending
                ? "Sending..."
                : resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : "Resend Code"}
            </button>
          </div>

          {/* Back to Sign In */}
          <Link
            href="/signin"
            className="mt-5 w-full text-center border-2 border-[#4a1c0d] text-[#4a1c0d] uppercase tracking-[0.15em] py-3 px-5 rounded-none transition-all duration-300 hover:bg-[#f5f0ed] block"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1rem" }}
          >
            Back to Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <Loader2 className="animate-spin text-[#4a1c0d]" size={32} />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
