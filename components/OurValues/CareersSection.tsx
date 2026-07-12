import { ArrowRight } from "lucide-react";

export default function CareersSection() {
  return (
    <div className="w-full bg-[#fcf8f2] py-16 md:py-24 px-6 md:px-12 lg:px-24">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
        
        {/* Left Side: Typography */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left lg:pl-28">
          <h3 className="text-[#3b1c0a] text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide transform -rotate-3 mb-1" style={{ fontFamily: "var(--font-bebas)" }}>
            We Don&apos;t Just
          </h3>
          
          <div className="flex items-center gap-2 md:gap-3 mt-1 transform -rotate-3">
            <div className="hidden sm:flex flex-col gap-1.5 opacity-80">
              <div className="w-5 h-1 bg-[#b51e18] rounded-full rotate-12"></div>
              <div className="w-6 h-1 bg-[#b51e18] rounded-full -rotate-12"></div>
            </div>
            <h3 className="text-[#3b1c0a] text-2xl md:text-3xl lg:text-4xl font-black uppercase tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
              Serve <span className="text-[#b51e18]">Great Food</span>...
            </h3>
          </div>
          
          <div className="flex items-center justify-center gap-2 mt-4 transform -rotate-3">
            <span className="text-[#3b1c0a] text-xl font-black">=</span>
            <h3 className="text-[#3b1c0a] text-xl md:text-2xl lg:text-3xl font-black uppercase tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>
              We Build
            </h3>
            <span className="text-[#3b1c0a] text-xl font-black">=</span>
          </div>

          <h2 className="text-[#3b1c0a] text-[3.5rem] md:text-[4rem] lg:text-[5rem] font-black uppercase leading-[0.85] tracking-tighter transform -rotate-3 mt-4 drop-shadow-sm" style={{ fontFamily: "var(--font-anton)" }}>
            Great
          </h2>
          <div className="relative mt-1">
            <h2 className="text-[#3b1c0a] text-[3rem] md:text-[3.5rem] lg:text-[4.5rem] font-black uppercase leading-[0.85] tracking-tighter transform -rotate-3 drop-shadow-sm" style={{ fontFamily: "var(--font-anton)" }}>
              Careers.
            </h2>
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 lg:left-0 lg:translate-x-0 w-[70%] h-2 bg-[#b51e18] rounded-full transform -rotate-3 opacity-90"></div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="flex-1 flex flex-col w-full max-w-xl mx-auto lg:mx-0 lg:pr-12">
          <p className="text-[#4a2e1b] text-lg md:text-xl font-medium leading-relaxed mb-8">
            We believe great restaurants are built by great people. That&apos;s why we invest in training, career development, and benefits that help our team succeed.
          </p>

          <div className="flex flex-col items-center sm:items-start gap-4">
            <button className="bg-[#b51e18] hover:bg-[#9c1914] transition-colors text-white text-xl md:text-2xl font-black uppercase tracking-widest py-4 px-10 rounded-md flex items-center gap-3 shadow-md w-full sm:w-auto justify-center" style={{ fontFamily: "var(--font-bebas)" }}>
              Explore Careers <ArrowRight className="w-6 h-6" strokeWidth={3} />
            </button>
            <p className="text-[#4a2e1b] text-lg font-serif italic mt-3 text-center sm:text-left">
              Be part of something <span className="font-bold pb-0.5 border-b-2 border-[#b51e18]">delicious.</span>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
