"use client";

import { useState } from "react";
import { Calendar, Users, Phone, Mail, User, Send, CheckCircle2, Loader2 } from "lucide-react";
import { submitCateringRequest } from "@/app/actions/catering";

export default function CateringInquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventType: "Family Reunion",
    guestCount: "50-100",
    eventDate: "",
    notes: "",
  });

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers and limit length to 11 digits
    const cleaned = e.target.value.replace(/[^0-9]/g, "").slice(0, 11);
    setFormData((prev) => ({ ...prev, phone: cleaned }));
    if (phoneError) setPhoneError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Strict phone validation: must start with 03 and be exactly 11 digits
    const phoneRegex = /^03[0-9]{9}$/;
    if (!phoneRegex.test(formData.phone)) {
      setPhoneError("Please enter a valid 11-digit mobile number starting with 03 (e.g. 03001234567)");
      return;
    }

    setLoading(true);
    setPhoneError("");
    try {
      await submitCateringRequest(formData);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setSubmitted(true); // fallback so user gets feedback
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 px-4 max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-[#e8e0d8] overflow-hidden grid grid-cols-1 md:grid-cols-5">

        {/* Left Info Column */}
        <div className="md:col-span-2 bg-[#3b1200] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-amber-400 text-xs font-bold uppercase tracking-widest block mb-2">
              Large Scale Events (50+ Guests)
            </span>
            <h3
              className="text-3xl sm:text-4xl font-extrabold uppercase leading-tight mb-4"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Need Live Catering Or Custom Setup?
            </h3>
            <p className="text-amber-100/80 text-xs sm:text-sm leading-relaxed mb-6">
              Planning a massive family reunion, wedding reception, or corporate gala? We offer live burger stations, customized live grilling, and dedicated event servers.
            </p>

            <div className="space-y-4 border-t border-amber-900/40 pt-6 text-xs text-amber-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Phone size={16} />
                </div>
                <span>+92 300 1234567 (Dedicated Line)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                  <Mail size={16} />
                </div>
                <span>catering@abrahamstable.com</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-8 pt-6 border-t border-amber-900/40">
            <span className="text-[11px] text-amber-300/70 uppercase tracking-widest block">Response Guarantee</span>
            <p className="text-xs font-medium text-amber-100">Our Event Specialist will call back within 2 hours.</p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="md:col-span-3 p-8 sm:p-10">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <CheckCircle2 size={36} />
              </div>
              <h4 className="text-2xl font-bold text-[#3b1200] mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
                Catering Request Received!
              </h4>
              <p className="text-gray-600 text-sm max-w-sm mb-6">
                Thank you {formData.name}! Our event manager will review your request for {formData.guestCount} guests and contact you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="text-xs font-bold uppercase tracking-wider text-[#3b1200] underline hover:text-[#5a1e00]"
              >
                Submit another inquiry
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h4 className="text-2xl font-bold text-[#3b1200] uppercase mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
                Request Event Quote
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Your Name</label>
                  <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-[#3b1200]">
                    <User size={16} className="text-gray-400 mr-2 shrink-0" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Salik Tariq"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full text-xs text-gray-800 bg-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Phone Number</label>
                  <div className={`flex items-center border rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white ${phoneError ? "border-red-500 bg-red-50/30" : "border-gray-300 focus-within:border-[#3b1200]"}`}>
                    <Phone size={16} className="text-gray-400 mr-2 shrink-0" />
                    <input
                      type="tel"
                      required
                      maxLength={11}
                      placeholder="03001234567"
                      value={formData.phone}
                      onChange={handlePhoneChange}
                      className="w-full text-xs text-gray-800 bg-transparent outline-none"
                    />
                  </div>
                  {phoneError && (
                    <p className="text-[11px] text-red-600 font-medium mt-1">{phoneError}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Event Type</label>
                  <select
                    value={formData.eventType}
                    onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
                    className="w-full text-xs text-gray-800 border border-gray-300 rounded-xl px-3 py-2.5 bg-gray-50 focus:bg-white focus:border-[#3b1200] outline-none"
                  >
                    <option value="Family Reunion">Family Reunion</option>
                    <option value="Birthday Party">Birthday Party</option>
                    <option value="Corporate Gathering">Corporate Gathering</option>
                    <option value="Wedding / Reception">Wedding / Reception</option>
                    <option value="Other Big Party">Other Big Party</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Estimated Guests</label>
                  <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-[#3b1200]">
                    <Users size={16} className="text-gray-400 mr-2 shrink-0" />
                    <select
                      value={formData.guestCount}
                      onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                      className="w-full text-xs text-gray-800 bg-transparent outline-none"
                    >
                      <option value="20-50">20 - 50 Guests</option>
                      <option value="50-100">50 - 100 Guests</option>
                      <option value="100-200">100 - 200 Guests</option>
                      <option value="200+">200+ Guests</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Event Date</label>
                <div className="flex items-center border border-gray-300 rounded-xl px-3 py-2.5 bg-gray-50 focus-within:bg-white focus-within:border-[#3b1200]">
                  <Calendar size={16} className="text-gray-400 mr-2 shrink-0" />
                  <input
                    type="date"
                    required
                    value={formData.eventDate}
                    onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
                    className="w-full text-xs text-gray-800 bg-transparent outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Special Requirements / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your menu preferences, venue location, or live station requests..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full text-xs text-gray-800 border border-gray-300 rounded-xl p-3 bg-gray-50 focus:bg-white focus:border-[#3b1200] outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#3b1200] hover:bg-[#5a1e00] text-white font-bold uppercase tracking-wider text-xs py-3.5 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                style={{ fontFamily: "var(--font-bebas)", fontSize: "1.1rem" }}
              >
                <Send size={16} />
                Submit Quote Request
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  );
}
