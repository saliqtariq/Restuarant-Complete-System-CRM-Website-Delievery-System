"use client";

export default function CareersSection() {
  return (
    <div className="w-full bg-[#fcf8f2] py-10 md:py-14 px-6 md:px-12 lg:px-24">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center">
        
        {/* Icon Header using SVG directly */}
        <div className="w-20 h-20 rounded-full bg-[#b51e18]/10 text-[#b51e18] flex items-center justify-center mb-6 shadow-sm">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>

        {/* Title */}
        <h2 
          className="text-[#3b1c0a] text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight mb-3" 
          style={{ fontFamily: "var(--font-anton)" }}
        >
          No Open Vacancies
        </h2>

        {/* Subtitle */}
        <p className="text-[#b51e18] text-lg sm:text-xl font-bold uppercase tracking-widest mb-4" style={{ fontFamily: "var(--font-bebas)" }}>
          Thank you for your interest in joining Abraham&apos;s Table
        </p>

        {/* Description */}
        <p className="text-[#4a2e1b] text-base md:text-lg max-w-xl font-medium leading-relaxed mb-8">
          We currently do not have any open positions available. Please check back later or follow our updates as new opportunities open up across our team and delivery fleet.
        </p>

        {/* Sub text note */}
        <div className="bg-white/80 border border-[#3b1c0a]/10 rounded-xl px-6 py-4 max-w-lg shadow-sm">
          <p className="text-xs sm:text-sm text-[#4a2e1b] font-medium">
            Have questions or want to send an open resume? Feel free to reach out to our team at <span className="font-bold text-[#b51e18] underline">careers@abrahamstable.com</span>
          </p>
        </div>

      </div>
    </div>
  );
}
