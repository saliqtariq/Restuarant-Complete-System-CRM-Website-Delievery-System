"use client";

import Link from "next/link";
import { Sparkles, ArrowLeft, Mail } from "lucide-react";

export default function NewsEventsPage() {
  return (
    <main className="min-h-[70vh] bg-[#fdfbf7] flex flex-col items-center justify-center py-12 px-4">
      <div className="max-w-xl w-full text-center space-y-6">
        
        {/* Title */}
        <h1
          className="text-4xl md:text-6xl font-bold uppercase tracking-wider text-[#451400]"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          News & Events
        </h1>

        <p className="text-gray-600 text-sm md:text-base max-w-md mx-auto leading-relaxed">
          Stay tuned for upcoming menu debuts, seasonal offers, new branch inaugurations, and community stories.
        </p>

        {/* Compact Email Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            alert("Thank you! You'll be notified as soon as news updates go live.");
          }}
          className="flex items-center gap-2 border border-gray-300 rounded-xl p-1.5 bg-white shadow-xs focus-within:border-[#451400] max-w-md mx-auto"
        >
          <Mail size={18} className="text-gray-400 ml-2.5 shrink-0" />
          <input
            type="email"
            required
            placeholder="Enter your email for launch alerts..."
            className="w-full bg-transparent text-sm px-2 py-1.5 focus:outline-none text-gray-800"
          />
          <button
            type="submit"
            className="bg-[#a32a22] text-white px-5 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#7a2e15] transition-colors shrink-0"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Notify Me
          </button>
        </form>

        {/* Back links */}
        <div className="pt-4 flex items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase tracking-wider hover:text-[#451400] transition-colors"
          >
            <ArrowLeft size={14} /> Back To Home
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            href="/menu"
            className="text-xs font-bold text-[#451400] uppercase tracking-wider hover:underline"
          >
            Explore Menu
          </Link>
        </div>

      </div>
    </main>
  );
}
