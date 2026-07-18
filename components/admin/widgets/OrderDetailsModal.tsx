"use client";

import { useEffect, useState } from "react";
import { OrderRow } from "@/app/actions/dashboard";
import { getOrderItems, OrderItemRow, updateOrderStatus, OrderStatus } from "@/app/actions/orders";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRow | null;
};

export function OrderDetailsModal({ isOpen, onClose, order }: Props) {
  const [items, setItems] = useState<OrderItemRow[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && order) {
      setLoadingItems(true);
      getOrderItems(order.id)
        .then((data) => setItems(data))
        .catch((err) => console.error("Error fetching items:", err))
        .finally(() => setLoadingItems(false));
    }
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleUpdateStatus = async (newStatus: OrderStatus) => {
    setUpdating(true);
    await updateOrderStatus(order.id, newStatus);
    setUpdating(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Order {order.order_number}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Placed {new Date(order.created_at).toLocaleString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Details */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Customer Details
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Name:</span> <span className="font-medium text-gray-900">{order.customer_name}</span></p>
                <p><span className="text-gray-500">Phone:</span> <span className="font-medium text-gray-900">{order.phone}</span></p>
                {order.order_type === "delivery" && (
                  <>
                    <p><span className="text-gray-500">City:</span> <span className="font-medium text-gray-900">{order.city}</span></p>
                    <p><span className="text-gray-500">Address:</span> <span className="font-medium text-gray-900">{order.delivery_address}</span></p>
                  </>
                )}
              </div>
            </div>

            {/* Payment Details */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">
                Payment Info
              </h3>
              <div className="space-y-2 text-sm">
                <p><span className="text-gray-500">Method:</span> <span className="font-medium text-gray-900 uppercase">{order.payment_method}</span></p>
                <p>
                  <span className="text-gray-500">Subtotal:</span> <span className="font-medium text-gray-900">Rs {order.subtotal}</span>
                </p>
                <p>
                  <span className="text-gray-500">Delivery Fee:</span> <span className="font-medium text-gray-900">Rs {order.delivery_fee}</span>
                </p>
                <p>
                  <span className="text-gray-500">GST:</span> <span className="font-medium text-gray-900">Rs {order.gst}</span>
                </p>
                <div className="pt-2 mt-2 border-t border-gray-100">
                  <p className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">Total:</span> 
                    <span className="font-bold text-[#E63946] text-lg">Rs {order.grand_total}</span>
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Items */}
          <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <h3 className="text-sm font-bold text-gray-900 p-5 border-b border-gray-100 uppercase tracking-wide">
              Order Items
            </h3>
            {loadingItems ? (
              <div className="p-5 text-center text-gray-500 text-sm">Loading items...</div>
            ) : items.length === 0 ? (
              <div className="p-5 text-center text-gray-500 text-sm">No items found.</div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {items.map((item) => (
                  <li key={item.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.item_name} className="w-12 h-12 rounded-lg object-cover bg-gray-100" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                          <span className="text-gray-400 text-xs">No img</span>
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{item.item_name}</h4>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="font-bold text-gray-900 text-sm">
                      Rs {item.price}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border ${
              order.order_type === "pickup" 
                ? "bg-orange-50 text-orange-600 border-orange-200"
                : "bg-green-50 text-green-600 border-green-200"
            }`}>
              {order.order_type.toUpperCase()}
            </span>
            <span className="px-3 py-1 text-xs font-bold rounded-full border bg-gray-50 text-gray-600 border-gray-200 uppercase">
              {order.status.replace("_", " ")}
            </span>
          </div>

          <div className="flex gap-2">
            {order.status === "pending" && (
              <button 
                onClick={() => handleUpdateStatus("cooking")}
                disabled={updating}
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                Accept (Cooking)
              </button>
            )}
            {order.status === "cooking" && order.order_type === "pickup" && (
              <button 
                onClick={() => handleUpdateStatus("ready")}
                disabled={updating}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                Mark Ready
              </button>
            )}
            {order.status === "cooking" && order.order_type === "delivery" && (
              <button 
                onClick={() => handleUpdateStatus("out_for_delivery")}
                disabled={updating}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                Out for Delivery
              </button>
            )}
            {(order.status === "out_for_delivery" || order.status === "ready") && (
              <button 
                onClick={() => handleUpdateStatus("delivered")}
                disabled={updating}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                Complete Order
              </button>
            )}
            {order.status !== "delivered" && order.status !== "cancelled" && (
              <button 
                onClick={() => handleUpdateStatus("cancelled")}
                disabled={updating}
                className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 text-sm font-bold rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
