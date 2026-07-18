import { getCoupons } from "@/app/actions/coupons";
import { CouponsManager } from "@/components/admin/widgets/CouponsManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CouponsPage() {
  const coupons = await getCoupons();

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coupons & Offers</h1>
          <p className="text-sm text-gray-500 mt-1">
            Create and manage discount codes for your customers.
          </p>
        </div>
      </div>
      
      <div className="w-full">
        <CouponsManager initialCoupons={coupons} />
      </div>
    </div>
  );
}
