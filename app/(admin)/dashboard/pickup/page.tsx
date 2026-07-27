import { LiveOrdersTable } from "@/components/admin/widgets/LiveOrdersTable";
import { getOrders } from "@/app/actions/orders";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PickupOrdersPage() {
  const orders = await getOrders("pickup");

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Pickup Orders</h1>
      </div>
      
      <div className="w-full">
        <LiveOrdersTable orders={orders} filterType="pickup" />
      </div>
    </div>
  );
}
