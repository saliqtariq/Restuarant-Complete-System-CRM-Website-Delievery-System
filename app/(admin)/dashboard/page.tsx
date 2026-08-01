import { Suspense } from "react";
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

function SkeletonLoader({ height = "h-48" }: { height?: string }) {
  return <div className={`animate-pulse bg-gray-200 rounded-xl ${height} w-full`} />;
}

async function SummaryCardsWrapper() {
  const summary = await getDashboardSummary();
  return <SummaryCards summary={summary} />;
}

async function LiveOrdersTableWrapper() {
  const liveOrders = await getLiveOrders();
  return <LiveOrdersTable orders={liveOrders} />;
}

async function RightSidebarWidgetsWrapper() {
  const [statusCounts, pickupQueue] = await Promise.all([
    getOrderStatusCounts(),
    getPickupQueue(),
  ]);
  return <RightSidebarWidgets statusCounts={statusCounts} pickupQueue={pickupQueue} />;
}

async function AnalyticsWidgetsWrapper() {
  const [salesOverview, topItems, paymentBreakdown] = await Promise.all([
    getSalesOverview(),
    getTopSellingItems(),
    getPaymentMethodBreakdown(),
  ]);
  return (
    <AnalyticsWidgets
      salesData={salesOverview}
      topItems={topItems}
      paymentBreakdown={paymentBreakdown}
    />
  );
}

async function OrderConfirmationQueueWrapper() {
  const pendingConfirmation = await getPendingConfirmationOrders();
  return <OrderConfirmationQueue initialOrders={pendingConfirmation} />;
}

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* ── Confirmation Queue — always at the very top ── */}
      <Suspense fallback={<SkeletonLoader height="h-24" />}>
        <OrderConfirmationQueueWrapper />
      </Suspense>

      {/* Top row: Summary Cards */}
      <Suspense fallback={<SkeletonLoader height="h-32" />}>
        <SummaryCardsWrapper />
      </Suspense>

      {/* Middle row: Main table and Right sidebar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1 overflow-hidden">
          <Suspense fallback={<SkeletonLoader height="h-96" />}>
            <LiveOrdersTableWrapper />
          </Suspense>
        </div>
        <div className="w-full lg:w-80 flex-shrink-0">
          <Suspense fallback={<SkeletonLoader height="h-96" />}>
            <RightSidebarWidgetsWrapper />
          </Suspense>
        </div>
      </div>

      {/* Bottom row: Analytics */}
      <Suspense fallback={<SkeletonLoader height="h-96" />}>
        <AnalyticsWidgetsWrapper />
      </Suspense>
    </div>
  );
}