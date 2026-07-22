import { ShoppingBag, Truck, ChefHat, CheckSquare } from "lucide-react";
import type { OrderStatusCounts, PickupQueueItem } from "@/app/actions/dashboard";

export function OrderStatusWidget({ counts }: { counts: OrderStatusCounts }) {
  const statuses = [
    { label: "Pickup Orders", sub: "Waiting for customer", count: counts.pickup, icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Delivery Orders", sub: "Out for delivery", count: counts.delivery, icon: Truck, color: "text-green-500", bg: "bg-green-50" },
    { label: "Preparing in Kitchen", sub: "In progress", count: counts.preparing, icon: ChefHat, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Completed Orders", sub: "Delivered / Picked up", count: counts.completed, icon: CheckSquare, color: "text-green-500", bg: "bg-green-50" },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">TODAY&apos;S ORDER STATUS</h3>
        <button className="text-[#E63946] text-[10px] font-bold hover:underline">View Report</button>
      </div>
      <div className="space-y-4">
        {statuses.map((s, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${s.bg} flex-shrink-0`}>
                <s.icon className={`w-4 h-4 ${s.color}`} />
              </div>
              <div>
                <div className="font-bold text-[12px] text-gray-900">{s.label}</div>
                <div className="text-[10px] text-gray-400">{s.sub}</div>
              </div>
            </div>
            <div className={`font-bold text-base ${s.color}`}>{s.count}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PickupQueueWidget({ queue }: { queue: PickupQueueItem[] }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">PICKUP QUEUE</h3>
        <button className="text-[#E63946] text-[10px] font-bold hover:underline">View All</button>
      </div>
      {queue.length === 0 ? (
        <div className="text-xs text-gray-500 text-center py-4 font-medium">No pending pickups</div>
      ) : (
        <div className="space-y-3">
          {queue.map((q, i) => (
            <div key={i} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 text-[12px]">{q.order_number}</span>
                  <span className="font-semibold text-gray-700 text-[12px] max-w-[80px] truncate">{q.customer_name}</span>
                  {q.payment_method !== "cod" && (
                    <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded">PAID</span>
                  )}
                </div>
                <button className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                  q.status === "ready"
                    ? "border border-[#E63946] text-[#E63946] hover:bg-red-50"
                    : "border border-orange-300 text-orange-500 bg-orange-50"
                }`}>
                  {q.status === "ready" ? "Mark Picked Up" : "Preparing"}
                </button>
              </div>
              <div className="flex items-center gap-1.5 text-[10px] text-gray-500 pl-0.5 uppercase font-medium">
                <span className={`w-1.5 h-1.5 rounded-full ${q.status === "ready" ? "bg-green-500" : "bg-orange-500"}`}></span>
                {q.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DeliveryDriversWidget() {
  const drivers = [
    { name: "Ali Khan", orders: "0 Active Orders", eta: "Offline", loc: "-", locGreen: false },
    { name: "Usman Javaid", orders: "0 Active Orders", eta: "Offline", loc: "-", locGreen: false },
    { name: "Hamza Qureshi", orders: "0 Active Orders", eta: "Offline", loc: "-", locGreen: false },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">DELIVERY DRIVERS</h3>
        <button className="text-[#E63946] text-[10px] font-bold hover:underline">View All</button>
      </div>
      <div className="space-y-4 opacity-50">
        {drivers.map((d, i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-200 rounded-full flex items-center justify-center text-[11px] font-bold text-gray-600 flex-shrink-0">
                {d.name.split(" ").map((n) => n[0]).join("")}
              </div>
              <div>
                <div className="font-bold text-[12px] text-gray-900">{d.name}</div>
                <div className="text-[10px] text-gray-400">{d.orders}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-[10px] text-gray-500 font-medium">{d.eta}</div>
              <div className={`text-[10px] font-bold ${d.locGreen ? "text-green-500" : "text-gray-500"}`}>{d.loc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function RightSidebarWidgets({ statusCounts, pickupQueue }: { statusCounts: OrderStatusCounts; pickupQueue: PickupQueueItem[] }) {
  return (
    <div className="flex flex-col gap-4 w-full xl:w-[300px] shrink-0">
      <OrderStatusWidget counts={statusCounts} />
      <PickupQueueWidget queue={pickupQueue} />
      <DeliveryDriversWidget />
    </div>
  );
}
