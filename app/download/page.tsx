import Image from "next/image";
import Link from "next/link";

export default function DownloadAppPage() {
  return (
    <main className="flex flex-1 flex-col items-start bg-white px-8 pb-16 pt-4 md:flex-row md:px-12 md:pt-6 lg:px-20">
      {/* Left Side: Typography & CTA */}
      <div className="z-10 flex w-full flex-col justify-start bg-white md:w-[45%] lg:w-[40%]">
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

      {/* Right Side: Phone Image */}
      <div className="flex w-full items-start justify-center md:w-[55%] md:justify-end lg:w-[60%] lg:pr-4">
        <div className="relative w-full max-w-[16rem] -translate-y-2 md:-translate-y-24 md:max-w-sm lg:max-w-md xl:max-w-lg">
          <Image
            src="/TransparentBgPlaceholder.png"
            alt="Abraham's Table App Coming Soon"
            width={1080}
            height={1080}
            className="h-auto w-full object-contain object-top drop-shadow-2xl"
            priority
          />
        </div>
      </div>
    </main>
  );
}
