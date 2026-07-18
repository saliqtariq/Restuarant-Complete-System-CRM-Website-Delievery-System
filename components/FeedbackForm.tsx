"use client";

import { useState } from "react";
import { submitReview } from "@/app/actions/reviews";

export function FeedbackForm() {
  const [formData, setFormData] = useState({
    customer_name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await submitReview({
      customer_name: formData.customer_name,
      email: formData.email,
      message: formData.message,
      rating: null,
    });

    if (res.success) {
      setSuccess(true);
      setFormData({ customer_name: "", email: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } else {
      alert("Failed to submit feedback. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 mt-4 w-full max-w-sm">
      <h4 className="text-[#451400] font-bold mb-3 uppercase text-sm tracking-wide">Leave a Suggestion</h4>
      {success ? (
        <div className="bg-green-50 text-green-700 p-3 rounded text-sm border border-green-200 font-medium">
          Thank you for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="text"
            required
            placeholder="Your Name"
            value={formData.customer_name}
            onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
          />
          <input
            type="email"
            placeholder="Email (optional)"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946]"
          />
          <textarea
            required
            placeholder="Your suggestion or review..."
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#E63946] focus:ring-1 focus:ring-[#E63946] min-h-[80px]"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#E63946] hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </form>
      )}
    </div>
  );
}
