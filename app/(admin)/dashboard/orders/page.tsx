import { LiveOrdersTable } from "@/components/admin/widgets/LiveOrdersTable";
import { getOrders } from "@/app/actions/orders";
import { OrderRow } from "@/app/actions/dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function OrdersPage() {
  const allOrders = await getOrders("all");

  // Helper to format date strings consistently
  const getGroupKey = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isToday = date.toDateString() === today.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();

    if (isToday) return "Today";
    if (isYesterday) return "Yesterday";
    
    // For older dates, e.g. "July 16, 2026"
    return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  };

  // Group orders
  const groupedOrders: Record<string, OrderRow[]> = {};
  allOrders.forEach(order => {
    const key = getGroupKey(order.created_at);
    if (!groupedOrders[key]) {
      groupedOrders[key] = [];
    }
    groupedOrders[key].push(order);
  });

  // Sort groups: Today first, Yesterday second, then by date descending
  const sortedKeys = Object.keys(groupedOrders).sort((a, b) => {
    if (a === "Today") return -1;
    if (b === "Today") return 1;
    if (a === "Yesterday") return -1;
    if (b === "Yesterday") return 1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">All Orders</h1>
      </div>
      
      <div className="flex flex-col gap-8 w-full">
        {sortedKeys.length === 0 ? (
          <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center text-gray-500">
            No orders found.
          </div>
        ) : (
          sortedKeys.map((key) => (
            <LiveOrdersTable 
              key={key} 
              orders={groupedOrders[key]} 
              title={key} 
              hideViewAll={true} 
              realtimeEnabled={key === "Today"}
            />
          ))
        )}
      </div>
    </div>
  );
}
