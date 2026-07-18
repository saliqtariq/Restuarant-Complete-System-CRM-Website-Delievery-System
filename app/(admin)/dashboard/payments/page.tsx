import { getPendingPayments } from "@/app/actions/orders";
import { PendingPaymentsTable } from "@/components/admin/widgets/PendingPaymentsTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PaymentsPage() {
  const orders = await getPendingPayments();

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-sm text-gray-500 mt-1">
            Approve online payments (Easypaisa, Jazzcash, Card) before they go to the kitchen.
          </p>
        </div>
      </div>
      
      <div className="w-full">
        <PendingPaymentsTable orders={orders} />
      </div>
    </div>
  );
}
