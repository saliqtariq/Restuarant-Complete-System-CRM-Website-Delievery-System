"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { Plus, Minus, ShoppingBag, Sparkles, Check } from "lucide-react";

interface ItemChoice {
  id: string;
  name: string;
  pricePerUnit: number;
  image: string;
  category: "burgers" | "fries" | "sauces" | "drinks";
}

const BUILDER_ITEMS: ItemChoice[] = [
  // Burgers (bulk per piece)
  { id: "b1", name: "Abraham's Double Smash Burger", pricePerUnit: 590, image: "/Abraham's Double Stack.png", category: "burgers" },
  { id: "b2", name: "Outlaw Spicy Beef Burger", pricePerUnit: 640, image: "/Outlaw Burger.png", category: "burgers" },
  { id: "b3", name: "Zinger Butcher Crispy Chicken", pricePerUnit: 520, image: "/Zinger Butcher.png", category: "burgers" },
  
  // Fries Buckets
  { id: "f1", name: "XL Loaded Cheese Fries Bucket", pricePerUnit: 790, image: "/EveryDayValue.png", category: "fries" },
  { id: "f2", name: "XL Masala Fries Bucket", pricePerUnit: 490, image: "/BestSellersDeal.png", category: "fries" },
  { id: "f3", name: "XL Regular Fries Bucket", pricePerUnit: 450, image: "/RegularFries.png", category: "fries" },

  // Bulk Dip Pots
  { id: "s1", name: "Garlic Mayo Dip Tub (250ml)", pricePerUnit: 180, image: "/GarliSauce.png", category: "sauces" },
  { id: "s2", name: "Creamy Ranch Dip Tub (250ml)", pricePerUnit: 180, image: "/creamyranch.png", category: "sauces" },
  { id: "s3", name: "Buffalo Dip Tub (250ml)", pricePerUnit: 190, image: "/BuffaloSauce.png", category: "sauces" },
  { id: "s4", name: "Fire House Chili Dip Tub (250ml)", pricePerUnit: 190, image: "/Spreads.png", category: "sauces" },
  { id: "s5", name: "Honey Mustard Dip Tub (250ml)", pricePerUnit: 180, image: "/Honey.png", category: "sauces" },

  // Drinks
  { id: "d1", name: "Jumbo Soft Drinks 2.25L", pricePerUnit: 280, image: "/Lime Juice.png", category: "drinks" },
  { id: "d2", name: "7Up Can Pack (6 Cans)", pricePerUnit: 550, image: "/7upRegularWithoutBG.png", category: "drinks" },
  { id: "d3", name: "Pepsi Can Pack (6 Cans)", pricePerUnit: 550, image: "/PepsiRegularnoBg.png", category: "drinks" },
  { id: "d4", name: "Chilled Can Pack (6 Cans)", pricePerUnit: 550, image: "/Snack & Beverages.png", category: "drinks" },
];

export default function CateringBoxBuilder() {
  const addItem = useCartStore((s) => s.addItem);
  const [quantities, setQuantities] = useState<Record<string, number>>({
    b1: 6,
    f1: 2,
    s1: 3,
    d1: 2,
  });
  const [boxName, setBoxName] = useState("Custom Family Party Box");

  const handleQuantityChange = (id: string, delta: number) => {
    setQuantities((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      return { ...prev, [id]: next };
    });
  };

  // Calculate total price
  const calculateTotal = () => {
    return BUILDER_ITEMS.reduce((sum, item) => {
      const q = quantities[item.id] || 0;
      return sum + q * item.pricePerUnit;
    }, 0);
  };

  const totalCount = Object.values(quantities).reduce((a, b) => a + b, 0);
  const totalPrice = calculateTotal();

  const handleAddCustomBoxToCart = () => {
    if (totalCount === 0) return;

    // Create item summary
    const summaryItems = BUILDER_ITEMS.filter((i) => (quantities[i.id] || 0) > 0)
      .map((i) => `${quantities[i.id]}x ${i.name}`)
      .join(", ");

    const formattedName = `${boxName} (${summaryItems})`;

    addItem({
      name: formattedName,
      price: `RS ${totalPrice.toLocaleString()}`,
      image: "/CateringPic.jpeg",
    });
  };

  return (
    <section className="py-16 bg-[#faf8f5] border-t border-b border-[#e8e0d8] px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2
            className="text-3xl sm:text-5xl font-extrabold text-[#3b1200] uppercase tracking-wide"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Build Your Own Custom Party Box
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* Item Selector List (Left 2 cols) */}
          <div className="lg:col-span-2 space-y-8">

            {/* CATEGORY: BURGERS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3
                className="text-2xl font-bold text-[#3b1200] uppercase mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                <span>1. Select Gourmet Burgers (Bulk)</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {BUILDER_ITEMS.filter((i) => i.category === "burgers").map((item) => {
                  const qty = quantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                        qty > 0 ? "border-[#3b1200] bg-[#faf8f5]/50 shadow-sm" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="relative w-full h-32 mb-2">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{item.name}</h4>
                        <span className="text-xs font-semibold text-[#b4860b] block mb-3">
                          RS {item.pricePerUnit} / each
                        </span>
                      </div>
                      <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => handleQuantityChange(item.id, -1)}
                          className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="font-bold text-sm text-[#3b1200]">{qty}</span>
                        <button
                          onClick={() => handleQuantityChange(item.id, 1)}
                          className="w-8 h-8 rounded-md bg-[#3b1200] text-white flex items-center justify-center hover:bg-[#5a1e00]"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CATEGORY: FRIES & SIDES */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3
                className="text-2xl font-bold text-[#3b1200] uppercase mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                <span>2. Add Fries & Sides Buckets</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUILDER_ITEMS.filter((i) => i.category === "fries").map((item) => {
                  const qty = quantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${
                        qty > 0 ? "border-[#3b1200] bg-[#faf8f5]/50 shadow-sm" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="relative w-20 h-20 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">{item.name}</h4>
                        <span className="text-xs font-semibold text-[#b4860b] block mb-2">
                          RS {item.pricePerUnit} / bucket
                        </span>
                        <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1 w-fit">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-7 h-7 rounded bg-white flex items-center justify-center text-gray-700"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-sm text-[#3b1200] px-1">{qty}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-7 h-7 rounded bg-[#3b1200] text-white flex items-center justify-center"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* CATEGORY: BULK SAUCES & DRINKS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3
                className="text-2xl font-bold text-[#3b1200] uppercase mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                <span>3. Bulk Dips & Beverages</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUILDER_ITEMS.filter((i) => i.category === "sauces" || i.category === "drinks").map((item) => {
                  const qty = quantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                        qty > 0 ? "border-[#3b1200] bg-[#faf8f5]/50 shadow-sm" : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="relative w-16 h-16 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-gray-900 leading-tight mb-1">{item.name}</h4>
                        <span className="text-xs font-semibold text-[#b4860b] block mb-2">
                          RS {item.pricePerUnit}
                        </span>
                        <div className="flex items-center gap-2 bg-gray-100 rounded p-1 w-fit">
                          <button
                            onClick={() => handleQuantityChange(item.id, -1)}
                            className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-700"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-xs text-[#3b1200] px-1">{qty}</span>
                          <button
                            onClick={() => handleQuantityChange(item.id, 1)}
                            className="w-6 h-6 rounded bg-[#3b1200] text-white flex items-center justify-center"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Custom Crate Live Summary (Right Column sticky) */}
          <div className="lg:col-span-1 sticky top-24 bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
            <div className="border-b border-gray-100 pb-4 mb-4">
              <span className="text-[11px] font-bold uppercase text-[#b4860b] tracking-wider block mb-1">
                Box Customizer Summary
              </span>
              <input
                type="text"
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                className="w-full text-xl font-bold text-[#3b1200] border-b border-dashed border-gray-300 focus:border-[#3b1200] outline-none py-1"
                placeholder="Name Your Custom Box"
              />
            </div>

            {/* Selected Items Breakdown */}
            <div className="space-y-3 max-h-64 overflow-y-auto pr-1 mb-6">
              {totalCount === 0 ? (
                <p className="text-xs text-gray-400 italic py-4 text-center">
                  Select items on the left to start building your custom crate.
                </p>
              ) : (
                BUILDER_ITEMS.filter((i) => (quantities[i.id] || 0) > 0).map((item) => {
                  const qty = quantities[item.id] || 0;
                  const itemTotal = qty * item.pricePerUnit;
                  return (
                    <div key={item.id} className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#3b1200] text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                          {qty}
                        </span>
                        <span className="font-medium text-gray-800 line-clamp-1">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900 shrink-0">RS {itemTotal.toLocaleString()}</span>
                    </div>
                  );
                })
              )}
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-500 uppercase font-semibold">Total Crate Price</span>
                <span className="text-3xl font-extrabold text-[#3b1200]">RS {totalPrice.toLocaleString()}</span>
              </div>

              <button
                onClick={handleAddCustomBoxToCart}
                disabled={totalCount === 0}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  totalCount > 0
                    ? "bg-[#3b1200] hover:bg-[#5a1e00] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.08em" }}
              >
                <ShoppingBag size={18} />
                Add Custom Box To Order
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                <Check size={12} className="text-green-500" /> Free party box packaging included
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
