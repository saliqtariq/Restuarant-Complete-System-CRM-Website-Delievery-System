import { getKdsOrders } from "@/app/actions/kds";
import { KdsClient } from "./KdsClient";

export default async function KdsPage() {
  const initialOrders = await getKdsOrders();
  return <KdsClient initialOrders={initialOrders} />;
}
