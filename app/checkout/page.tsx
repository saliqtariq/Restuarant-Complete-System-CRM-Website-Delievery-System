"use client";

import { useCartStore } from "@/lib/cartStore";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CreditCard, Wallet, Banknote, CheckCircle2, ChevronRight, Loader2 } from "lucide-react";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<"cod" | "jazzcash" | "easypaisa" | "card">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = totalPrice();
  const deliveryFee = subtotal > 0 ? 150 : 0;
  const gst = subtotal * 0.16; // 16% GST
  const grandTotal = subtotal + deliveryFee + gst;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call to backend
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    // Generate a random order number
    const newOrderNum = "ORD-" + Math.floor(100000 + Math.random() * 900000);
    setOrderNumber(newOrderNum);
    setIsSuccess(true);
    setIsSubmitting(false);
    clearCart();
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1 className="text-4xl text-[#111] uppercase font-bold tracking-wide mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your order number is <strong className="text-black">{orderNumber}</strong>. We'll send you an email confirmation shortly.
          </p>
          <Link
            href="/menu"
            className="inline-block bg-[#e5002a] text-white px-8 py-3 rounded uppercase font-bold tracking-wider hover:bg-[#c40024] transition-colors"
          >
            Back to Menu
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-br from-[#451400] via-[#5a1e08] to-[#451400] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link href="/menu" className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm font-bold uppercase tracking-wider">
            <ArrowLeft size={16} className="mr-2" /> Back to Menu
          </Link>
          <h1 className="text-5xl md:text-6xl text-white uppercase tracking-wider m-0" style={{ fontFamily: "var(--font-bebas)" }}>
            Secure Checkout
          </h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 relative z-10">
        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column: Delivery & Summary */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-2xl text-black uppercase m-0" style={{ fontFamily: "var(--font-bebas)" }}>
                  Order Summary
                </h2>
              </div>
              <div className="p-5 space-y-4">
                {items.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Your cart is empty.</p>
                ) : (
                  items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-2">
                      <div className="w-16 h-16 bg-gray-50 rounded-lg relative flex-shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-2" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-lg m-0 leading-none">{item.name}</h4>
                        <p className="text-gray-500 text-sm mt-1">Qty: {item.quantity}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-black">{item.price}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Delivery Details */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-2xl text-black uppercase m-0" style={{ fontFamily: "var(--font-bebas)" }}>
                  Delivery Details
                </h2>
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input type="text" required className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]" placeholder="John Doe" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <input type="tel" required className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]" placeholder="03XXXXXXXXX" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">City</label>
                  <input type="text" required className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]" placeholder="Lahore" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Full Address</label>
                  <textarea required rows={3} className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]" placeholder="House #, Street, Area..."></textarea>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Payment & Totals */}
          <div className="w-full lg:w-1/3 space-y-6">
            
            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-2xl text-black uppercase m-0" style={{ fontFamily: "var(--font-bebas)" }}>
                  Payment Method
                </h2>
              </div>
              <div className="p-5 space-y-3">
                {/* COD */}
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'cod' ? 'border-[#e5002a] bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="w-4 h-4 text-[#e5002a] accent-[#e5002a]" />
                  <Banknote className={`ml-3 mr-2 ${paymentMethod === 'cod' ? 'text-[#e5002a]' : 'text-gray-400'}`} size={20} />
                  <span className={`font-medium ${paymentMethod === 'cod' ? 'text-black' : 'text-gray-600'}`}>Cash on Delivery</span>
                </label>

                {/* Card */}
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'card' ? 'border-[#e5002a] bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="w-4 h-4 text-[#e5002a] accent-[#e5002a]" />
                  <CreditCard className={`ml-3 mr-2 ${paymentMethod === 'card' ? 'text-[#e5002a]' : 'text-gray-400'}`} size={20} />
                  <span className={`font-medium ${paymentMethod === 'card' ? 'text-black' : 'text-gray-600'}`}>Credit/Debit Card</span>
                </label>

                {/* JazzCash */}
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'jazzcash' ? 'border-[#e5002a] bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="jazzcash" checked={paymentMethod === 'jazzcash'} onChange={() => setPaymentMethod('jazzcash')} className="w-4 h-4 text-[#e5002a] accent-[#e5002a]" />
                  <Wallet className={`ml-3 mr-2 ${paymentMethod === 'jazzcash' ? 'text-[#e5002a]' : 'text-gray-400'}`} size={20} />
                  <span className={`font-medium ${paymentMethod === 'jazzcash' ? 'text-black' : 'text-gray-600'}`}>JazzCash</span>
                </label>

                {/* EasyPaisa */}
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'easypaisa' ? 'border-[#e5002a] bg-red-50/50' : 'border-gray-200 hover:border-gray-300'}`}>
                  <input type="radio" name="payment" value="easypaisa" checked={paymentMethod === 'easypaisa'} onChange={() => setPaymentMethod('easypaisa')} className="w-4 h-4 text-[#e5002a] accent-[#e5002a]" />
                  <Wallet className={`ml-3 mr-2 ${paymentMethod === 'easypaisa' ? 'text-[#e5002a]' : 'text-gray-400'}`} size={20} />
                  <span className={`font-medium ${paymentMethod === 'easypaisa' ? 'text-black' : 'text-gray-600'}`}>EasyPaisa</span>
                </label>

                {/* Conditional Payment Fields */}
                {paymentMethod === 'card' && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3 border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <div>
                      <label className="text-xs font-bold text-gray-700 block mb-1">Card Number</label>
                      <input type="text" required placeholder="0000 0000 0000 0000" className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">Expiry Date</label>
                        <input type="text" required placeholder="MM/YY" className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-700 block mb-1">CVV</label>
                        <input type="text" required placeholder="123" className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
                      </div>
                    </div>
                  </div>
                )}

                {(paymentMethod === 'jazzcash' || paymentMethod === 'easypaisa') && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs font-bold text-gray-700 block mb-1">Mobile Account Number</label>
                    <input type="tel" required placeholder="03XXXXXXXXX" className="w-full text-sm border border-gray-300 rounded px-3 py-2" />
                    <p className="text-xs text-gray-500 mt-2">You will receive a prompt on your phone to enter your PIN to authorize the payment.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Price Calculation & Submit */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-5 space-y-3 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">RS {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span className="font-medium text-black">RS {deliveryFee.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>GST (16%)</span>
                  <span className="font-medium text-black">RS {Math.round(gst).toLocaleString()}</span>
                </div>
              </div>
              <div className="p-5 bg-gray-50/50">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-lg font-bold text-gray-900 uppercase tracking-wide">Total</span>
                  <span className="text-3xl font-bold text-[#e5002a]" style={{ fontFamily: "var(--font-bebas)" }}>
                    RS {Math.round(grandTotal).toLocaleString()}
                  </span>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className="w-full bg-[#e5002a] hover:bg-[#c40024] disabled:bg-gray-300 disabled:cursor-not-allowed text-white uppercase font-bold tracking-widest py-4 px-6 rounded transition-all duration-300 shadow-md flex justify-center items-center gap-2"
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem" }}
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={20} /> Processing...</>
                  ) : (
                    <>Place Order <ChevronRight size={20} /></>
                  )}
                </button>
              </div>
            </div>

          </div>
        </form>
      </div>
    </main>
  );
}
