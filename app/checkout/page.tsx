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

  const [paymentMethod, setPaymentMethod] = useState<"cod">("cod");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  const subtotal = totalPrice();
  const deliveryFee = subtotal > 0 ? 150 : 0;
  const gst = subtotal * 0.16; // 16% GST
  const grandTotal = subtotal + deliveryFee + gst;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          delivery: {
            fullName,
            phone,
            city,
            address,
            paymentMethod: "cod"
          },
          financials: {
            subtotal,
            deliveryFee,
            gst,
            grandTotal
          }
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setOrderNumber(data.orderNumber);
      setIsSuccess(true);
      clearCart();
    } catch (error) {
      console.error("Failed to place order:", error);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
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
                  <input type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]" placeholder="Saliq Tariq" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <input type="tel" required pattern="^03[0-9]{9}$" title="Phone number must start with 03 and be exactly 11 digits long" maxLength={11} value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]" placeholder="03XXXXXXXXX" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-bold text-gray-700">City</label>
                  <input type="text" required value={city} onChange={(e) => setCity(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]" placeholder="Lahore" />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Full Address</label>
                  <textarea required rows={3} value={address} onChange={(e) => setAddress(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]" placeholder="House #, Street, Area..."></textarea>
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
                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors border-[#e5002a] bg-red-50/50`}>
                  <input type="radio" name="payment" value="cod" checked={true} readOnly className="w-4 h-4 text-[#e5002a] accent-[#e5002a]" />
                  <Banknote className="ml-3 mr-2 text-[#e5002a]" size={20} />
                  <span className="font-medium text-black">Cash on Delivery</span>
                </label>
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
