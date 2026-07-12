import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function DownloadAppPage() {
  return (
    <main className="flex-1 bg-white flex flex-col md:flex-row min-h-[75vh] pt-6 md:pt-12 lg:pt-12 pb-16">
      {/* Left Side: Typography & CTA */}
      <div className="w-full md:w-[45%] lg:w-[40%] flex flex-col justify-start px-8 md:px-12 lg:px-20 z-10 bg-white">
        <h1
          className="text-[#3b1c0a] text-5xl md:text-6xl lg:text-[4rem] xl:text-[5rem] font-black uppercase leading-none tracking-normal mb-6"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          APP IN<br />DEVELOPMENT
        </h1>

        <p className="text-[#4a2e1b] text-lg md:text-xl font-serif leading-relaxed mb-8 max-w-md font-medium">
          We&apos;re currently cooking up an amazing new app experience for you.
          Stay tuned to order your favorite meals right from your pocket!
        </p>

        <div>
          <Link
            href="/"
            className="bg-[#b51e18] hover:bg-[#9c1914] transition-colors text-white text-xl md:text-2xl font-black uppercase tracking-widest py-3 px-8 rounded-sm inline-flex items-center shadow-sm"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            BACK TO MENU
          </Link>
        </div>
      </div>

      {/* Right Side: Background Image */}
      <div className="w-full md:w-[55%] lg:w-[60%] flex items-start justify-center md:justify-end px-8 md:px-12 mt-12 md:mt-0 lg:pr-24 min-h-[400px]">
        <div className="relative w-full max-w-[18rem] md:max-w-sm lg:max-w-md xl:max-w-lg">
          <Image
            src="/TransparentBgPlaceholder.png"
            alt="Abraham's Table App Coming Soon"
            width={1080}
            height={1080}
            className="w-full h-auto object-contain drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </main>
  );
}
