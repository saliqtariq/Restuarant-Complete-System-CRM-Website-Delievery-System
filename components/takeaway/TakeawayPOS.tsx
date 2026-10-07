"use client";

import { useState, useTransition } from "react";
import Image from "next/image";
import { menuData } from "@/lib/menu/data";
import { createTakeawayOrder } from "@/app/actions/takeaway";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  XCircle,
  ChefHat,
  Loader2,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

type CartItem = {
  name: string;
  price: string;
  image: string;
  unitPrice: number;
  quantity: number;
};

function parsePrice(priceStr: string): number {
  return parseFloat(priceStr.replace(/[^0-9.]/g, "")) || 0;
}

const GST_RATE = 0.16;

// ─── Toast ────────────────────────────────────────────────────────────────────

type ToastState = {
  type: "success" | "error";
  message: string;
  orderNumber?: string;
} | null;

// ─── Main Component ───────────────────────────────────────────────────────────

export function TakeawayPOS() {
  const [activeCategoryId, setActiveCategoryId] = useState(menuData[0].id);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [toast, setToast] = useState<ToastState>(null);
  const [isPending, startTransition] = useTransition();

  const activeCategory = menuData.find((c) => c.id === activeCategoryId)!;

  // ─── Cart helpers ──────────────────────────────────────────────────────────

  function addToCart(item: { name: string; price: string; image: string }) {
    setCart((prev) => {
      const existing = prev.find((c) => c.name === item.name);
      if (existing) {
        return prev.map((c) =>
          c.name === item.name ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [
        ...prev,
        {
          name: item.name,
          price: item.price,
          image: item.image,
          unitPrice: parsePrice(item.price),
          quantity: 1,
        },
      ];
    });
  }

  function updateQty(name: string, delta: number) {
    setCart((prev) =>
      prev
        .map((c) => (c.name === name ? { ...c, quantity: c.quantity + delta } : c))
        .filter((c) => c.quantity > 0)
    );
  }

  function removeItem(name: string) {
    setCart((prev) => prev.filter((c) => c.name !== name));
  }

  function clearCart() {
    setCart([]);
  }

  // ─── Totals ────────────────────────────────────────────────────────────────

  const subtotal = cart.reduce((sum, c) => sum + c.unitPrice * c.quantity, 0);
  const gst = subtotal * GST_RATE;
  const grandTotal = subtotal + gst;

  // ─── Place Order ───────────────────────────────────────────────────────────

  function placeOrder() {
    if (cart.length === 0) return;
    startTransition(async () => {
      const result = await createTakeawayOrder(
        cart.map((c) => ({
          name: c.name,
          price: c.price,
          image: c.image,
          quantity: c.quantity,
        }))
      );

      if (result.success) {
        setToast({ type: "success", message: "Order sent to kitchen!", orderNumber: result.orderNumber });
        clearCart();
      } else {
        setToast({ type: "error", message: result.error });
      }

      setTimeout(() => setToast(null), 4000);
    });
  }

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="flex h-screen bg-[#0F0A0A] font-sans overflow-hidden">
      {/* ── Left: Menu Panel ── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-[#1A0A0A] border-b border-[#3B0A0A] px-6 py-4 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E63946] to-[#C1121F] flex items-center justify-center shadow-lg">
            <ChefHat size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight">Takeaway POS</h1>
            <p className="text-gray-400 text-xs">Select items to build the order</p>
          </div>
        </div>

        {/* Category tabs */}
        <div className="bg-[#140808] border-b border-[#2A0A0A] px-4 py-3 flex gap-2 overflow-x-auto shrink-0 scrollbar-hide">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                activeCategoryId === cat.id
                  ? "bg-gradient-to-r from-[#E63946] to-[#C1121F] text-white shadow-lg shadow-red-900/40"
                  : "bg-[#1F0C0C] text-gray-300 hover:bg-[#2A1010] hover:text-white border border-[#3B1010]"
              }`}
            >
              {cat.title}
            </button>
          ))}
        </div>

        {/* Item grid */}
        <div className="flex-1 overflow-y-auto p-5">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activeCategory.items.map((item) => {
              const inCart = cart.find((c) => c.name === item.name);
              return (
                <button
                  key={item.name}
                  onClick={() => addToCart(item)}
                  className="group bg-[#1A0808] border border-[#2A1010] rounded-2xl overflow-hidden hover:border-[#E63946] hover:shadow-lg hover:shadow-red-900/30 transition-all duration-200 text-left relative"
                >
                  {/* Badge if in cart */}
                  {inCart && (
                    <div className="absolute top-2 right-2 z-10 bg-[#E63946] text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow">
                      {inCart.quantity}
                    </div>
                  )}

                  {/* Image */}
                  <div className="relative h-36 bg-[#120606]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                      sizes="200px"
                    />
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <p className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2">
                      {item.name}
                    </p>
                    <p className="text-[#E63946] font-bold text-sm">{item.price}</p>
                    <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{item.serves}</p>
                  </div>

                  {/* Tap to add hint */}
                  <div className="absolute inset-0 bg-[#E63946]/0 group-hover:bg-[#E63946]/5 transition-all duration-200 rounded-2xl" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Right: Cart Panel ── */}
      <div className="w-[340px] xl:w-[380px] bg-[#120606] border-l border-[#2A0A0A] flex flex-col shrink-0">
        {/* Cart header */}
        <div className="px-5 py-4 border-b border-[#2A0A0A] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart size={18} className="text-[#E63946]" />
            <span className="text-white font-bold">Current Order</span>
            {cart.length > 0 && (
              <span className="bg-[#E63946] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {cart.reduce((s, c) => s + c.quantity, 0)}
              </span>
            )}
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-gray-500 hover:text-red-400 text-xs flex items-center gap-1 transition-colors"
            >
              <Trash2 size={12} />
              Clear
            </button>
          )}
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center pb-8">
              <div className="w-16 h-16 rounded-2xl bg-[#1A0808] border border-[#2A1010] flex items-center justify-center mb-4">
                <ShoppingCart size={28} className="text-gray-600" />
              </div>
              <p className="text-gray-400 font-medium text-sm">No items yet</p>
              <p className="text-gray-600 text-xs mt-1">Tap any item to add it</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.name}
                className="bg-[#1A0808] border border-[#2A1010] rounded-xl p-3 flex items-center gap-3"
              >
                {/* Item image */}
                <div className="relative w-12 h-12 rounded-lg bg-[#0F0606] shrink-0 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-contain p-1"
                    sizes="48px"
                  />
                </div>

                {/* Name + price */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium leading-snug line-clamp-1">{item.name}</p>
                  <p className="text-[#E63946] text-xs font-semibold mt-0.5">
                    RS {(item.unitPrice * item.quantity).toLocaleString()}
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => updateQty(item.name, -1)}
                    className="w-6 h-6 rounded-lg bg-[#2A1010] hover:bg-[#3B1515] text-white flex items-center justify-center transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-white font-bold text-sm w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQty(item.name, 1)}
                    className="w-6 h-6 rounded-lg bg-[#2A1010] hover:bg-[#3B1515] text-white flex items-center justify-center transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                  <button
                    onClick={() => removeItem(item.name)}
                    className="w-6 h-6 rounded-lg bg-[#2A1010] hover:bg-red-900/50 text-gray-500 hover:text-red-400 flex items-center justify-center transition-colors ml-1"
                  >
                    <Trash2 size={11} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Totals + Place Order */}
        <div className="px-4 py-4 border-t border-[#2A0A0A] space-y-3 shrink-0">
          {cart.length > 0 && (
            <div className="bg-[#1A0808] border border-[#2A1010] rounded-xl p-3 space-y-2">
              <div className="flex justify-between text-sm text-gray-300">
                <span>Subtotal</span>
                <span className="font-medium text-white">RS {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-300">
                <span>GST (16%)</span>
                <span className="font-medium text-white">RS {Math.round(gst).toLocaleString()}</span>
              </div>
              <div className="border-t border-[#2A1010] pt-2 flex justify-between">
                <span className="text-white font-bold">Total</span>
                <span className="text-[#E63946] font-extrabold text-lg">
                  RS {Math.round(grandTotal).toLocaleString()}
                </span>
              </div>
            </div>
          )}

          <button
            onClick={placeOrder}
            disabled={cart.length === 0 || isPending}
            className={`w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2 ${
              cart.length === 0
                ? "bg-[#1A0808] text-gray-600 cursor-not-allowed border border-[#2A1010]"
                : isPending
                ? "bg-[#C1121F] text-white/70 cursor-wait"
                : "bg-gradient-to-r from-[#E63946] to-[#C1121F] text-white shadow-lg shadow-red-900/40 hover:shadow-red-900/60 hover:scale-[1.01] active:scale-[0.99]"
            }`}
          >
            {isPending ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Sending to Kitchen…
              </>
            ) : (
              <>
                <ChefHat size={18} />
                Place Order
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Toast ── */}
      {toast && (
        <div
          className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-sm font-semibold transition-all animate-in slide-in-from-bottom-4 duration-300 ${
            toast.type === "success"
              ? "bg-[#0D2E1A] border-emerald-700/60 text-emerald-300"
              : "bg-[#2E0D0D] border-red-700/60 text-red-300"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          ) : (
            <XCircle size={18} className="text-red-400 shrink-0" />
          )}
          <div>
            <p>{toast.message}</p>
            {toast.orderNumber && (
              <p className="text-emerald-500 text-xs font-bold mt-0.5">{toast.orderNumber}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
