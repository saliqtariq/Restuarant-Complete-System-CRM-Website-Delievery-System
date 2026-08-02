import { Sidebar } from "@/components/admin/Sidebar";
import { Header } from "@/components/admin/Header";
import { NavigationProgress } from "@/components/admin/NavigationProgress";
import { OrderNotificationProvider } from "@/components/admin/OrderNotificationProvider";
import { OrderToastContainer } from "@/components/admin/OrderToast";
import { ReactNode } from "react";
import { getOrderStatusCounts, getDashboardSummary } from "@/app/actions/dashboard";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const [statusCounts, summary] = await Promise.all([
    getOrderStatusCounts(),
    getDashboardSummary()
  ]);

  const counts = {
    orders: summary.pendingOrders,
    pickup: statusCounts.pickup,
    delivery: statusCounts.delivery,
  };

  return (
    <OrderNotificationProvider>
      <div className="flex min-h-screen bg-[#F4F5F7] font-sans">
        <NavigationProgress />
        <Sidebar counts={counts} />
        <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-3 md:p-5">
            <div className="max-w-400 mx-auto w-full">
              {children}
            </div>
          </main>
        </div>
      </div>
      {/* Global toast container — renders outside the scrollable area */}
      <OrderToastContainer />
    </OrderNotificationProvider>
  );
}
