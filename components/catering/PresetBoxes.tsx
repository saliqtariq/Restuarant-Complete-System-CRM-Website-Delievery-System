"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { Check, ShoppingBag, Users, Flame } from "lucide-react";

interface PresetBox {
  id: string;
  name: string;
  tagline: string;
  serves: string;
  price: string;
  image: string;
  popular?: boolean;
  includes: string[];
}

const PRESET_BOXES: PresetBox[] = [
  {
    id: "family-reunion-box",
    name: "Family Reunion Burger Box",
    tagline: "Perfect for family get-togethers & game nights",
    serves: "Serves 6 - 8 Persons",
    price: "RS 4,990",
    image: "/FamilyDeal.png",
    popular: true,
    includes: [
      "6x Smash Beef Burgers or Crispy Chicken Burgers",
      "3x Bucket Fries (Salted / Masala)",
      "6x Dip Tubs (Garlic Mayo, Secret Sauce, Fire House)",
      "6x Cold Drinks (345ml Cans)",
    ],
  },
  {
    id: "ultimate-feast-box",
    name: "The Ultimate Party Feast Box",
    tagline: "Built for birthdays, celebrations & big parties",
    serves: "Serves 10 - 12 Persons",
    price: "RS 8,490",
    image: "/GroupOrderPic.png",
    popular: false,
    includes: [
      "12x Signature Gourmet Burgers (Beef & Chicken Mix)",
      "4x XL Loaded Cheese Fries",
      "12x Assorted Gourmet Dips",
      "12x Cold Beverages (or 2x 2.25L Bottles)",
    ],
  },
  {
    id: "mega-slider-crate",
    name: "Mega Party Crate & Sauce Station",
    tagline: "The crowd favorite for major events & office parties",
    serves: "Serves 15 - 20 Persons",
    price: "RS 13,990",
    image: "/Sharing.png",
    popular: true,
    includes: [
      "20x Mini Smash Sliders or Zinger Bites",
      "6x XL Seasoned Waffle & Crispy Fries",
      "1x Sauce Station (20 Dips Bucket)",
      "3x 2.25L Jumbo Beverages",
    ],
  },
];

export default function PresetBoxes() {
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = (box: PresetBox) => {
    addItem({
      name: box.name,
      price: box.price,
      image: box.image,
    });
  };

  return (
    <section className="py-12 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-[#3b1200] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Preset Party Crates & Boxes
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {PRESET_BOXES.map((box) => (
          <div
            key={box.id}
            className={`relative bg-white rounded-2xl shadow-lg border transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl flex flex-col justify-between overflow-hidden ${
              box.popular ? "border-[#3b1200] ring-2 ring-[#3b1200]/20" : "border-gray-200"
            }`}
          >
            {box.popular && (
              <div className="absolute top-4 right-4 z-10 bg-[#3b1200] text-white text-[11px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow">
                Most Popular
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
                <span className="text-2xl font-bold text-[#3b1200]">{box.price}</span>
              </div>
              <button
                onClick={() => handleAddToCart(box)}
                className="bg-[#3b1200] hover:bg-[#5a1e00] text-white font-bold uppercase tracking-wider text-xs px-5 py-3 rounded-xl flex items-center gap-2 transition-colors shadow-md"
              >
                <ShoppingBag size={16} />
                Add Box
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
