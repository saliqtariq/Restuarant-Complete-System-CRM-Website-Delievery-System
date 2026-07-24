import { getCustomers } from "@/app/actions/customers";
import { CustomersTable } from "@/components/admin/widgets/CustomersTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CustomersPage() {
  const customers = await getCustomers();

  return (
    <div className="flex flex-col gap-6 pb-12">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
          <p className="text-sm text-gray-500 mt-1">
            View and manage your registered customers.
          </p>
        </div>
      </div>
      
      <div className="w-full">
        <CustomersTable initialCustomers={customers} />
      </div>
    </div>
  );
}
