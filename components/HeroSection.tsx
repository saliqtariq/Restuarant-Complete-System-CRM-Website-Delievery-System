"use client";

export default function HeroSection() {
  return (
    <section className="relative w-full h-[85vh] overflow-hidden bg-black">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          willChange: "transform",
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          imageRendering: "auto",
          transform: "translateZ(0)",
        }}
      >
        <source src="/heroSectionVideo.mp4" type="video/mp4" />
      </video>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Hero Text Content */}
      <div className="relative z-10 flex items-center justify-center h-full pt-20">
        <div className="text-center max-w-3xl px-4">
          {/* Top heading - smaller */}
          <h2
            className="text-white uppercase leading-[0.95] mb-0"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              fontWeight: 400,
              letterSpacing: "0.02em",
            }}
          >
            Abraham&apos;s Outlaw
          </h2>
          {/* Main hero word - much larger */}
          <h1
            className="text-white uppercase leading-[0.85] mb-0"
            style={{
              fontFamily: "var(--font-bebas)",
              fontSize: "clamp(4rem, 10vw, 9rem)",
              fontWeight: 400,
              letterSpacing: "-0.02em",
            }}
          >
            Burger
          </h1>

          {/* Subtitle */}
          <p
            className="text-white uppercase tracking-widest text-sm md:text-lg lg:text-xl font-bold mb-2"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            HONEY HEAT WITH A HINT OF SALT & PEPPER
          </p>

          {/* Body text */}
          <p
            className="text-white text-sm md:text-base lg:text-lg leading-relaxed mb-3 mx-auto max-w-lg font-bold"
            style={{ fontFamily: "var(--font-geist-sans)" }}
          >
            Perfectly grilled chicken
            <br />
            with rich garlic butter and
            <br />
            cracked black pepper.
          </p>

          {/* Order Now Button */}
          <a
            href="#order"
            className="inline-block bg-[#a62116] hover:bg-[#851a11] text-white rounded-md text-lg md:text-xl tracking-wide px-6 py-1.5 transition-colors duration-300"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            ORDER NOW
          </a>
        </div>
      </div>
    </section>
  );
}
