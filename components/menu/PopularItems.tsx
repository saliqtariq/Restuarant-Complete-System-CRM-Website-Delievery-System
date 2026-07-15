"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { useToastStore } from "@/components/Toast";
import { useState, useRef } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";

const popularItems = [
  {
    name: "FAMILY MEALS",
    price: "RS 2450",
    image: "/FamilyDeal.png",
    serves: "Serves 4-6 people",
  },
  {
    name: "DUO BOX",
    price: "RS 1590",
    image: "/DuoboxPic.png",
    serves: "Serves 2 persons",
  },
  {
    name: "CRISPY CHICKEN BUCKET",
    price: "RS 1750",
    image: "/ChickenBucket.png",
    serves: "Serves 2-3 persons",
  },
  {
    name: "OUTLAW ZINGER",
    price: "RS 790",
    image: "/Outlaw Burger.png",
  },
];

export default function PopularItems() {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const addToast = useToastStore((s) => s.addToast);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [blockedItems, setBlockedItems] = useState<Record<string, boolean>>({});
  const clickCountsRef = useRef<Record<string, number>>({});

  const handleIncrease = (item: (typeof popularItems)[number], cartItem?: { quantity: number }) => {
    const currentCount = clickCountsRef.current[item.name] || 0;
    if (currentCount >= 2) return; // Synchronous block

    clickCountsRef.current[item.name] = currentCount + 1;

    if (currentCount + 1 >= 2) {
      // Disable for 1.5s after 2nd click
      setBlockedItems((prev) => ({ ...prev, [item.name]: true }));
      setTimeout(() => {
        setBlockedItems((prev) => ({ ...prev, [item.name]: false }));
        clickCountsRef.current[item.name] = 0; // reset
      }, 1500);
    } else {
      // Reset if only 1 click happened
      setTimeout(() => {
        if (clickCountsRef.current[item.name] === 1) {
          clickCountsRef.current[item.name] = 0;
        }
      }, 2000);
    }

    if (cartItem) {
      updateQuantity(item.name, cartItem.quantity + 1);
    } else {
      addItem({ name: item.name, price: item.price, image: item.image });
      addToast({ name: item.name, image: item.image, price: item.price });
      setAddedItem(item.name);
      setTimeout(() => setAddedItem(null), 1200);
    }
  };

  return (
    <section className="w-full bg-white pt-0 pb-4">
      <div className="max-w-7xl mx-auto px-4">
        <h2 
          className="text-[#4a1c0d] text-5xl md:text-7xl uppercase tracking-normal m-0 leading-none"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Popular Items
        </h2>

        {/* Items Grid */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {popularItems.map((item) => (
            <div key={item.name} onClick={() => {
              const cartItem = items.find((i) => i.name === item.name);
              if (!cartItem) handleIncrease(item);
            }} className="flex flex-col items-center text-center group cursor-pointer">
              <div className="relative w-full h-64 md:h-72 lg:h-80 mb-4 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                  priority
                />
              </div>
              <h3 
                className="text-[#4a1c0d] text-xl md:text-2xl uppercase leading-none m-0 mb-1"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                {item.name}
              </h3>
              <p className="text-[#b4860b] text-xl tracking-wider mb-0" style={{ fontFamily: "var(--font-bebas)" }}>
                {item.price}
              </p>
              
              <div className="h-8 w-full flex justify-center items-center mt-1">
                {items.find(i => i.name === item.name) ? (() => {
                  const cartItem = items.find(i => i.name === item.name)!;
                  return (
                    <div className="flex items-center gap-3 bg-gray-50 px-3 py-1 rounded-full border border-gray-200" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => cartItem.quantity > 1 ? updateQuantity(item.name, cartItem.quantity - 1) : removeItem(item.name)}
                        className="w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#4a1c0d] hover:bg-gray-100 transition-colors cursor-pointer"
                        aria-label={cartItem.quantity > 1 ? "Decrease quantity" : "Remove item"}
                      >
                        {cartItem.quantity > 1 ? <Minus size={14} strokeWidth={3} /> : <Trash2 size={14} strokeWidth={2.5} className="text-[#a62116]" />}
                      </button>
                      <span
                        className="text-[#4a1c0d] text-lg font-bold min-w-[1.5rem] text-center"
                        style={{ fontFamily: "var(--font-bebas)" }}
                      >
                        {cartItem.quantity}
                      </span>
                      <button
                        disabled={blockedItems[item.name]}
                        onClick={() => handleIncrease(item, cartItem)}
                        className={`w-7 h-7 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#4a1c0d] transition-colors ${blockedItems[item.name] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 cursor-pointer'}`}
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  );
                })() : (
                  <>
                    {item.serves && (
                      <span className="text-[#4a1c0d] text-xs block group-hover:hidden" style={{ fontFamily: "var(--font-geist-sans)" }}>
                        {item.serves}
                      </span>
                    )}
                    <button
                      disabled={blockedItems[item.name]}
                      className={`text-[#b4860b] text-xl hidden group-hover:flex items-center gap-1 transition-colors bg-transparent border-none ${blockedItems[item.name] ? 'opacity-60 cursor-not-allowed' : 'hover:text-[#916a08] cursor-pointer'}`}
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      {blockedItems[item.name] ? (
                        <span className="flex items-center gap-1 text-gray-500">
                          WAIT 1.5s
                        </span>
                      ) : addedItem === item.name ? (
                        <span className="flex items-center gap-1 text-green-600">
                          ADDED ✓
                        </span>
                      ) : (
                        <>
                          ADD TO CART 
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3] stroke-current" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </>
                      )}
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
