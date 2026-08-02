"use client";

import { useState } from "react";
import { ReviewRow, markReviewAsRead, deleteReview } from "@/app/actions/reviews";
import { Star, Trash2, Eye } from "lucide-react";

function StarRating({ rating }: { rating: number | null }) {
  if (!rating) return <span className="text-gray-400 text-xs">No rating</span>;
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
        />
      ))}
    </div>
  );
}

export function ReviewsTable({ initialReviews }: { initialReviews: ReviewRow[] }) {
  const [reviews, setReviews] = useState(initialReviews);

  const handleMarkRead = async (id: string) => {
    await markReviewAsRead(id);
    setReviews(reviews.map((r) => (r.id === id ? { ...r, status: "read" } : r)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    const res = await deleteReview(id);
    if (res.success) setReviews(reviews.filter((r) => r.id !== id));
  };

  const newCount = reviews.filter((r) => r.status === "new").length;

  return (
    <div className="flex flex-col gap-4">
      {newCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-sm font-medium text-blue-700">
          📬 You have <strong>{newCount}</strong> new unread review{newCount > 1 ? "s" : ""}.
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <h3 className="font-bold text-gray-900 text-sm tracking-wide">
            ALL REVIEWS & SUGGESTIONS ({reviews.length})
          </h3>
        </div>

        {reviews.length === 0 ? (
          <div className="px-5 py-10 text-center text-gray-500">
            No reviews or suggestions yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {reviews.map((review) => (
              <div
                key={review.id}
                className={`px-5 py-4 transition-colors ${
                  review.status === "new" ? "bg-blue-50/30" : "hover:bg-gray-50/50"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 flex-wrap mb-1">
                      <span className="font-bold text-gray-900 text-sm">
                        {review.customer_name}
                      </span>
                      {review.email && (
                        <span className="text-gray-400 text-xs">{review.email}</span>
                      )}
                      {review.status === "new" && (
                        <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                          New
                        </span>
                      )}
                    </div>
                    <StarRating rating={review.rating} />
                    <p className="text-gray-700 text-sm mt-2 leading-relaxed">
                      {review.message}
                    </p>
                    <p className="text-gray-400 text-[11px] mt-1">
                      {new Date(review.created_at).toLocaleString("en-PK", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {review.status === "new" && (
                      <button
                        onClick={() => handleMarkRead(review.id)}
                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                        title="Mark as Read"
                      >
                        <Eye size={16} />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-1.5 bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
