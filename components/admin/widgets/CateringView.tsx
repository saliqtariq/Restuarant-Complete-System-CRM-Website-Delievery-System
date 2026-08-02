"use client";

import { useState } from "react";
import { CateringRequestsTable } from "@/components/admin/widgets/CateringRequestsTable";
import { LiveOrdersTable } from "@/components/admin/widgets/LiveOrdersTable";
import { UtensilsCrossed, CalendarCheck, ShoppingBag } from "lucide-react";

type CateringViewProps = {
  cateringOrders: any[];
  cateringRequests: any[];
};

export function CateringView({ cateringOrders, cateringRequests }: CateringViewProps) {
  const [activeTab, setActiveTab] = useState<"requests" | "orders">("requests");

  const newRequestsCount = cateringRequests.filter((r) => r.status === "new").length;

  return (
    <div className="flex flex-col gap-6 pb-12">
      {/* Clean Header & Summary Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Catering & Event Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            View event quote requests and process party box & bulk catering orders.
          </p>
        </div>

        {/* High-visibility Stat Cards */}
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-center gap-3 min-w-37.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500 text-white flex items-center justify-center font-bold">
              <CalendarCheck size={20} />
            </div>
            <div>
              <div className="text-xs font-semibold text-amber-900">Event Quotes</div>
              <div className="text-xl font-bold text-gray-900 flex items-center gap-2">
                {cateringRequests.length}
                {newRequestsCount > 0 && (
                  <span className="text-xs bg-amber-500 text-white font-bold px-2 py-0.5 rounded-full">
                    {newRequestsCount} new
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 flex items-center gap-3 min-w-37.5">
            <div className="w-10 h-10 rounded-lg bg-red-600 text-white flex items-center justify-center font-bold">
              <ShoppingBag size={20} />
            </div>
            <div>
              <div className="text-xs font-semibold text-red-900">Bulk Orders</div>
              <div className="text-xl font-bold text-gray-900">
                {cateringOrders.length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 gap-2">
        <button
          onClick={() => setActiveTab("requests")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "requests"
              ? "border-[#3B0A0A] text-[#3B0A0A]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <CalendarCheck size={18} />
          Event Quote Requests ({cateringRequests.length})
        </button>

        <button
          onClick={() => setActiveTab("orders")}
          className={`flex items-center gap-2 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
            activeTab === "orders"
              ? "border-[#3B0A0A] text-[#3B0A0A]"
              : "border-transparent text-gray-500 hover:text-gray-800"
          }`}
        >
          <ShoppingBag size={18} />
          Catering Bulk Orders ({cateringOrders.length})
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === "requests" && (
        <div className="flex flex-col gap-3">
          <CateringRequestsTable requests={cateringRequests} />
        </div>
      )}

      {activeTab === "orders" && (
        <div className="flex flex-col gap-3">
          {cateringOrders.length === 0 ? (
            <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 text-center">
              <div className="w-14 h-14 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <UtensilsCrossed size={24} />
              </div>
              <h3 className="text-base font-bold text-gray-900">No Bulk Orders Yet</h3>
              <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
                Orders placed from the website with party packages or catering items will automatically populate here.
              </p>
            </div>
          ) : (
            <LiveOrdersTable
              orders={cateringOrders}
              title="Catering Bulk Orders"
              hideViewAll={true}
            />
          )}
        </div>
      )}
    </div>
  );
}
