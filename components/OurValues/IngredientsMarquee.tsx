"use client";

import React, { useState } from "react";
import Image from "next/image";

type Ingredient = {
  id: number;
  src: string;
  alt: string;
};

function MarqueeIngredient({
  item,
  isHovered,
  onHoverStart,
  onHoverEnd,
}: {
  item: Ingredient;
  isHovered: boolean;
  onHoverStart: () => void;
  onHoverEnd: () => void;
}) {
  return (
    <div className="mx-8 flex shrink-0 flex-col items-center pb-5">
      <div className="relative h-36 w-36 md:h-44 md:w-44">
        <div
          className={`absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300 md:h-28 md:w-28 ${
            isHovered ? "bg-[#f4ede4]" : ""
          }`}
        />
        <div
          className="absolute left-1/2 top-1/2 z-20 h-24 w-24 -translate-x-1/2 -translate-y-1/2 cursor-pointer md:h-28 md:w-28"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          aria-label={item.alt}
        />
        <Image
          src={item.src}
          alt={item.alt}
          width={176}
          height={176}
          className={`pointer-events-none absolute left-1/2 top-1/2 z-10 h-36 w-36 -translate-x-1/2 -translate-y-1/2 object-contain transition-transform duration-300 md:h-44 md:w-44 ${
            isHovered ? "scale-110" : ""
          }`}
        />
        <span
          className={`absolute left-1/2 top-[calc(50%+3.25rem)] -translate-x-1/2 whitespace-nowrap text-center text-sm font-bold uppercase leading-none tracking-wide text-[#5c4a43] transition-opacity duration-300 md:top-[calc(50%+3.75rem)] md:text-base ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          {item.alt}
        </span>
      </div>
    </div>
  );
}

export default function IngredientsMarquee() {
  const [row1Paused, setRow1Paused] = useState(false);
  const [row2Paused, setRow2Paused] = useState(false);
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);

  const row1 = [
    { id: 1, src: '/rawChicken.png', alt: 'Chicken' },
    { id: 2, src: '/Lime Juice.png', alt: 'Lime Juice' },
    { id: 3, src: '/Jelepenos.png', alt: 'Jalapeños' },
    { id: 4, src: '/Bellpepper.png', alt: 'Bell Pepper' },
    { id: 5, src: '/Onion.png', alt: 'Onion' },
    { id: 6, src: '/Garli.png', alt: 'Garlic' },
    { id: 7, src: '/beef.png', alt: 'Beef' },
  ];

  const row2 = [
    { id: 8, src: '/Tomatoes.png', alt: 'Tomatoes' },
    { id: 9, src: '/flour.png', alt: 'Flour' },
    { id: 10, src: '/Lettuce.png', alt: 'Lettuce' },
    { id: 11, src: '/Pepper.png', alt: 'Pepper' },
    { id: 12, src: '/salt.png', alt: 'Salt' },
    { id: 13, src: '/Honey.png', alt: 'Honey' },
    { id: 14, src: '/black pepper.png', alt: 'Black Pepper' },
  ];

  const marqueeRow1 = [...row1, ...row1];
  const marqueeRow2 = [...row2, ...row2];

  return (
    <div className="mt-16 mb-24 flex flex-col gap-8">
      <style>{`
        @keyframes slide-left {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes slide-right {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .marquee-left {
          animation: slide-left 28s linear infinite;
        }
        .marquee-right {
          animation: slide-right 28s linear infinite;
        }
      `}</style>

      <div className="flex flex-col items-center mb-4">
        <h3
          className="text-[#4a2311] text-4xl md:text-6xl font-black uppercase tracking-wide text-center mb-2"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          We&apos;re Passionate About Our Food
        </h3>
        <p className="text-[#4a2311] text-xl md:text-2xl font-serif font-semibold tracking-wider">
          The Ingredients We Use
        </p>
      </div>

      {/* Row 1 — slides left */}
      <div className="overflow-hidden">
        <div
          className="flex items-center marquee-left"
          style={{
            width: 'max-content',
            animationPlayState: row1Paused ? 'paused' : 'running',
          }}
        >
          {marqueeRow1.map((item, index) => {
            const itemKey = `r1-${item.id}-${index}`;
            const isHovered = hoveredKey === itemKey;

            return (
              <MarqueeIngredient
                key={itemKey}
                item={item}
                isHovered={isHovered}
                onHoverStart={() => {
                  setRow1Paused(true);
                  setHoveredKey(itemKey);
                }}
                onHoverEnd={() => {
                  setRow1Paused(false);
                  setHoveredKey(null);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Row 2 — slides right */}
      <div className="overflow-hidden">
        <div
          className="flex items-center marquee-right"
          style={{
            width: 'max-content',
            animationPlayState: row2Paused ? 'paused' : 'running',
          }}
        >
          {marqueeRow2.map((item, index) => {
            const itemKey = `r2-${item.id}-${index}`;
            const isHovered = hoveredKey === itemKey;

            return (
              <MarqueeIngredient
                key={itemKey}
                item={item}
                isHovered={isHovered}
                onHoverStart={() => {
                  setRow2Paused(true);
                  setHoveredKey(itemKey);
                }}
                onHoverEnd={() => {
                  setRow2Paused(false);
                  setHoveredKey(null);
                }}
              />
            );
          })}
        </div>
      </div>

      {/* NO Banners */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full mt-12">
        <div className="flex items-center gap-5">
          <div className="relative flex flex-col items-center justify-center">
            <span className="text-[#4a2311] text-5xl md:text-7xl font-black leading-none tracking-tighter" style={{ fontFamily: "var(--font-anton)" }}>
              NO
            </span>
            <div className="w-full h-1 md:h-1.5 bg-[#4a2311] mt-1.5 rounded-full"></div>
            <div className="w-full h-1 md:h-1.5 bg-[#4a2311] mt-1 rounded-full"></div>
          </div>
          <p className="text-[#4a2311] text-left text-lg md:text-2xl font-serif font-bold leading-tight tracking-wide">
            Artificial flavors,<br />colors, or preservatives.
          </p>
        </div>

        <div className="flex items-center gap-5">
          <div className="relative flex flex-col items-center justify-center">
            <div className="absolute -top-5 flex gap-1.5">
              <div className="w-1 md:w-1.5 h-3 md:h-4 bg-[#4a2311] rounded-full -rotate-45"></div>
              <div className="w-1 md:w-1.5 h-3 md:h-4 bg-[#4a2311] rounded-full"></div>
              <div className="w-1 md:w-1.5 h-3 md:h-4 bg-[#4a2311] rounded-full rotate-45"></div>
            </div>
            <span className="text-[#4a2311] text-5xl md:text-7xl font-black leading-none tracking-tighter" style={{ fontFamily: "var(--font-anton)" }}>
              NO
            </span>
            <div className="absolute -bottom-5 flex gap-1.5">
              <div className="w-1 md:w-1.5 h-3 md:h-4 bg-[#4a2311] rounded-full -rotate-45"></div>
              <div className="w-1 md:w-1.5 h-3 md:h-4 bg-[#4a2311] rounded-full"></div>
              <div className="w-1 md:w-1.5 h-3 md:h-4 bg-[#4a2311] rounded-full rotate-45"></div>
            </div>
          </div>
          <p className="text-[#4a2311] text-left text-lg md:text-2xl font-serif font-bold leading-tight tracking-wide">
            Freezers, can openers,<br />or shortcuts.
          </p>
        </div>
      </div>
    </div>
  );
}
