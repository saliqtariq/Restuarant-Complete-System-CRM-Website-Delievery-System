"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginTakeaway } from "@/app/actions/takeaway";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function TakeawayLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    startTransition(async () => {
      const result = await loginTakeaway(password);
      if (result.success) {
        router.push("/takeaway");
        router.refresh();
      } else {
        setError(result.error ?? "Invalid password");
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#0F0A0A] flex items-center justify-center p-4">
      <div className="relative w-full max-w-sm">
        <div className="bg-[#1A0A0A] border border-[#3B0A0A] rounded-2xl shadow-2xl p-8">
          <div className="flex justify-center mb-6">
            <div className="relative w-20 h-20 rounded-2xl flex items-center justify-center">
              <Image
                src="/Mainlogo.png"
                alt="Restaurant Logo"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-white">Takeaway POS</h1>
            <p className="text-gray-400 text-sm mt-1">Enter the cashier password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Lock size={16} className="text-gray-500" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Cashier password"
                className="w-full bg-[#120606] border border-[#3B1010] text-white placeholder-gray-600 rounded-xl pl-10 pr-10 py-3 text-sm focus:outline-none focus:border-[#E63946] transition-colors"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-500 hover:text-gray-300 transition"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg px-4 py-2.5 text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending || !password}
              className="w-full bg-gradient-to-r from-[#E63946] to-[#C1121F] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm tracking-wide uppercase transition-all shadow-lg shadow-red-900/40"
            >
              {isPending ? "Unlocking..." : "Open Register"}
            </button>
          </form>
        </div>

        <p className="text-center text-gray-600 text-xs mt-6">
          Takeaway Point of Sale · Staff Only
        </p>
      </div>
    </div>
  );
}
