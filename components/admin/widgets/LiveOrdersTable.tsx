"use client";

import { useState } from "react";
import { OrderRow } from "@/app/actions/dashboard";
import { OrderDetailsModal } from "./OrderDetailsModal";

export function LiveOrdersTable({ orders }: { orders: OrderRow[] }) {
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);

  const getStatusDisplay = (status: string, orderType: string) => {
    switch (status) {
      case "pending":
        return { text: "Pending", sub: "Waiting for confirmation", color: "bg-gray-400" };
      case "cooking":
        return { text: "Preparing", sub: "In Kitchen", color: "bg-orange-500" };
      case "ready":
        return { text: "Ready for Pickup", sub: "Customer can arrive", color: "bg-green-500" };
      case "out_for_delivery":
        return { text: "Out for Delivery", sub: "On the way", color: "bg-blue-500" };
      case "delivered":
        return { text: "Completed", sub: orderType === "pickup" ? "Picked up" : "Delivered", color: "bg-green-700" };
      case "cancelled":
        return { text: "Cancelled", sub: "Order cancelled", color: "bg-red-500" };
      default:
        return { text: status, sub: "", color: "bg-gray-400" };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm tracking-wide">LIVE ORDERS</h3>
        <button className="text-[#E63946] text-xs font-bold hover:underline">View All Orders</button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left">
          <thead>
            <tr className="text-gray-400 uppercase text-[10px] font-bold bg-gray-50/70">
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Type</th>
              <th className="px-5 py-3">Payment</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Time</th>
              <th className="px-5 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.map((order, i) => {
              const statusDisplay = getStatusDisplay(order.status, order.order_type);
              
              // Calculate time elapsed
              const createdDate = new Date(order.created_at);
              const now = new Date();
              const diffMins = Math.floor((now.getTime() - createdDate.getTime()) / 60000);
              const timeString = diffMins < 60 ? `${diffMins} mins ago` : `${Math.floor(diffMins/60)} hrs ago`;

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
                    <div className={`font-bold text-[11px] text-gray-900`}>
                      Rs {order.grand_total}
                    </div>
                    <div className="text-gray-400 text-[10px] uppercase">{order.payment_method}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDisplay.color}`}></span>
                      <span className="font-bold text-gray-900 text-[11px]">{statusDisplay.text}</span>
                    </div>
                    <div className="text-gray-400 text-[10px] pl-3">{statusDisplay.sub}</div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 font-medium">{timeString}</td>
                  <td className="px-5 py-3.5 text-center">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="text-[#E63946] border border-[#E63946]/40 hover:bg-red-50 font-bold px-3 py-1 rounded text-[10px] transition-colors"
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedOrder && (
        <OrderDetailsModal 
          isOpen={true} 
          onClose={() => setSelectedOrder(null)} 
          order={selectedOrder} 
        />
      )}
    </div>
  );
}
