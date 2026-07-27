import { SummaryCards } from "@/components/admin/widgets/SummaryCards";
import { LiveOrdersTable } from "@/components/admin/widgets/LiveOrdersTable";
import { RightSidebarWidgets } from "@/components/admin/widgets/RightSidebarWidgets";
import { AnalyticsWidgets } from "@/components/admin/widgets/AnalyticsWidgets";
import { OrderConfirmationQueue } from "@/components/admin/widgets/OrderConfirmationQueue";
import {
  getDashboardSummary,
  getLiveOrders,
  getOrderStatusCounts,
  getPickupQueue,
  getSalesOverview,
  getTopSellingItems,
  getPaymentMethodBreakdown,
  getPendingConfirmationOrders,
} from "@/app/actions/dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const [
    summary,
    liveOrders,
    statusCounts,
    pickupQueue,
    salesOverview,
    topItems,
    paymentBreakdown,
    pendingConfirmation,
  ] = await Promise.all([
    getDashboardSummary(),
    getLiveOrders(),
    getOrderStatusCounts(),
    getPickupQueue(),
    getSalesOverview(),
    getTopSellingItems(),
    getPaymentMethodBreakdown(),
    getPendingConfirmationOrders(),
  ]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── Confirmation Queue — always at the very top ── */}
      <OrderConfirmationQueue initialOrders={pendingConfirmation} />

      {/* Top row: Summary Cards */}
      <SummaryCards summary={summary} />

      {/* Middle row: Main table and Right sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 overflow-hidden">
          <LiveOrdersTable orders={liveOrders} />
        </div>
        <div>
          <RightSidebarWidgets
            statusCounts={statusCounts}
            pickupQueue={pickupQueue}
          />
        </div>
      </div>

      {/* Bottom row: Analytics */}
      <AnalyticsWidgets
        salesData={salesOverview}
        topItems={topItems}
        paymentBreakdown={paymentBreakdown}
      />
    </div>
  );
}