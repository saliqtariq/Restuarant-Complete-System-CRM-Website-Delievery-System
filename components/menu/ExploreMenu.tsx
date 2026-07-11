"use client";

import { useState, useRef, useEffect } from "react";

const categories = [
  { name: "Everyday Value", image: "/EveryDayValue.png" },
  { name: "LA Carta & Combos", image: "/Lacartacombo.png" },
  { name: "Signature-Boxes", image: "/Signature box transparent.png" },
  { name: "Spreads", image: "/SNACKtransparent.png" },
  { name: "Snacks & Beverages", image: "/Snack & Beverages.png" },
  { name: "Sharing", image: "/Sharing.png" },
];

export default function ExploreMenu() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth / 2;
      scrollContainerRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth"
      });
    }
  };

  return (
    <section id="explore-menu" className="w-full bg-white pt-12 pb-4 relative">
      <div className="max-w-7xl mx-auto px-4">
        <h2 
          className="text-[#4a1c0d] text-5xl md:text-7xl uppercase tracking-normal m-0 mb-4 leading-none"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Explore The Menu
        </h2>
        
        {/* Slider Section with Arrows */}
        <div className="flex items-center gap-2 md:gap-4 relative">
          {/* Left Arrow */}
          <button 
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-[#e4002b] rounded-full flex items-center justify-center text-white shadow-md transition-all focus:outline-none ${!canScrollLeft ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c30025]'}`}
            aria-label="Scroll left"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Slider Container */}
          <div 
            ref={scrollContainerRef}
            onScroll={checkScroll}
            className="flex-1 flex overflow-x-auto gap-6 pb-8 pt-12 no-scrollbar snap-x scroll-smooth"
          >
            {categories.map((cat, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedCategory(cat.name)}
              className="flex-shrink-0 snap-center cursor-pointer relative group"
              style={{ width: "220px", height: "240px", marginTop: "40px" }}
            >
              {/* Card Background */}
              <div className="bg-white px-4 h-full flex flex-col items-center justify-end pb-8 shadow-sm hover:shadow-md transition-shadow"
                   style={{ 
                     borderRadius: "100px 100px 30px 100px", 
                   }}>
                
                {/* Image (popping out significantly) */}
                <div className="absolute top-[-50px] bottom-[85px] left-1/2 transform -translate-x-1/2 w-[130%] flex items-end justify-center transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                  <img 
                    src={cat.image} 
                    alt={cat.name} 
                    className="w-full h-full object-contain mix-blend-multiply drop-shadow-sm"
                  />
                </div>

                {/* Title */}
                <h3 className="text-[#2b2b36] font-bold text-lg text-center mb-2 z-10" style={{ fontFamily: "serif" }}>
                  {cat.name}
                </h3>
                
                {/* Red line */}
                <div className="w-12 h-1.5 bg-[#e4002b] rounded-full z-10"></div>
                
                {/* Small dot on the bottom right corner */}
                <div className="absolute bottom-6 right-6 w-3.5 h-3.5 bg-gray-100 rounded-full"></div>
              </div>
            </div>
          ))}
          </div>

          {/* Right Arrow */}
          <button 
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`flex-shrink-0 w-8 h-8 md:w-10 md:h-10 bg-[#e4002b] rounded-full flex items-center justify-center text-white shadow-md transition-all focus:outline-none ${!canScrollRight ? 'opacity-50 cursor-not-allowed' : 'hover:bg-[#c30025]'}`}
            aria-label="Scroll right"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Modal Popup */}
      {selectedCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 
                className="text-[#4a1c0d] text-3xl uppercase tracking-wider m-0"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                {selectedCategory} Menu
              </h3>
              <button 
                onClick={() => setSelectedCategory(null)}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Body */}
            <div className="p-8 flex-1 overflow-y-auto">
              <div className="text-center py-20 text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <p className="text-xl font-semibold text-gray-700">Full Menu Coming Soon</p>
                <p className="mt-2 text-gray-400">The items for {selectedCategory} will be displayed here.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
