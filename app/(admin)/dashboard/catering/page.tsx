import { getCateringOrders, getCateringRequests } from "@/app/actions/catering";
import { CateringView } from "@/components/admin/widgets/CateringView";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CateringDashboardPage() {
  const [cateringOrders, cateringRequests] = await Promise.all([
    getCateringOrders(),
    getCateringRequests(),
  ]);

  return <CateringView cateringOrders={cateringOrders} cateringRequests={cateringRequests} />;
}
