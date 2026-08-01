"use client";

import { useCartStore } from "@/lib/cartStore";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Store,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/backend/supabase";
import type { Session } from "@supabase/supabase-js";

type PaymentMethod = "cod";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const totalPrice = useCartStore((s) => s.totalPrice);
  const clearCart = useCartStore((s) => s.clearCart);
  const orderType = useCartStore((s) => s.orderType);
  const locationDetails = useCartStore((s) => s.locationDetails);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  const subtotal = totalPrice();
  const deliveryFee = subtotal > 0 ? 150 : 0;

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [session, setSession] = useState<Session | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    discount_amount: number;
    original_discount: number;
    type: string;
  } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState("");

  // Pre-fill address if delivery location is set, and fetch user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user?.user_metadata) {
        const meta = session.user.user_metadata;
        if (meta.first_name || meta.last_name) setFullName(`${meta.first_name || ""} ${meta.last_name || ""}`.trim());
        if (meta.phone) setPhone(meta.phone);
        if (meta.city && orderType === "delivery") setCity(meta.city);
        if (meta.address && orderType === "delivery") setAddress(meta.address);
      }
    });
    
    const id = window.setTimeout(() => {
      if (orderType !== "delivery" || !locationDetails) return;
      // Only set from locationDetails if not already pre-filled from user profile
      setAddress((prev) => prev || locationDetails);
      setCity((prev) => prev || "Lahore");
    }, 0);
    return () => window.clearTimeout(id);
  }, [orderType, locationDetails]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError("");
    try {
      const res = await fetch("/api/coupon/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Invalid coupon");
      setAppliedCoupon(data.coupon);
    } catch (err: any) {
      setCouponError(err.message);
      setAppliedCoupon(null);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    setCouponError("");
  };

  // ── COD submit ──
  const handleCodSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Auto-save user profile fields if authenticated
      if (session) {
        const [firstName, ...lastNameArr] = fullName.split(" ");
        const lastName = lastNameArr.join(" ");
        supabase.auth.updateUser({
          data: {
            first_name: firstName,
            last_name: lastName,
            phone: phone,
            city: orderType === "delivery" ? city : undefined,
            address: orderType === "delivery" ? address : undefined,
          }
        }).catch(console.error); // Fire and forget
      }

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(session?.access_token ? { "Authorization": `Bearer ${session.access_token}` } : {})
        },
        body: JSON.stringify({
          items,
          delivery: {
            fullName,
            phone,
            city: orderType === "pickup" ? "N/A" : city,
            address: orderType === "pickup" ? locationDetails || "Pickup" : address,
            paymentMethod: "cod",
            type: orderType || "delivery",
            couponCode: appliedCoupon?.code || undefined,
          },
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong");
      setOrderNumber(data.orderNumber);
      setIsSuccess(true);
      clearCart();
    } catch (error: any) {
      console.error("Failed to place order:", error);
      alert(error.message || "Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCodSubmit();
  };

  /* ─── COD success screen ─── */
  if (isSuccess) {
    return (
      <main className="min-h-screen bg-white pt-24 pb-12 flex flex-col items-center justify-center">
        <div className="max-w-md w-full px-6 text-center">
          <CheckCircle2 className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h1
            className="text-4xl text-[#111] uppercase font-bold tracking-wide mb-2"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your order. Your order number is{" "}
            <strong className="text-black">{orderNumber}</strong>. We&apos;ll
            send you an email confirmation shortly.
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

  const discountAmount = appliedCoupon?.discount_amount ?? 0;
  const discountedSubtotal = Math.max(0, subtotal - discountAmount);
  const gst = discountedSubtotal * 0.16;
  const grandTotal = Math.round(
    discountedSubtotal + (orderType === "pickup" ? 0 : deliveryFee) + gst
  );

  return (
    <main className="min-h-screen bg-gray-50/50 pb-20">
      {/* Hero Banner */}
      <div className="w-full bg-gradient-to-br from-[#451400] via-[#5a1e08] to-[#451400] py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <Link
            href="/menu"
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Menu
          </Link>
          <h1
            className="text-5xl md:text-6xl text-white uppercase tracking-wider m-0"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
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
                <h2
                  className="text-2xl text-black uppercase m-0"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
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
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-black text-lg m-0 leading-none">
                          {item.name}
                        </h4>
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
              <div className="p-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                <h2
                  className="text-2xl text-black uppercase m-0"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {orderType === "pickup" ? "Pickup Details" : "Delivery Details"}
                </h2>
                {orderType && (
                  <span className="bg-[#451400] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    {orderType}
                  </span>
                )}
              </div>
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                {orderType === "pickup" && locationDetails && (
                  <div className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-lg p-4 mb-2 flex items-start gap-3">
                    <Store className="text-[#451400] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-gray-900 uppercase tracking-widest text-sm">
                        Picking up from:
                      </h4>
                      <p className="text-gray-700 text-lg">{locationDetails}</p>
                    </div>
                  </div>
                )}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]"
                    placeholder="Saliq Tariq"
                  />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-sm font-bold text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    required
                    pattern="^03[0-9]{9}$"
                    title="Phone number must start with 03 and be exactly 11 digits long"
                    maxLength={11}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]"
                    placeholder="03XXXXXXXXX"
                  />
                </div>
                {orderType !== "pickup" && (
                  <>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-bold text-gray-700">City</label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]"
                        placeholder="Lahore"
                      />
                    </div>
                    <div className="space-y-1 md:col-span-2">
                      <label className="text-sm font-bold text-gray-700">Full Address</label>
                      <textarea
                        required
                        rows={3}
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a]"
                        placeholder="House #, Street, Area..."
                      />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Payment & Totals */}
          <div className="w-full lg:w-1/3 space-y-6">

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2
                  className="text-2xl text-black uppercase m-0"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  Payment Method
                </h2>
              </div>
              <div className="p-5 space-y-3">

                {/* COD Option */}
                <label
                  htmlFor="pm-cod"
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                    paymentMethod === "cod"
                      ? "border-[#e5002a] bg-red-50/50 shadow-sm"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <input
                    type="radio"
                    id="pm-cod"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="w-4 h-4 text-[#e5002a] accent-[#e5002a]"
                  />
                  <Banknote
                    className={`ml-3 mr-2 transition-colors ${
                      paymentMethod === "cod" ? "text-[#e5002a]" : "text-gray-400"
                    }`}
                    size={20}
                  />
                  <div>
                    <span
                      className={`font-semibold block text-sm ${
                        paymentMethod === "cod" ? "text-black" : "text-gray-600"
                      }`}
                    >
                      Cash on Delivery
                    </span>
                    <span className="text-xs text-gray-400">Pay when you receive</span>
                  </div>
                </label>


              </div>
            </div>

            {/* Coupon Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                <h2
                  className="text-2xl text-black uppercase m-0"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  Have a Coupon?
                </h2>
              </div>
              <div className="p-5 space-y-3">
                {appliedCoupon ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded flex justify-between items-center">
                    <div>
                      <p className="font-bold uppercase tracking-wide text-sm">
                        {appliedCoupon.code}
                      </p>
                      <p className="text-xs">Coupon applied successfully</p>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-red-500 hover:text-red-700 text-sm font-bold uppercase tracking-widest"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        className="flex-1 border border-gray-300 rounded px-3 py-2.5 focus:outline-none focus:border-[#e5002a] focus:ring-1 focus:ring-[#e5002a] uppercase"
                        placeholder="ENTER CODE"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isApplyingCoupon || !couponCode.trim()}
                        className="bg-black hover:bg-gray-800 text-white px-4 py-2 rounded uppercase font-bold tracking-widest text-sm disabled:opacity-50 transition-colors flex items-center justify-center min-w-[90px]"
                      >
                        {isApplyingCoupon ? (
                          <Loader2 className="animate-spin" size={16} />
                        ) : (
                          "Apply"
                        )}
                      </button>
                    </div>
                    {couponError && (
                      <p className="text-[#e5002a] text-sm mt-2">{couponError}</p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Price Calculation & Submit */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden sticky top-6">
              <div className="p-5 space-y-3 border-b border-gray-100">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-black">
                    RS {subtotal.toLocaleString()}
                  </span>
                </div>
                {appliedCoupon && (
                  <div className="flex justify-between text-[#e5002a]">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span className="font-medium">
                      - RS {Math.round(discountAmount).toLocaleString()}
                    </span>
                  </div>
                )}
                {orderType !== "pickup" && (
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-black">
                      RS {deliveryFee.toLocaleString()}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>GST (16%)</span>
                  <span className="font-medium text-black">
                    RS {Math.round(gst).toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="p-5 bg-gray-50/50">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-lg font-bold text-gray-900 uppercase tracking-wide">
                    Total
                  </span>
                  <span
                    className="text-3xl font-bold text-[#e5002a]"
                    style={{ fontFamily: "var(--font-bebas)" }}
                  >
                    RS {grandTotal.toLocaleString()}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting || items.length === 0}
                  className={`w-full disabled:bg-gray-300 disabled:cursor-not-allowed text-white uppercase font-bold tracking-widest py-4 px-6 rounded transition-all duration-300 shadow-md flex justify-center items-center gap-2 bg-[#e5002a] hover:bg-[#c40024]`}
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem" }}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Processing…
                    </>
                  ) : (
                    <>
                      Place Order <ChevronRight size={20} />
                    </>
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
