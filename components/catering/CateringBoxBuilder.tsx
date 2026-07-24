"use client";

import { useState } from "react";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { useToastStore } from "@/components/Toast";
import {
  useCateringStore,
  BUILDER_ITEMS,
  ALL_CATERING_ITEMS,
} from "@/lib/cateringStore";
import { Plus, Minus, ShoppingBag, Check, Trash2 } from "lucide-react";

export default function CateringBoxBuilder() {
  const addCartItem = useCartStore((s) => s.addItem);
  const addToast = useToastStore((s) => s.addToast);

  const quantities = useCateringStore((s) => s.quantities);
  const changeQuantity = useCateringStore((s) => s.changeQuantity);
  const boxName = useCateringStore((s) => s.boxName);
  const setBoxName = useCateringStore((s) => s.setBoxName);
  const totalCount = useCateringStore((s) => s.totalCount);
  const totalPrice = useCateringStore((s) => s.totalPrice);
  const reset = useCateringStore((s) => s.reset);

  const count = totalCount();
  const price = totalPrice();

  // Items that have qty > 0 (for summary)
  const selectedItems = ALL_CATERING_ITEMS.filter(
    (i) => (quantities[i.id] || 0) > 0
  );

  const handleAddCustomBoxToCart = () => {
    if (count === 0) return;

    const summaryItems = selectedItems
      .map((i) => `${quantities[i.id]}x ${i.name}`)
      .join(", ");

    const formattedName = `${boxName} (${summaryItems})`;

    addCartItem({
      name: formattedName,
      price: `RS ${price.toLocaleString()}`,
      image: "/CateringPic.jpeg",
    });

    addToast({
      name: boxName,
      image: "/CateringPic.jpeg",
      price: `RS ${price.toLocaleString()}`,
      description: "Catering order added to cart",
    });

    reset();
  };

  return (
    <section
      id="catering-box-builder"
      className="py-16 bg-[#faf8f5] border-t border-b border-[#e8e0d8] px-4"
    >
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
                {BUILDER_ITEMS.filter((i) => i.category === "burgers").map(
                  (item) => {
                    const qty = quantities[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                          qty > 0
                            ? "border-[#3b1200] bg-[#faf8f5]/50 shadow-sm"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="relative w-full h-32 mb-2">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">
                            {item.name}
                          </h4>
                          <span className="text-xs font-semibold text-[#b4860b] block mb-3">
                            RS {item.pricePerUnit} / each
                          </span>
                        </div>
                        <div className="flex items-center justify-between bg-gray-100 rounded-lg p-1">
                          <button
                            onClick={() => changeQuantity(item.id, -1)}
                            className="w-8 h-8 rounded-md bg-white flex items-center justify-center text-gray-700 hover:bg-gray-200"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-bold text-sm text-[#3b1200]">
                            {qty}
                          </span>
                          <button
                            onClick={() => changeQuantity(item.id, 1)}
                            className="w-8 h-8 rounded-md bg-[#3b1200] text-white flex items-center justify-center hover:bg-[#5a1e00]"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* CATEGORY: FRIES & SIDES */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3
                className="text-2xl font-bold text-[#3b1200] uppercase mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                <span>2. Add Fries &amp; Sides Buckets</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUILDER_ITEMS.filter((i) => i.category === "fries").map(
                  (item) => {
                    const qty = quantities[item.id] || 0;
                    return (
                      <div
                        key={item.id}
                        className={`p-4 rounded-xl border transition-all flex items-center gap-4 ${
                          qty > 0
                            ? "border-[#3b1200] bg-[#faf8f5]/50 shadow-sm"
                            : "border-gray-200 bg-white"
                        }`}
                      >
                        <div className="relative w-20 h-20 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-sm text-gray-900 leading-tight mb-1">
                            {item.name}
                          </h4>
                          <span className="text-xs font-semibold text-[#b4860b] block mb-2">
                            RS {item.pricePerUnit} / bucket
                          </span>
                          <div className="flex items-center gap-3 bg-gray-100 rounded-lg p-1 w-fit">
                            <button
                              onClick={() => changeQuantity(item.id, -1)}
                              className="w-7 h-7 rounded bg-white flex items-center justify-center text-gray-700"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-bold text-sm text-[#3b1200] px-1">
                              {qty}
                            </span>
                            <button
                              onClick={() => changeQuantity(item.id, 1)}
                              className="w-7 h-7 rounded bg-[#3b1200] text-white flex items-center justify-center"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>

            {/* CATEGORY: BULK SAUCES & DRINKS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h3
                className="text-2xl font-bold text-[#3b1200] uppercase mb-4 pb-2 border-b border-gray-100 flex items-center gap-2"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                <span>3. Bulk Dips &amp; Beverages</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {BUILDER_ITEMS.filter(
                  (i) => i.category === "sauces" || i.category === "drinks"
                ).map((item) => {
                  const qty = quantities[item.id] || 0;
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex items-center gap-3 ${
                        qty > 0
                          ? "border-[#3b1200] bg-[#faf8f5]/50 shadow-sm"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      <div className="relative w-16 h-16 shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-xs text-gray-900 leading-tight mb-1">
                          {item.name}
                        </h4>
                        <span className="text-xs font-semibold text-[#b4860b] block mb-2">
                          RS {item.pricePerUnit}
                        </span>
                        <div className="flex items-center gap-2 bg-gray-100 rounded p-1 w-fit">
                          <button
                            onClick={() => changeQuantity(item.id, -1)}
                            className="w-6 h-6 rounded bg-white flex items-center justify-center text-gray-700"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-xs text-[#3b1200] px-1">
                            {qty}
                          </span>
                          <button
                            onClick={() => changeQuantity(item.id, 1)}
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
              {selectedItems.length === 0 ? (
                <p className="text-xs text-gray-400 italic py-4 text-center">
                  Select items on the left or add preset boxes above to start
                  building your catering order.
                </p>
              ) : (
                selectedItems.map((item) => {
                  const qty = quantities[item.id] || 0;
                  const itemTotal = qty * item.pricePerUnit;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between text-xs py-1.5 border-b border-gray-50"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 bg-[#3b1200] text-white rounded-full flex items-center justify-center font-bold text-[10px]">
                          {qty}
                        </span>
                        <span className="font-medium text-gray-800 line-clamp-1">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="font-bold text-gray-900">
                          RS {itemTotal.toLocaleString()}
                        </span>
                        <button
                          onClick={() => changeQuantity(item.id, -qty)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                          title="Remove"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-500 uppercase font-semibold">
                  Total Crate Price
                </span>
                <span className="text-3xl font-extrabold text-[#3b1200]">
                  RS {price.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleAddCustomBoxToCart}
                disabled={count === 0}
                className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                  count > 0
                    ? "bg-[#3b1200] hover:bg-[#5a1e00] text-white"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
                style={{
                  fontFamily: "var(--font-bebas)",
                  letterSpacing: "0.08em",
                }}
              >
                <ShoppingBag size={18} />
                Add Custom Box To Order
              </button>
              <p className="text-[11px] text-gray-400 text-center mt-2 flex items-center justify-center gap-1">
                <Check size={12} className="text-green-500" />
                Free party box packaging included
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
