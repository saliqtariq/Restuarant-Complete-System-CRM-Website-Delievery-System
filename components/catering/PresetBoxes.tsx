"use client";

import Image from "next/image";
import { useCateringStore, PRESET_BOXES } from "@/lib/cateringStore";
import { useToastStore } from "@/components/Toast";
import { Check, ShoppingBag, Users } from "lucide-react";

export default function PresetBoxes() {
  const changeQuantity = useCateringStore((s) => s.changeQuantity);
  const quantities = useCateringStore((s) => s.quantities);
  const addToast = useToastStore((s) => s.addToast);

  const handleAddBox = (box: (typeof PRESET_BOXES)[number]) => {
    changeQuantity(box.storeItemId, 1);
    addToast({
      name: box.name,
      image: box.image,
      price: `RS ${box.price.toLocaleString()}`,
      description: "Added to catering order",
    });

    // Scroll down to the builder summary
    setTimeout(() => {
      document.getElementById("catering-box-builder")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-[#3b1200] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Preset Party Crates &amp; Boxes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRESET_BOXES.map((box) => {
          const qty = quantities[box.storeItemId] || 0;
          return (
            <div
              key={box.id}
              className="relative bg-white rounded-2xl shadow-lg border border-[#3b1200] ring-2 ring-[#3b1200]/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between overflow-hidden"
            >
              {/* Quantity badge */}
              {qty > 0 && (
                <div className="absolute top-4 right-4 z-10 bg-green-600 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow">
                  {qty} in order
                </div>
              )}

              <div>
                {/* Box Image Header */}
                <div className="relative w-full h-56 bg-[#faf8f5] flex items-center justify-center p-4">
                  <Image
                    src={box.image}
                    alt={box.name}
                    fill
                    className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Box Body */}
                <div className="p-6">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#b4860b] mb-1">
                    <Users size={14} />
                    <span>{box.serves}</span>
                  </div>
                  <h3
                    className="text-2xl font-bold text-[#3b1200] leading-tight mb-2"
                    style={{ fontFamily: "var(--font-bebas)" }}
                  >
                    {box.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-6">{box.tagline}</p>

                  {/* Includes List */}
                  <div className="space-y-2 mb-6 border-t border-b border-gray-100 py-4">
                    <span className="text-[11px] font-bold uppercase text-gray-400 tracking-wider block mb-2">
                      Box Includes:
                    </span>
                    {box.includes.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-gray-700">
                        <Check size={14} className="text-green-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer / CTA */}
              <div className="p-6 pt-0 flex items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-gray-400 block font-medium">Price</span>
                  <span className="text-2xl font-bold text-[#3b1200]">RS {box.price.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => handleAddBox(box)}
                  className="bg-[#3b1200] hover:bg-[#5a1e00] text-white font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-md"
                >
                  <ShoppingBag size={16} />
                  Add Box
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
