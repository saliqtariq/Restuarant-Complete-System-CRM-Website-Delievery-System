"use client";

import { useState } from "react";
import { CouponRow, createCoupon, toggleCouponStatus, deleteCoupon } from "@/app/actions/coupons";
import { Tag, Plus, Trash2, Power } from "lucide-react";

export function CouponsManager({ initialCoupons }: { initialCoupons: CouponRow[] }) {
  const [coupons, setCoupons] = useState(initialCoupons);
  const [isAdding, setIsAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discount_type: "percentage",
    discount_amount: "",
    min_order_amount: "",
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const result = await createCoupon({
      code: formData.code.toUpperCase(),
      discount_type: formData.discount_type as "percentage" | "fixed",
      discount_amount: Number(formData.discount_amount),
      min_order_amount: Number(formData.min_order_amount) || 0,
      is_active: true,
      expiry_date: null,
    });

    if (result.success) {
      setIsAdding(false);
      setFormData({ code: "", discount_type: "percentage", discount_amount: "", min_order_amount: "" });
      // Reload page to get fresh data
      window.location.reload();
    } else {
      alert("Failed to create coupon: " + result.error);
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const result = await toggleCouponStatus(id, !currentStatus);
    if (result.success) {
      setCoupons(coupons.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    } else {
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this coupon?")) return;
    
    const result = await deleteCoupon(id);
    if (result.success) {
      setCoupons(coupons.filter(c => c.id !== id));
    } else {
      alert("Failed to delete coupon");
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end">
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-[#E63946] hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus size={16} />
          Add New Coupon
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Tag size={18} className="text-[#E63946]"/> Create New Coupon
          </h3>
          <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Coupon Code</label>
              <input
                type="text"
                required
                placeholder="e.g. SUMMER20"
                value={formData.code}
                onChange={e => setFormData({ ...formData, code: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Discount Type</label>
              <select
                value={formData.discount_type}
                onChange={e => setFormData({ ...formData, discount_type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (Rs)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Amount</label>
              <input
                type="number"
                required
                min="1"
                placeholder={formData.discount_type === 'percentage' ? 'e.g. 20' : 'e.g. 500'}
                value={formData.discount_amount}
                onChange={e => setFormData({ ...formData, discount_amount: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Min Order Amount (Rs)</label>
              <input
                type="number"
                min="0"
                placeholder="0 for no minimum"
                value={formData.min_order_amount}
                onChange={e => setFormData({ ...formData, min_order_amount: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E63946]"
              />
            </div>
            <div className="lg:col-span-4 flex justify-end gap-3 mt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 text-sm font-bold text-gray-500 hover:text-gray-700"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#E63946] hover:bg-red-600 text-white text-sm font-bold py-2 px-6 rounded-lg disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Coupon"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50/70 border-b border-gray-100 text-xs uppercase text-gray-500 font-bold">
            <tr>
              <th className="px-6 py-4">Code</th>
              <th className="px-6 py-4">Discount</th>
              <th className="px-6 py-4">Min Order</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {coupons.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  No coupons created yet.
                </td>
              </tr>
            ) : (
              coupons.map((coupon) => (
                <tr key={coupon.id} className="hover:bg-gray-50/50">
                  <td className="px-6 py-4">
                    <span className="font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                      {coupon.code}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-[#E63946]">
                    {coupon.discount_type === 'percentage' 
                      ? `${coupon.discount_amount}% OFF` 
                      : `Rs ${coupon.discount_amount} OFF`}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {coupon.min_order_amount > 0 ? `Rs ${coupon.min_order_amount}` : 'None'}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                      coupon.is_active ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}>
                      {coupon.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleToggle(coupon.id, coupon.is_active)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          coupon.is_active ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                        title={coupon.is_active ? "Deactivate" : "Activate"}
                      >
                        <Power size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(coupon.id)}
                        className="p-1.5 bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
