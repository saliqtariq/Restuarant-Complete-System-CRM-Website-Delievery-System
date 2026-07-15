"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "@/backend/supabase";

export default function SignUpPage() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      setError("You must agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    setError(null);
    setSuccess(null);
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          dob: dob,
          gender: gender,
          email_marketing: emailMarketing
        }
      }
    });

    if (error) {
      if (error.message === "User already registered") {
        setError("This email is already registered. Please sign in instead.");
      } else {
        setError(error.message);
      }
      setLoading(false);
      return;
    }

    // Send verification email via Resend
    try {
      const verifyRes = await fetch("/api/send-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          firstName,
          userId: data.user?.id,
        }),
      });

      if (!verifyRes.ok) {
        const verifyData = await verifyRes.json();
        setError(verifyData.error || "Failed to send verification email.");
        setLoading(false);
        return;
      }
    } catch {
      setError("Failed to send verification email. Please try again.");
      setLoading(false);
      return;
    }

    // Sign out the user — they must verify before they can use the app
    if (data.session) {
      await supabase.auth.signOut();
    }

    // Redirect to the OTP verification page
    router.push(`/verify-email?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center pt-6 pb-12 px-4">
      <div className="w-full max-w-[400px] flex flex-col items-center">

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
          className="text-[#4a1c0d] text-4xl m-0 tracking-wider font-bold text-center"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          CREATE AN ACCOUNT
        </h1>

        {/* Form */}
        <form
          className="w-full mt-4"
          onSubmit={handleSignUp}
        >
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm font-medium rounded-md border border-red-200">
              {error}
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 text-sm font-medium rounded-md border border-green-200">
              {success}
            </div>
          )}

          {/* Name Row */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="signup-firstName" className="block text-xs text-black mb-0.5 font-medium">
                First Name
              </label>
              <input
                type="text"
                id="signup-firstName"
                className="w-full bg-transparent border-0 border-b border-gray-300 py-1.5 text-[#4a1c0d] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#a62116]"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="signup-lastName" className="block text-xs text-black mb-0.5 font-medium">
                Last Name
              </label>
              <input
                type="text"
                id="signup-lastName"
                className="w-full bg-transparent border-0 border-b border-gray-300 py-1.5 text-[#4a1c0d] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#a62116]"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>

          {/* DOB & Gender Row */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label htmlFor="signup-dob" className="block text-xs text-black mb-0.5 font-medium">
                Date of Birth
              </label>
              <input
                type="date"
                id="signup-dob"
                className="w-full bg-transparent border-0 border-b border-gray-300 py-1.5 text-[#4a1c0d] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#a62116]"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="signup-gender" className="block text-xs text-black mb-0.5 font-medium">
                Gender
              </label>
              <select
                id="signup-gender"
                className="w-full bg-transparent border-0 border-b border-gray-300 py-1.5 text-[#4a1c0d] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#a62116]"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                required
              >
                <option value="" disabled>Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Others">Others</option>
              </select>
            </div>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="signup-email"
              className="block text-xs text-black mb-0.5 font-medium"
            >
              Email
            </label>
            <input
              type="email"
              id="signup-email"
              className="w-full bg-transparent border-0 border-b border-gray-300 py-1.5 text-[#4a1c0d] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#a62116]"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label
              htmlFor="signup-password"
              className="block text-xs text-black mb-0.5 font-medium"
            >
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="signup-password"
                className="w-full bg-transparent border-0 border-b border-gray-300 py-1.5 pr-8 text-[#4a1c0d] text-sm font-medium outline-none transition-colors duration-200 focus:border-[#a62116]"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
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
            <p className="text-[10px] text-gray-500 mt-1">Must be at least 6 characters.</p>
          </div>

          {/* Terms & Conditions Checkbox */}
          <div className="space-y-2 mb-4">
            <label className="flex items-start gap-2.5 cursor-pointer select-none">
              <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
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
              <div className="relative flex items-center justify-center mt-0.5 flex-shrink-0">
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

          {/* Sign Up Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a1c0d] hover:bg-[#3a1509] disabled:bg-gray-400 text-white uppercase tracking-[0.15em] py-3 px-5 rounded-none transition-all duration-300 cursor-pointer flex items-center justify-center gap-2"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1.05rem" }}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : null}
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          {/* Back to Sign In */}
          <Link
            href="/signin"
            className="mt-3 w-full text-center border-2 border-[#4a1c0d] text-[#4a1c0d] uppercase tracking-[0.15em] py-3 px-5 rounded-none transition-all duration-300 hover:bg-[#f5f0ed] block"
            style={{ fontFamily: "var(--font-bebas)", fontSize: "1rem" }}
          >
            Back to Sign In
          </Link>
        </form>
      </div>
    </div>
  );
}
