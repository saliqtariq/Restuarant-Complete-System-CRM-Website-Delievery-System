import HeroSection from "@/components/HeroSection";

export default function Home() {
  return (
    <main className="flex-1 bg-white flex flex-col">
      <HeroSection />
      
      {/* Join Rewards / Sign In Banner */}
      <section className="w-full bg-white py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="#join"
            className="bg-[#461a0f] text-white px-8 py-2.5 rounded-md text-xl md:text-2xl tracking-wide transition hover:bg-[#34130b]"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            RESERVE TABLE
          </a>
          
          <span 
            className="text-[#461a0f] text-xl md:text-2xl"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            OR
          </span>
          
          <a
            href="#signin"
            className="text-[#b4860b] text-xl md:text-2xl tracking-wide underline decoration-2 underline-offset-4 hover:text-[#916a08] transition"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            SIGN IN
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <hr className="border-t border-gray-500" />
      </div>

      {/* Popular Items Section */}
      <section className="w-full bg-white pt-8 pb-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 
            className="text-[#4a1c0d] text-5xl md:text-7xl uppercase tracking-normal m-0 leading-none"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Popular Items
          </h2>

          {/* Items Grid */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* First Item: Family Meals */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-full h-64 md:h-72 lg:h-80 mb-4 flex items-center justify-center">
                <img 
                  src="/FamilyDeal.png" 
                  alt="Family Meals" 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 
                className="text-[#4a1c0d] text-xl md:text-2xl uppercase leading-none m-0 mb-1"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                FAMILY MEALS
              </h3>
              <p className="text-[#b4860b] text-xl tracking-wider mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
                RS 2450
              </p>
              
              <div className="h-6 w-full flex justify-center items-center">
                <span className="text-[#4a1c0d] text-xs block group-hover:hidden" style={{ fontFamily: "var(--font-geist-sans)" }}>
                  Serves 4-6 people
                </span>
                <span className="text-[#b4860b] text-xl hidden group-hover:flex items-center gap-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  ORDER 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3] stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Second Item: Duo Box */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-full h-64 md:h-72 lg:h-80 mb-4 flex items-center justify-center">
                <img 
                  src="/DuoboxPic.png" 
                  alt="Duo Box" 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 
                className="text-[#4a1c0d] text-xl md:text-2xl uppercase leading-none m-0 mb-1"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                DUO BOX
              </h3>
              <p className="text-[#b4860b] text-xl tracking-wider mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
                RS 1590
              </p>
              
              <div className="h-6 w-full flex justify-center items-center">
                <span className="text-[#4a1c0d] text-xs block group-hover:hidden" style={{ fontFamily: "var(--font-geist-sans)" }}>
                  Serves 2 persons
                </span>
                <span className="text-[#b4860b] text-xl hidden group-hover:flex items-center gap-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  ORDER 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3] stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Third Item: Crispy Chicken Bucket */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-full h-64 md:h-72 lg:h-80 mb-4 flex items-center justify-center">
                <img 
                  src="/ChickenBucket.png" 
                  alt="Crispy Chicken Bucket" 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 
                className="text-[#4a1c0d] text-xl md:text-2xl uppercase leading-none m-0 mb-1"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                CRISPY CHICKEN BUCKET
              </h3>
              <p className="text-[#b4860b] text-xl tracking-wider mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
                RS 1750
              </p>
              
              <div className="h-6 w-full flex justify-center items-center">
                <span className="text-[#4a1c0d] text-xs block group-hover:hidden" style={{ fontFamily: "var(--font-geist-sans)" }}>
                  Serves 2-3 persons
                </span>
                <span className="text-[#b4860b] text-xl hidden group-hover:flex items-center gap-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  ORDER 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3] stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Fourth Item: Outlaw Zinger */}
            <div className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-full h-64 md:h-72 lg:h-80 mb-4 flex items-center justify-center">
                <img 
                  src="/Outlaw Burger.png" 
                  alt="Outlaw Zinger" 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 
                className="text-[#4a1c0d] text-xl md:text-2xl uppercase leading-none m-0 mb-1"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                OUTLAW ZINGER
              </h3>
              <p className="text-[#b4860b] text-xl tracking-wider mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
                RS 790
              </p>
              
              <div className="h-6 w-full flex justify-center items-center">
                <span className="text-[#b4860b] text-xl hidden group-hover:flex items-center gap-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  ORDER 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3] stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
