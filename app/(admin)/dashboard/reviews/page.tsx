import { getReviews } from "@/app/actions/reviews";
import { ReviewsTable } from "@/components/admin/widgets/ReviewsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const newCount = reviews.filter((r) => r.status === "new").length;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reviews & Suggestions</h1>
          <p className="text-sm text-gray-500 mt-1">
            Customer feedback submitted from your website.
            {newCount > 0 && (
              <span className="ml-2 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-0.5 rounded-full">
                {newCount} new
              </span>
            )}
          </p>
        </div>
      </div>

      <div className="w-full">
        <ReviewsTable initialReviews={reviews} />
      </div>
    </div>
  );
}
