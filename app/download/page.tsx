import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DownloadAppPage() {
  return (
    <main className="flex-1 bg-[#fcf8f2] flex flex-col items-center justify-center py-20 px-6 min-h-[70vh]">
      <div className="max-w-2xl mx-auto flex flex-col items-center text-center">
        {/* Placeholder Image */}
        <div className="relative w-64 h-64 md:w-80 md:h-80 mb-8 drop-shadow-xl hover:scale-105 transition-transform duration-500">
          <Image
            src="/Abraham'sTable Placeholder.png"
            alt="Abraham's Table App Coming Soon"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Coming Soon Text */}
        <h1 
          className="text-[#3b1c0a] text-5xl md:text-7xl font-black uppercase tracking-wide mb-4"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          Coming Soon
        </h1>
        
        <div className="w-24 h-1.5 bg-[#b51e18] rounded-full mb-6"></div>

        <p className="text-[#4a2e1b] text-xl md:text-2xl font-serif leading-relaxed mb-10 max-w-lg">
          We&apos;re currently cooking up an amazing new app experience for you. 
          Stay tuned to order your favorite meals right from your pocket!
        </p>

        {/* Return to Home Button */}
        <Link 
          href="/"
          className="bg-[#b51e18] hover:bg-[#9c1914] transition-colors text-white text-xl font-black uppercase tracking-widest py-4 px-8 rounded-md flex items-center gap-3 shadow-md"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          <ArrowLeft className="w-5 h-5" strokeWidth={3} />
          Back to Menu
        </Link>
      </div>
    </main>
  );
}
