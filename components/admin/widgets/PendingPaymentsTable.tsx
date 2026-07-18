"use client";

import { useState } from "react";
import { OrderRow } from "@/app/actions/dashboard";
import { updatePaymentStatus } from "@/app/actions/orders";

export function PendingPaymentsTable({ orders }: { orders: OrderRow[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAction = async (orderId: string, action: "approved" | "rejected") => {
    setLoadingId(orderId);
    await updatePaymentStatus(orderId, action);
    setLoadingId(null);
  };

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center flex-1">
        <h3 className="text-gray-500 font-medium">No pending payments to approve.</h3>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm tracking-wide">PENDING PAYMENTS</h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-gray-400 uppercase text-[10px] font-bold bg-gray-50/70">
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Payment Info</th>
              <th className="px-5 py-3">Amount</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order) => {
              return (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5 font-bold text-gray-900">{order.order_number}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-gray-900 text-[12px]">{order.customer_name}</div>
                    <div className="text-gray-400 text-[10px]">{order.phone}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${
                      order.order_type === "pickup"
                        ? "bg-orange-50 text-orange-600 border-orange-200"
                        : "bg-green-50 text-green-600 border-green-200"
                    }`}>
                      {order.order_type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-gray-900 text-[11px] uppercase">
                      {order.payment_method}
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-gray-900 text-[12px]">
                      Rs {order.grand_total}
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleAction(order.id, "approved")}
                        disabled={loadingId === order.id}
                        className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded text-[10px] transition-colors disabled:opacity-50"
                      >
                        {loadingId === order.id ? "Processing..." : "Approve"}
                      </button>
                      <button
                        onClick={() => handleAction(order.id, "rejected")}
                        disabled={loadingId === order.id}
                        className="bg-red-100 text-red-600 hover:bg-red-200 font-bold px-3 py-1.5 rounded text-[10px] transition-colors disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
