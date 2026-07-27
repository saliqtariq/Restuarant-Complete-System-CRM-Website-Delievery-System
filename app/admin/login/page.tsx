"use client";

import { useState } from "react";
import { login } from "./actions";
import Image from "next/image";
import { ChefHat, User, Lock, Eye, EyeOff, ArrowRight, UtensilsCrossed } from "lucide-react";

export default function AdminLogin() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    const formData = new FormData(e.currentTarget);
    try {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } catch (err) {
      if (err instanceof Error && err.message === "NEXT_REDIRECT") {
          throw err;
      }
      setError("Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden bg-gray-900">
      {/* Background Image */}
      <Image
        src="/updatedbgpic.png"
        alt="Background"
        fill
        priority
        className="object-cover object-center blur-[2px] opacity-50"
      />
      
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/30 z-0" />

      {/* Login Card */}
      <div className="relative w-full max-w-[380px] p-8 bg-[#FAFAFA] rounded-3xl shadow-2xl border border-white/80 overflow-hidden mx-4">
        
        {/* Decorative Top Left Shape */}
        <div className="absolute -top-16 -left-16 w-40 h-40 bg-red-100/60 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 w-24 h-24 bg-red-50 rounded-full opacity-70 -translate-x-1/2 -translate-y-1/4 pointer-events-none"></div>

        <div className="flex flex-col items-center mb-6 relative z-10">
          <div className="w-16 h-16 rounded-full border-[1.5px] border-[#E63946] flex items-center justify-center mb-5 bg-white shadow-sm">
            <ChefHat strokeWidth={1.5} className="w-8 h-8 text-[#E63946]" />
          </div>
          <h1 className="text-2xl font-serif text-black tracking-tight">Welcome Back</h1>
          <div className="w-8 h-0.5 bg-gradient-to-r from-red-500 to-red-100 mt-4 rounded-full"></div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm text-center font-medium animate-in fade-in slide-in-from-top-1">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-red-500">
                <User strokeWidth={1.5} className="w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type="text"
                name="username"
                required
                className="block w-full p-3.5 pl-11 text-sm text-gray-900 bg-[#F4F4F5] rounded-xl border border-gray-200/60 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-400 outline-none transition-all shadow-sm"
                placeholder="Username"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none transition-colors group-focus-within:text-red-500">
                <Lock strokeWidth={1.5} className="w-5 h-5 text-gray-400 group-focus-within:text-red-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="block w-full p-3.5 pl-11 pr-11 text-sm text-gray-900 bg-[#F4F4F5] rounded-xl border border-gray-200/60 focus:bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-400 outline-none transition-all shadow-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-700 focus:outline-none transition-colors"
              >
                {showPassword ? (
                  <EyeOff strokeWidth={1.5} className="w-5 h-5" />
                ) : (
                  <Eye strokeWidth={1.5} className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-red-500/20 text-sm font-bold text-white bg-[#E63946] hover:bg-[#D62828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Authenticating..." : "Sign In"}
            {!isLoading && <ArrowRight strokeWidth={2.5} className="w-4 h-4" />}
          </button>
        </form>

        <div className="mt-8 flex items-center justify-center gap-4 relative z-10 px-8">
          <div className="h-px bg-gray-200 flex-1"></div>
          <UtensilsCrossed strokeWidth={1.5} className="w-4 h-4 text-[#E63946]" />
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>
      </div>
    </div>
  );
}
