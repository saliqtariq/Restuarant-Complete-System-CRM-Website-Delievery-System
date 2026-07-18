import { ShoppingBag, Truck, ChefHat, CheckSquare } from "lucide-react";

export function OrderStatusWidget() {
  const statuses = [
    { label: "Pickup Orders", sub: "Waiting for customer", count: 15, icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Delivery Orders", sub: "Out for delivery", count: 32, icon: Truck, color: "text-green-500", bg: "bg-green-50" },
    { label: "Preparing in Kitchen", sub: "In progress", count: 9, icon: ChefHat, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Completed Orders", sub: "Delivered / Picked up", count: 71, icon: CheckSquare, color: "text-green-500", bg: "bg-green-50" },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">TODAY'S ORDER STATUS</h3>
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

export function PickupQueueWidget() {
  const queue = [
    { id: "#1045", name: "Ahmed Raza", status: "Ready for Pickup", dot: "bg-green-500", action: "Mark Picked Up", type: "primary" },
    { id: "#1048", name: "Usman Ali", status: "Ready for Pickup", dot: "bg-green-500", action: "Mark Picked Up", type: "primary" },
    { id: "#1051", name: "Faisal Khan", status: "Preparing", dot: "bg-orange-500", action: "Preparing", type: "secondary" },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">PICKUP QUEUE</h3>
        <button className="text-[#E63946] text-[10px] font-bold hover:underline">View All</button>
      </div>
      <div className="space-y-3">
        {queue.map((q, i) => (
          <div key={i} className="pb-3 border-b border-gray-50 last:border-0 last:pb-0">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-900 text-[12px]">{q.id}</span>
                <span className="font-semibold text-gray-700 text-[12px]">{q.name}</span>
                <span className="text-[9px] bg-green-100 text-green-700 font-bold px-1.5 py-0.5 rounded">PAID</span>
              </div>
              <button className={`text-[10px] font-bold px-2.5 py-1 rounded transition-colors ${
                q.type === "primary"
                  ? "border border-[#E63946] text-[#E63946] hover:bg-red-50"
                  : "border border-orange-300 text-orange-500 bg-orange-50"
              }`}>
                {q.action}
              </button>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-gray-500 pl-0.5">
              <span className={`w-1.5 h-1.5 rounded-full ${q.dot}`}></span>
              {q.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DeliveryDriversWidget() {
  const drivers = [
    { name: "Ali Khan", orders: "4 Active Orders", eta: "ETA 12 min", loc: "Johar Town", locGreen: false },
    { name: "Usman Javaid", orders: "3 Active Orders", eta: "ETA 18 min", loc: "DHA Phase 5", locGreen: true },
    { name: "Hamza Qureshi", orders: "2 Active Orders", eta: "ETA 25 min", loc: "Model Town", locGreen: true },
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-900 text-[11px] uppercase tracking-wider">DELIVERY DRIVERS</h3>
        <button className="text-[#E63946] text-[10px] font-bold hover:underline">View All</button>
      </div>
      <div className="space-y-4">
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

export function RightSidebarWidgets() {
  return (
    <div className="flex flex-col gap-4 w-full xl:w-[300px] shrink-0">
      <OrderStatusWidget />
      <PickupQueueWidget />
      <DeliveryDriversWidget />
    </div>
  );
}
