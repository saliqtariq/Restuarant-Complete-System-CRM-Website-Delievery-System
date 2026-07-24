import { getCateringOrders, getCateringRequests } from "@/app/actions/catering";
import { CateringRequestsTable } from "@/components/admin/widgets/CateringRequestsTable";
import { LiveOrdersTable } from "@/components/admin/widgets/LiveOrdersTable";
import { UtensilsCrossed, CalendarCheck, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CateringDashboardPage() {
  const [cateringOrders, cateringRequests] = await Promise.all([
    getCateringOrders(),
    getCateringRequests(),
  ]);

  const newRequestsCount = cateringRequests.filter((r) => r.status === "new").length;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Header & Overview */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
            <UtensilsCrossed className="text-[#3b1200]" size={26} />
            Catering &amp; Event Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage bulk party box orders and customer event quote requests in one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-3">
          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm">
              <CalendarCheck size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Event Requests
              </span>
              <span className="text-base font-bold text-gray-900">
                {cateringRequests.length}{" "}
                {newRequestsCount > 0 && (
                  <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-full ml-1">
                    ({newRequestsCount} new)
                  </span>
                )}
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 flex items-center gap-3 shadow-sm">
            <div className="w-9 h-9 rounded-lg bg-red-50 text-red-700 flex items-center justify-center font-bold text-sm">
              <ShoppingBag size={18} />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wider">
                Catering Orders
              </span>
              <span className="text-base font-bold text-gray-900">
                {cateringOrders.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 1: EVENT QUOTE REQUESTS */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Event Quote Requests</span>
            <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
              {cateringRequests.length}
            </span>
          </h2>
        </div>
        <CateringRequestsTable requests={cateringRequests} />
      </div>

      {/* SECTION 2: CATERING ORDERS */}
      <div className="flex flex-col gap-4 mt-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <span>Catering Bulk Orders</span>
            <span className="text-xs bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">
              {cateringOrders.length}
            </span>
          </h2>
        </div>
        {cateringOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center text-gray-500 text-sm">
            No catering bulk orders placed yet. Orders containing Party Boxes or Custom Catering Crates will appear here automatically.
          </div>
        ) : (
          <LiveOrdersTable
            orders={cateringOrders}
            title="Catering Orders"
            hideViewAll={true}
          />
        )}
      </div>
    </div>
  );
}
