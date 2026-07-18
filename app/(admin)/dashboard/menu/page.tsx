import { getMenuCategories, getMenuItems } from "@/app/actions/menu";
import { MenuManager } from "@/components/admin/widgets/MenuManager";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function MenuManagementPage() {
  const [categories, items] = await Promise.all([
    getMenuCategories(),
    getMenuItems(),
  ]);

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <p className="text-sm text-gray-500 mt-1">
          Add, edit, or remove menu categories and items. Changes reflect immediately on the website.
        </p>
      </div>

      <MenuManager initialCategories={categories} initialItems={items} />
    </div>
  );
}
