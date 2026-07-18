"use client";

import { useState } from "react";
import { submitReview } from "@/app/actions/reviews";

const UserIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b4987f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" fill="#b4987f" stroke="none" />
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="#b4987f" stroke="none" />
  </svg>
);

const EnvelopeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b4987f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" fill="#b4987f" stroke="none" />
    <path d="M22 6l-10 7L2 6" stroke="white" strokeWidth="2" />
  </svg>
);

const PencilIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#b4987f" stroke="#b4987f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
  </svg>
);

const ChefHatIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#c4a47c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3c-1.2 0-2.4.6-3 1.7A3.5 3.5 0 0 0 4 9.5c0 1.9 1.5 3.5 3.5 3.5H9v6h6v-6h1.5c2 0 3.5-1.6 3.5-3.5 0-1.8-1.4-3.3-3.2-3.5A3.6 3.6 0 0 0 15 4.7 3.5 3.5 0 0 0 12 3Z" />
    <path d="M9 19h6" />
    <path d="M9 22h6" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

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
    <div className="w-full flex flex-col items-center">
      <div className="mb-2 flex justify-center">
        <ChefHatIcon />
      </div>
      <h4 
        className="text-[#3e2b2f] text-2xl uppercase tracking-wide mb-3"
        style={{ fontFamily: 'var(--font-anton)' }}
      >
        Leave a Suggestion
      </h4>
      
      <div className="flex items-center justify-center gap-2 mb-8 w-full max-w-[200px]">
        <div className="h-[1px] bg-[#e5dcd3] flex-1"></div>
        <div className="w-2 h-2 rotate-45 border border-[#c4a47c]"></div>
        <div className="h-[1px] bg-[#e5dcd3] flex-1"></div>
      </div>

      {success ? (
        <div className="bg-[#fcfbf8] text-[#9b2c2c] p-4 rounded-md text-sm border border-[#e5dcd3] font-medium w-full text-center">
          Thank you for your feedback!
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b4987f]">
              <UserIcon />
            </div>
            <input
              type="text"
              required
              placeholder="Your Name"
              value={formData.customer_name}
              onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
              className="w-full bg-[#fcfbf8] border border-[#e5dcd3] rounded-lg pl-12 pr-4 py-3 text-sm text-[#3e2b2f] placeholder-[#b4987f] focus:outline-none focus:border-[#c4a47c] focus:ring-1 focus:ring-[#c4a47c] transition-colors"
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#b4987f]">
              <EnvelopeIcon />
            </div>
            <input
              type="email"
              placeholder="Email (optional)"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-[#fcfbf8] border border-[#e5dcd3] rounded-lg pl-12 pr-4 py-3 text-sm text-[#3e2b2f] placeholder-[#b4987f] focus:outline-none focus:border-[#c4a47c] focus:ring-1 focus:ring-[#c4a47c] transition-colors"
            />
          </div>
          
          <div className="relative">
            <div className="absolute left-4 top-4 text-[#b4987f]">
              <PencilIcon />
            </div>
            <textarea
              required
              placeholder="Your suggestion or review..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full bg-[#fcfbf8] border border-[#e5dcd3] rounded-lg pl-12 pr-4 py-3 text-sm text-[#3e2b2f] placeholder-[#b4987f] focus:outline-none focus:border-[#c4a47c] focus:ring-1 focus:ring-[#c4a47c] min-h-[120px] resize-y transition-colors"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="mt-2 bg-[#9b2c2c] hover:bg-[#7a2222] text-white font-bold py-3.5 px-6 rounded-lg text-sm transition-colors disabled:opacity-50 flex items-center justify-between uppercase tracking-wider"
          >
            <span className="flex-1 text-center">{loading ? "Submitting..." : "Submit Feedback"}</span>
            <ArrowRightIcon />
          </button>
        </form>
      )}
    </div>
  );
}
