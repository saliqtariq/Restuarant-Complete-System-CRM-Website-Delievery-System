"use client";

import { useCallback, useEffect, useState } from "react";
import { OrderRow } from "@/app/actions/dashboard";
import { updateOrderStatus, OrderStatus } from "@/app/actions/orders";
import { OrderDetailsModal } from "./OrderDetailsModal";
import { DriverDispatchModal } from "./DriverDispatchModal";
import { supabase } from "@/backend/supabase";

const STATUS_CONFIG: Record<
  string,
  { text: string; sub: string; dot: string; badge: string }
> = {
  pending:          { text: "Awaiting Confirm", sub: "Not sent to kitchen", dot: "bg-gray-400",   badge: "bg-gray-100 text-gray-600" },
  cooking:          { text: "Preparing",        sub: "In Kitchen",          dot: "bg-orange-500", badge: "bg-orange-100 text-orange-700" },
  ready:            { text: "Ready",            sub: "Food is done",        dot: "bg-green-500",  badge: "bg-green-100 text-green-700" },
  out_for_delivery: { text: "Out for Delivery", sub: "On the way",          dot: "bg-blue-500",   badge: "bg-blue-100 text-blue-700" },
  delivered:        { text: "Delivered",        sub: "Order complete",      dot: "bg-green-700",  badge: "bg-green-100 text-green-800" },
  cancelled:        { text: "Cancelled",        sub: "Order cancelled",     dot: "bg-red-500",    badge: "bg-red-100 text-red-700" },
};

function timeAgo(dateStr: string, now: Date) {
  const diff = Math.floor((now.getTime() - new Date(dateStr).getTime()) / 60000);
  if (diff < 1) return "Just now";
  if (diff < 60) return `${diff} mins ago`;
  const hrs = Math.floor(diff / 60);
  if (hrs < 24) return `${hrs} hrs ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// The next logical status for an action button
function getNextAction(status: string, orderType: string): { label: string; next: OrderStatus } | null {
  if (status === "ready" && orderType === "delivery") return { label: "Out for Delivery", next: "out_for_delivery" };
  if (status === "ready" && orderType === "pickup")   return { label: "Mark Picked Up",   next: "delivered" };
  if (status === "out_for_delivery")                  return { label: "Mark Delivered",   next: "delivered" };
  return null;
}

export function LiveOrdersTable({
  orders: initialOrders,
  title = "LIVE ORDERS",
  hideViewAll = false,
  realtimeEnabled = true, // Default to true for instant live updates across all dashboard views
  filterType,
}: {
  orders: OrderRow[];
  title?: string;
  hideViewAll?: boolean;
  realtimeEnabled?: boolean;
  filterType?: "pickup" | "delivery" | "all";
}) {
  const [orders, setOrders] = useState<OrderRow[]>(() =>
    filterType && filterType !== "all"
      ? initialOrders.filter((o) => o.order_type === filterType)
      : initialOrders
  );
  const [selectedOrder, setSelectedOrder] = useState<OrderRow | null>(null);
  const [orderToDispatch, setOrderToDispatch] = useState<OrderRow | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [now, setNow] = useState(new Date());

  // Sync with server re-renders (for the dashboard widget case)
  useEffect(() => {
    setOrders(
      filterType && filterType !== "all"
        ? initialOrders.filter((o) => o.order_type === filterType)
        : initialOrders
    );
  }, [initialOrders, filterType]);

  // Tick every minute for relative time strings
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  // Fetch fresh orders from the API
  const fetchOrders = useCallback(async () => {
    try {
      const url =
        filterType && filterType !== "all"
          ? `/api/dashboard/orders?type=${filterType}`
          : "/api/dashboard/orders";
      const res = await fetch(url, { cache: "no-store" });
      if (res.ok) {
        let data: OrderRow[] = await res.json();
        if (filterType && filterType !== "all") {
          data = data.filter((o) => o.order_type === filterType);
        }
        setOrders(data);
        // Also update the selected order if it's open
        setSelectedOrder((prev) => (prev ? data.find((o) => o.id === prev.id) ?? prev : null));
      }
    } catch {}
  }, [filterType]);

  // Realtime Supabase subscription + 3-second auto-poll fallback
  useEffect(() => {
    if (!realtimeEnabled) return;
    
    // Initial fetch
    fetchOrders();

    // 3-second auto-poll loop so status updates (e.g. KDS mark ready) show live without page refresh
    const pollInterval = setInterval(fetchOrders, 3000);

    const channel = supabase
      .channel("dashboard:orders")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => {
        fetchOrders();
      })
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [realtimeEnabled, fetchOrders]);

  // Optimistic status bump
  const handleStatusBump = async (order: OrderRow, next: OrderStatus) => {
    if (next === "out_for_delivery") {
      setOrderToDispatch(order);
      return;
    }

    setUpdatingId(order.id);
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === order.id ? { ...o, status: next } : o))
    );
    await updateOrderStatus(order.id, next);
    setUpdatingId(null);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1">
      <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
        <h3 className="font-bold text-gray-900 text-sm tracking-wide uppercase">{title}</h3>
        {!hideViewAll && (
          <a href="/dashboard/orders" className="text-[#E63946] text-xs font-bold hover:underline">
            View All Orders
          </a>
        )}
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
            {orders.map((order) => {
              const cfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
              const nextAction = getNextAction(order.status, order.order_type);
              const isUpdating = updatingId === order.id;

              return (
                <tr
                  key={order.id}
                  className="hover:bg-gray-50/50 transition-colors whitespace-nowrap"
                >
                  <td className="px-5 py-3.5 font-bold text-gray-900">{order.order_number}</td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-gray-900 text-[12px] truncate max-w-30">{order.customer_name}</div>
                    <div className="text-gray-400 text-[10px]">{order.phone}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${
                        order.order_type === "pickup"
                          ? "bg-orange-50 text-orange-600 border-orange-200"
                          : "bg-green-50 text-green-600 border-green-200"
                      }`}
                    >
                      {order.order_type}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="font-bold text-[11px] text-gray-900">Rs {order.grand_total}</div>
                    <div className="text-gray-400 text-[10px] uppercase">{order.payment_method}</div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot} ${order.status === "cooking" ? "animate-pulse" : ""}`} />
                      <span className="font-bold text-gray-900 text-[11px]">{cfg.text}</span>
                    </div>
                    <div className="text-gray-400 text-[10px] pl-3">{cfg.sub}</div>
                    {order.driver && order.order_type === "delivery" && order.status !== "delivered" && (
                      <div className="mt-1 pl-3 flex items-center gap-1 text-[10px] text-blue-600">
                        <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                        <span className="font-medium truncate max-w-20" title={order.driver.name}>{order.driver.name}</span>
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3.5 text-gray-400 font-medium" suppressHydrationWarning>
                    {timeAgo(order.created_at, now)}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1.5">
                      {/* Action button for status progression */}
                      {nextAction && (
                        <button
                          onClick={() => handleStatusBump(order, nextAction.next)}
                          disabled={isUpdating}
                          className={`text-[10px] font-bold px-2.5 py-1.5 rounded transition-colors whitespace-nowrap ${
                            nextAction.next === "out_for_delivery"
                              ? "bg-blue-600 hover:bg-blue-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          } disabled:opacity-50`}
                        >
                          {isUpdating ? "…" : nextAction.label}
                        </button>
                      )}
                      {/* View details */}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#E63946] border border-[#E63946]/40 hover:bg-red-50 font-bold px-3 py-1.5 rounded text-[10px] transition-colors whitespace-nowrap"
                      >
                        View
                      </button>
                      
                      {/* Re-dispatch / Resend WhatsApp */}
                      {order.status === "out_for_delivery" && order.order_type === "delivery" && (
                        <button
                          onClick={() => setOrderToDispatch(order)}
                          className="text-[#128C7E] border border-[#128C7E]/40 hover:bg-[#128C7E]/10 font-bold px-2 py-1.5 rounded transition-colors flex items-center justify-center whitespace-nowrap"
                          title="Resend WhatsApp or Reassign Driver"
                        >
                          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M9.5 13.5c1.5 1 3.5 1 5 0"/></svg>
                        </button>
                      )}
                    </div>
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

      {orderToDispatch && (
        <DriverDispatchModal
          isOpen={true}
          onClose={() => setOrderToDispatch(null)}
          order={orderToDispatch}
          onDispatchComplete={() => {
            // It was already handled by the server action
            setOrderToDispatch(null);
            fetchOrders();
          }}
        />
      )}
    </div>
  );
}
