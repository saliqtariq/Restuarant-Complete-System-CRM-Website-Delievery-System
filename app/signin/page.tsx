"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/backend/supabase";
import { useToastStore } from "@/components/Toast";

export default function SignInPage() {
  const router = useRouter();
  const addToast = useToastStore((s) => s.addToast);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUnverified, setShowUnverified] = useState(false);
  const [resendingFromSignIn, setResendingFromSignIn] = useState(false);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setError(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message === "Invalid login credentials") {
        setError("Invalid email or password. If you don't have an account, please create one first.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    // Check if the user's email has been verified
    if (!data.user?.app_metadata?.email_verified) {
      // Sign out the unverified user immediately
      await supabase.auth.signOut();
      setShowUnverified(true);
      setLoading(false);
      return;
    }

    // Success - redirect to home
    addToast({
      name: "Welcome Back!",
      description: "You have successfully signed in.",
    });
    router.push("/");
    router.refresh(); // Refresh to update nav state
  };

  const handleResendFromSignIn = async () => {
    setResendingFromSignIn(true);
    setError(null);
    try {
      const res = await fetch("/api/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        router.push(`/verify-email?email=${encodeURIComponent(email)}`);
      } else {
        const resData = await res.json();
        setError(resData.error || "Failed to resend verification email.");
        setResendingFromSignIn(false);
      }
    } catch {
      setError("Failed to resend. Please try again.");
      setResendingFromSignIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 pb-12 px-4">
      <div className="w-full max-w-100 flex flex-col items-center">

        {/* Logo */}
        <div className="relative w-20 h-20 mb-2">
          <Image
            src="/Mainlogowithnotext.png"
            alt="Abraham's Table Logo"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Heading */}
        <h1
          className="text-[#4a1c0d] text-4xl m-0 tracking-wider font-bold"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          SIGN IN
        </h1>

        {/* Form */}
        <form
          className="w-full mt-4"
          onSubmit={handleSignIn}
        >
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md border border-red-200">
              {error}
            </div>
          )}
          {/* Unverified Email Notice */}
          {showUnverified && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-md">
              <div className="flex items-start gap-2.5">
                <svg className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.072 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <div>
                  <p className="text-amber-800 text-sm font-semibold mb-1">Email Not Verified</p>
                  <p className="text-amber-700 text-xs mb-2 leading-relaxed">
                    Please verify your email address before signing in. Check your inbox for the verification code.
                  </p>
                  <button
                    type="button"
                    onClick={handleResendFromSignIn}
                    disabled={resendingFromSignIn}
                    className="text-xs text-[#a62116] font-bold hover:underline disabled:text-gray-400 transition-colors cursor-pointer"
                  >
                    {resendingFromSignIn ? "Sending..." : "Resend Verification Email \u2192"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="signin-email"
              className="block text-xs text-black mb-0.5 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="signin-email"
              className="w-full bg-transparent border-0 border-b border-gray-300 py-1.5 text-[#4a1c0d] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#a62116]"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-2">
            <label
              htmlFor="signin-password"
              className="block text-xs text-black mb-0.5 font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="signin-password"
                className="w-full bg-transparent border-0 border-b border-gray-300 py-1.5 pr-8 text-[#4a1c0d] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#a62116]"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#4a1c0d] transition-colors p-0.5"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={16} strokeWidth={2} />
                ) : (
                  <Eye size={16} strokeWidth={2} />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-1">
            <Link
              href="/forgot-password"
              className="text-xs text-[#4a1c0d] font-bold hover:text-[#a62116] transition-colors underline underline-offset-2"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="space-y-2 mb-4">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={agreeTerms}
                  onChange={() => setAgreeTerms((prev) => !prev)}
                />
                <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-gray-300 peer-checked:bg-[#4a1c0d] peer-checked:border-[#4a1c0d] transition-colors duration-200 flex items-center justify-center">
                  {agreeTerms && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 leading-relaxed font-medium">
                I agree to the{" "}
                <Link href="/terms" className="text-[#a62116] hover:underline transition-colors">Terms &amp; Conditions</Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#a62116] hover:underline transition-colors">Privacy Policy</Link>.
              </span>
            </label>

            {/* Email Marketing Checkbox */}
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <div className="relative flex items-center justify-center mt-0.5 shrink-0">
                <input
                  type="checkbox"
                  className="peer sr-only"
                  checked={emailMarketing}
                  onChange={() => setEmailMarketing((prev) => !prev)}
                />
                <div className="w-4 h-4 rounded-[3px] border-[1.5px] border-gray-300 peer-checked:bg-[#4a1c0d] peer-checked:border-[#4a1c0d] transition-colors duration-200 flex items-center justify-center">
                  {emailMarketing && (
                    <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-xs text-gray-500 leading-relaxed font-medium">
                Send me emails about exclusive offers, new marketing campaigns, and updates from Abraham&apos;s Table.
              </span>
            </label>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a1c0d] hover:bg-[#3a1509] disabled:bg-gray-400 text-white uppercase tracking-[0.15em] py-3 px-5 rounded-none transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1.05rem" }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            {loading ? "Signing In..." : "Sign In"}
          </button>

          {/* Create an Account */}
          <Link
            href="/signup"
            className="mt-3 w-full text-center border-2 border-[#4a1c0d] text-[#4a1c0d] uppercase tracking-[0.15em] py-3 px-5 rounded-none transition-all duration-300 hover:bg-[#f5f0ed] block"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1rem" }}
          >
            Create an Account
          </Link>
        </form>
      </div>
    </div>
  );
}
