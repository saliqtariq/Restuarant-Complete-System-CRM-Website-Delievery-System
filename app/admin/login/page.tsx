"use client";

import { useState } from "react";
import { login } from "./actions";
import { ChefHat, User, Lock, Eye, EyeOff } from "lucide-react";

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md p-8 bg-white mx-4 flex flex-col">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-full border-[1.5px] border-[#E63946] flex items-center justify-center mb-6 bg-white">
            <ChefHat strokeWidth={1.5} className="w-8 h-8 text-[#E63946]" />
          </div>
          <h1 className="text-3xl font-medium text-[#2d3748] tracking-normal">Welcome Back</h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <User strokeWidth={1.5} className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="username"
                required
                className="block w-full py-3.5 pl-12 pr-4 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-400 outline-none transition-all shadow-sm"
                placeholder="Username"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                <Lock strokeWidth={1.5} className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required
                className="block w-full py-3.5 pl-12 pr-12 text-sm text-gray-700 bg-white rounded-lg border border-gray-200 focus:border-red-500 focus:ring-1 focus:ring-red-500 placeholder-gray-400 outline-none transition-all shadow-sm"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600 focus:outline-none"
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
            className="w-full mt-8 flex items-center justify-center py-3.5 px-4 rounded-lg text-sm font-semibold text-white bg-[#E63946] hover:bg-[#D62828] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all disabled:opacity-50"
          >
            {isLoading ? "Authenticating..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
