"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "LA Carta & Combos", image: "/Lacartacombo.png" },
  { name: "Signature Boxes", image: "/Signature box transparent.png" },
  { name: "Snacks & Beverages", image: "/Snack & Beverages.png" },
  { name: "Condiments", image: "/SNACKtransparent.png" },
  { name: "Everyday Value", image: "/EveryDayValue.png" },
];

export default function ExploreMenu() {
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
            {categories.map((cat, index) => {
              const categoryId = cat.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              return (
              <Link 
                key={index} 
                href={`/menu#${categoryId}`}
                className="flex-shrink-0 snap-center cursor-pointer relative group"
                style={{ width: "220px", height: "240px", marginTop: "40px" }}
              >
                {/* Card Background */}
              <div className="bg-white px-4 h-full flex flex-col items-center justify-end pb-8 shadow-sm hover:shadow-md transition-shadow"
                   style={{ 
                     borderRadius: "100px 100px 30px 100px", 
                   }}>
                
                {/* Image (popping out significantly) */}
                <div className="absolute top-[-50px] bottom-[85px] left-1/2 transform -translate-x-1/2 w-[130%] transition-transform duration-300 group-hover:scale-105 pointer-events-none">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 768px) 220px, 280px"
                    className="object-contain mix-blend-multiply drop-shadow-sm"
                    loading="lazy"
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
              </Link>
            )})}
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
    </section>
  );
}
