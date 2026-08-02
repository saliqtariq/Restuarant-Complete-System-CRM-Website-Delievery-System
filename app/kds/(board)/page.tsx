import { getKdsOrders } from "@/app/actions/kds";
import { KdsClient } from "./KdsClient";

export const dynamic = "force-dynamic";

export default async function KdsPage() {
  const initialOrders = await getKdsOrders();
  return <KdsClient initialOrders={initialOrders} />;
}
