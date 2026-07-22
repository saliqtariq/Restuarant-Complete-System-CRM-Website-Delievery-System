"use client";

import { useCartStore } from "@/lib/cartStore";
import Image from "next/image";
import { Minus, Plus, Trash2, ChevronRight, ChevronDown } from "lucide-react";
import Link from "next/link";

export default function CartSidebar() {
  const items = useCartStore((s) => s.items);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  
  const count = totalItems();
  const total = totalPrice();

  return (
    <div className="w-full bg-white rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden sticky top-[100px] max-h-[calc(100vh-120px)] border border-gray-100">
      
      {/* Header */}
      <div className="pt-6 pb-4 px-6 border-b-2 border-[#e5002a] relative shrink-0">
        <div className="flex gap-1 absolute right-4 top-4">
          <div className="w-4 h-4 bg-[#e5002a]"></div>
          <div className="w-4 h-4 bg-[#e5002a]"></div>
          <div className="w-4 h-4 bg-[#e5002a]"></div>
        </div>
        <h2 className="text-3xl font-bold text-[#111] m-0 tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
          {count > 0 ? `${count} Item${count > 1 ? 's' : ''} Added` : 'Order Details'}
        </h2>
      </div>

      {items.length === 0 ? (
        /* Empty State */
        <div className="flex-1 overflow-y-auto min-h-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50/50">
          <div className="relative w-48 h-48 mb-6 shrink-0">
            <Image 
              src="/ChickenBucket.png" 
              alt="Empty Bucket" 
              fill 
              className="object-contain opacity-80"
            />
          </div>
          <h3 className="text-2xl uppercase text-[#111] font-bold tracking-wider shrink-0" style={{ fontFamily: "var(--font-bebas)" }}>
            You haven&apos;t added any items in bucket yet
          </h3>
        </div>
      ) : (
        /* Items List */
        <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4 bg-gray-50/30">
          {items.map((item) => (
            <div
              key={item.name}
              className="bg-[#f4f4f6] rounded-xl p-4 flex gap-4 relative"
            >
              {/* Item Image */}
              <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-contain drop-shadow-sm"
                />
              </div>

              {/* Item Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-start w-full">
                  <h4
                    className="text-[#111] text-xl leading-tight m-0 font-bold max-w-[65%]"
                    style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.03em" }}
                  >
                    {item.name}
                  </h4>
                  <p
                    className="text-[#111] text-xl m-0 font-bold whitespace-nowrap"
                    style={{ fontFamily: "var(--font-bebas)" }}
                  >
                    {item.price}
                  </p>
                </div>

                {/* Controls and Details button */}
                <div className="flex items-center justify-between mt-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => removeItem(item.name)}
                      className="text-black hover:text-[#e5002a] transition-colors"
                      aria-label={`Remove ${item.name}`}
                    >
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                    <span
                      className="text-[#111] text-xl font-bold"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.name, item.quantity + 1)}
                      className="text-black hover:text-[#e5002a] transition-colors flex items-center justify-center"
                      aria-label="Increase quantity"
                    >
                      <Plus size={22} strokeWidth={3} />
                    </button>
                  </div>

                  <button className="bg-[#e5002a] text-white text-sm font-bold px-3 py-1.5 rounded flex items-center gap-1 hover:bg-[#c40024] transition-colors uppercase tracking-wide">
                    Details <ChevronDown size={16} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer / Checkout Button */}
      <div className="p-4 bg-white relative z-10 shrink-0">
        <Link 
          href="/checkout"
          className="w-full bg-gradient-to-r from-[#e5002a] to-[#c40024] hover:from-[#c40024] hover:to-[#a0001d] text-white py-4 px-6 rounded-xl transition-all duration-300 shadow-md flex items-center justify-between group"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium tracking-wide">
              {count} Item{count > 1 ? 's' : ''}
            </span>
            <span className="text-xl font-medium tracking-wide">|</span>
            <span className="text-xl font-bold tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
              Rs {total.toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
              View Bucket
            </span>
            <div className="bg-white text-[#e5002a] rounded-full p-0.5 group-hover:translate-x-1 transition-transform">
              <ChevronRight size={20} strokeWidth={3} />
            </div>
          </div>
        </Link>
      </div>

    </div>
  );
}
