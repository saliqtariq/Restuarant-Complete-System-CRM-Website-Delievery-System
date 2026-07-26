"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, CalendarDays, Clock, Users, Hash } from "lucide-react";

export default function ReservePage() {
  const [formData, setFormData] = useState({
    customer_name: "",
    phone: "",
    reservation_date: "",
    reservation_time: "",
    number_of_guests: 2,
    table_number: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "number_of_guests" ? parseInt(value) || 1 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/reserve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to make reservation");
      }

      setIsSuccess(true);
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center pt-20 pb-12 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h1
            className="text-4xl text-[#111] uppercase font-bold tracking-wide mb-3"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Reservation Confirmed!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you, {formData.customer_name}. We have received your reservation request for{" "}
            <strong className="text-black">{formData.reservation_date}</strong> at{" "}
            <strong className="text-black">{formData.reservation_time}</strong>.
          </p>
          <Link
            href="/"
            className="inline-block w-full bg-[#461a0f] text-white px-8 py-3.5 rounded uppercase font-bold tracking-wider hover:bg-[#34130b] transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      {/* Hero Banner */}
      <div className="w-full bg-[#461a0f] py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link
            href="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Home
          </Link>
          <h1
            className="text-4xl md:text-5xl text-white uppercase tracking-widest m-0"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Book a Table
          </h1>
          <p className="text-white/80 mt-2 text-lg">
            Reserve your spot for an unforgettable dining experience.
          </p>
        </div>
      </div>

      <div className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 -mt-6 pb-20 relative z-10">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
            
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-[#e5002a] px-4 py-3 rounded-lg text-sm font-medium">
                {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="customer_name"
                  required
                  value={formData.customer_name}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#461a0f] focus:ring-1 focus:ring-[#461a0f] transition-colors"
                  placeholder="John Doe"
                />
              </div>

              {/* Phone */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#461a0f] focus:ring-1 focus:ring-[#461a0f] transition-colors"
                  placeholder="03XXXXXXXXX"
                />
              </div>

              {/* Date */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <CalendarDays size={16} className="text-gray-400" />
                  Date
                </label>
                <input
                  type="date"
                  name="reservation_date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.reservation_date}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#461a0f] focus:ring-1 focus:ring-[#461a0f] transition-colors"
                />
              </div>

              {/* Time */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  Time
                </label>
                <input
                  type="time"
                  name="reservation_time"
                  required
                  value={formData.reservation_time}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#461a0f] focus:ring-1 focus:ring-[#461a0f] transition-colors"
                />
              </div>

              {/* Guests */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Users size={16} className="text-gray-400" />
                  Number of Guests
                </label>
                <input
                  type="number"
                  name="number_of_guests"
                  required
                  min="1"
                  max="50"
                  value={formData.number_of_guests}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#461a0f] focus:ring-1 focus:ring-[#461a0f] transition-colors"
                />
              </div>

              {/* Table Number */}
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <Hash size={16} className="text-gray-400" />
                  Table Preference (Optional)
                </label>
                <input
                  type="text"
                  name="table_number"
                  value={formData.table_number}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#461a0f] focus:ring-1 focus:ring-[#461a0f] transition-colors"
                  placeholder="e.g. Table 5, Window seat"
                />
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#461a0f] hover:bg-[#34130b] text-white py-4 rounded-lg font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem" }}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Reserving...
                  </>
                ) : (
                  "Confirm Reservation"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
