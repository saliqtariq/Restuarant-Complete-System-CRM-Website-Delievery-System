import {
  getDashboardSummary,
  getSalesOverview,
  getTopSellingItems,
  getPaymentMethodBreakdown,
} from "@/app/actions/dashboard";
import { getReviews } from "@/app/actions/reviews";
import { ReportsView } from "@/components/admin/widgets/ReportsView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ReportsPage() {
  const [summary, salesData, topItems, paymentData, reviews] = await Promise.all([
    getDashboardSummary(),
    getSalesOverview(),
    getTopSellingItems(),
    getPaymentMethodBreakdown(),
    getReviews(),
  ]);

  const totalRevenue = paymentData.reduce((s, p) => s + p.total, 0);
  const avgOrderValue =
    summary.totalOrders > 0 ? totalRevenue / summary.totalOrders : 0;

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">
          Overview of your restaurant's performance.
        </p>
      </div>

      <ReportsView
        summary={summary}
        salesData={salesData}
        topItems={topItems}
        paymentData={paymentData}
        reviews={reviews}
        totalRevenue={totalRevenue}
        avgOrderValue={avgOrderValue}
      />
    </div>
  );
}
