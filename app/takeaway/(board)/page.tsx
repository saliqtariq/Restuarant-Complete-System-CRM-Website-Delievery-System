import { menuData } from "@/lib/menu/data";
import { TakeawayPosClient } from "./TakeawayPosClient";

export const dynamic = "force-dynamic";

export default function TakeawayPage() {
  return <TakeawayPosClient menuCategories={menuData} />;
}
