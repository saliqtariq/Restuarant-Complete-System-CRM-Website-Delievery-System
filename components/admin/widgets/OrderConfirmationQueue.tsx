"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { ConfirmationOrderRow } from "@/app/actions/dashboard";
import { confirmOrder, rejectOrder } from "@/app/actions/orders";
import { supabase } from "@/backend/supabase";
import {
  Phone,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  ShoppingBag,
  Truck,
  AlertTriangle,
  ChefHat,
  X,
} from "lucide-react";

// ── Time helper ────────────────────────────────────────────────────────────────
function timeWaiting(createdAt: string) {
  const mins = Math.floor((Date.now() - new Date(createdAt).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ${mins % 60}m ago`;
}

// ── Rejection modal ────────────────────────────────────────────────────────────
function RejectModal({
  order,
  onClose,
  onConfirmReject,
}: {
  order: ConfirmationOrderRow;
  onClose: () => void;
  onConfirmReject: (reason: string) => void;
}) {
  const reasons = [
    "Customer not reachable",
    "Customer cancelled",
    "Fake / prank order",
    "Address not deliverable",
    "Item out of stock",
  ];
  const [selected, setSelected] = useState("");
  const [custom, setCustom] = useState("");

  const reason = selected === "custom" ? custom : selected;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <XCircle size={20} className="text-red-500" />
            <h3 className="font-bold text-gray-900">Reject Order #{order.order_number}</h3>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Select a reason before rejecting. This helps track cancellation patterns.
        </p>

        <div className="space-y-2 mb-4">
          {reasons.map((r) => (
            <label
              key={r}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
                selected === r
                  ? "border-red-400 bg-red-50 text-red-800"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="reason"
                value={r}
                checked={selected === r}
                onChange={() => setSelected(r)}
                className="accent-red-500"
              />
              <span className="text-sm font-medium">{r}</span>
            </label>
          ))}
          <label
            className={`flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer transition-all ${
              selected === "custom"
                ? "border-red-400 bg-red-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="reason"
              value="custom"
              checked={selected === "custom"}
              onChange={() => setSelected("custom")}
              className="accent-red-500"
            />
            <span className="text-sm font-medium text-gray-600">Other reason…</span>
          </label>
          {selected === "custom" && (
            <input
              autoFocus
              type="text"
              value={custom}
              onChange={(e) => setCustom(e.target.value)}
              placeholder="Type reason…"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
            />
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirmReject(reason)}
            disabled={!reason}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white text-sm font-bold transition-colors"
          >
            Reject Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Order Card ─────────────────────────────────────────────────────────────────
function ConfirmationCard({
  order,
  isRemoving,
  onConfirm,
  onReject,
}: {
  order: ConfirmationOrderRow;
  isRemoving: boolean;
  onConfirm: (id: string) => void;
  onReject: (order: ConfirmationOrderRow) => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [now, setNow] = useState(new Date());
  const waitMins = Math.floor((now.getTime() - new Date(order.created_at).getTime()) / 60000);
  const isUrgent = waitMins >= 5;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(id);
  }, []);

  return (
    <div
      className={`
        bg-white rounded-[20px] border shadow-sm hover:shadow-md overflow-hidden
        transition-all duration-500 ease-in-out flex flex-col
        ${isRemoving ? "opacity-0 scale-90 max-h-0 my-0 py-0" : "opacity-100 scale-100 max-h-250"}
        ${isUrgent ? "border-red-200 shadow-red-50" : "border-gray-100"}
      `}
    >
      {/* Top bar */}
      <div
        className={`flex items-center justify-between px-5 py-3.5 ${
          isUrgent ? "bg-red-50/50" : "bg-gray-50/50"
        } border-b ${isUrgent ? "border-red-100" : "border-gray-100"}`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              order.order_type === "pickup"
                ? "bg-orange-100 text-orange-600"
                : "bg-blue-100 text-blue-600"
            }`}
          >
            {order.order_type === "pickup" ? (
              <ShoppingBag size={16} strokeWidth={2.5} />
            ) : (
              <Truck size={16} strokeWidth={2.5} />
            )}
          </div>
          <div>
            <span className="font-extrabold text-gray-900 text-[15px] tracking-tight">
              #{order.order_number}
            </span>
            <span
              className={`ml-2 text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wider ${
                order.order_type === "pickup"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-blue-100 text-blue-700"
              }`}
            >
              {order.order_type}
            </span>
          </div>
        </div>
        <div
          className={`flex items-center gap-1.5 text-xs font-bold ${
            isUrgent ? "text-red-500" : "text-gray-400"
          }`}
        >
          {isUrgent && <AlertTriangle size={14} className="animate-pulse" />}
          <Clock size={14} />
          <span suppressHydrationWarning>{timeWaiting(order.created_at)}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        {/* Customer info */}
        <div className="mb-5 pb-5 border-b border-gray-100">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">
                Customer
              </p>
              <p className="font-bold text-gray-900 text-[17px] leading-none">{order.customer_name}</p>
              {order.order_type === "delivery" && order.delivery_address && (
                <div className="flex items-start gap-1 mt-2 text-[13px] text-gray-500 font-medium">
                  <MapPin size={14} className="mt-0.5 shrink-0 text-gray-400" />
                  <span className="leading-tight">{order.delivery_address}, {order.city}</span>
                </div>
              )}
            </div>
            <a
              href={`tel:${order.phone}`}
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 rounded-lg text-sm font-bold transition-colors"
            >
              <Phone size={14} strokeWidth={2.5} />
              {order.phone}
            </a>
          </div>
        </div>

        {/* Items */}
        <div className="mb-6 flex-1">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">
            Order
          </p>
          <div className="space-y-2.5">
            {order.order_items?.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-red-50 text-red-600 flex items-center justify-center text-xs font-black shrink-0">
                  {item.quantity}
                </span>
                <span className="text-[14px] font-bold text-gray-800 leading-tight">{item.item_name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Total + payment */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Total</p>
            <div className="font-black text-gray-900 text-xl leading-none">
              Rs {Number(order.grand_total).toLocaleString()}
            </div>
          </div>
          <div className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2.5 py-1 rounded-md uppercase tracking-wider">
            {order.payment_method?.toUpperCase()}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-auto">
          <button
            onClick={() => {
              startTransition(() => onReject(order));
            }}
            disabled={isPending}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-[14px] bg-white border-2 border-red-100 text-red-500 hover:bg-red-50 hover:border-red-200 hover:text-red-600 font-bold text-sm transition-all disabled:opacity-50"
          >
            <XCircle size={18} strokeWidth={2.5} />
            Reject
          </button>
          <button
            onClick={() => {
              startTransition(() => onConfirm(order.id));
            }}
            disabled={isPending}
            className="flex-[1.5] flex items-center justify-center gap-2 py-3 rounded-[14px] bg-[#E63946] hover:bg-[#D62839] text-white font-bold text-sm transition-all disabled:opacity-50 shadow-md shadow-red-200"
          >
            <ChefHat size={18} strokeWidth={2.5} />
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────────────────────────
export function OrderConfirmationQueue({
  initialOrders,
}: {
  initialOrders: ConfirmationOrderRow[];
}) {
  const router = useRouter();
  const audioRef = useRef<AudioContext | null>(null);
  const prevCountRef = useRef(initialOrders.length);

  const [orders, setOrders] = useState(initialOrders);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
  const [rejectTarget, setRejectTarget] = useState<ConfirmationOrderRow | null>(null);

  // Sync with server re-renders
  useEffect(() => {
    // Play alert sound when a NEW order arrives
    if (initialOrders.length > prevCountRef.current) {
      playAlert();
    }
    prevCountRef.current = initialOrders.length;
    setOrders(initialOrders);
  }, [initialOrders]);

  // Supabase realtime — refresh when orders table changes
  useEffect(() => {
    const channel = supabase
      .channel("confirmation:orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        () => {
          router.refresh();
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "orders" },
        () => {
          router.refresh();
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [router]);

  // Synthesised alert beep — no external file needed
  const playAlert = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const playBeep = (time: number, freq: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.35, time);
        gain.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
        osc.start(time);
        osc.stop(time + 0.4);
      };
      playBeep(ctx.currentTime, 880);
      playBeep(ctx.currentTime + 0.2, 1100);
      playBeep(ctx.currentTime + 0.4, 880);
    } catch {}
  };

  const removeWithAnimation = (orderId: string, callback: () => void) => {
    setRemovingIds((s) => new Set(s).add(orderId));
    setTimeout(() => {
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
      setRemovingIds((s) => { const n = new Set(s); n.delete(orderId); return n; });
      callback();
    }, 500);
  };

  const handleConfirm = (orderId: string) => {
    removeWithAnimation(orderId, async () => {
      await confirmOrder(orderId);
    });
  };

  const handleRejectClick = (order: ConfirmationOrderRow) => {
    setRejectTarget(order);
  };

  const handleRejectConfirm = (reason: string) => {
    if (!rejectTarget) return;
    const id = rejectTarget.id;
    setRejectTarget(null);
    removeWithAnimation(id, async () => {
      await rejectOrder(id, reason);
    });
  };

  if (orders.length === 0) return null;

  return (
    <>
      {rejectTarget && (
        <RejectModal
          order={rejectTarget}
          onClose={() => setRejectTarget(null)}
          onConfirmReject={handleRejectConfirm}
        />
      )}

      <div className="mb-8">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-5">
          <div className="flex items-center gap-2 px-4 py-1.5 bg-[#E63946] rounded-xl shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-ping absolute" />
            <span className="w-2 h-2 rounded-full bg-white relative" />
            <span className="font-black text-white text-[11px] uppercase tracking-widest mt-px">
              {orders.length} Order{orders.length > 1 ? "s" : ""} Awaiting Confirmation
            </span>
          </div>
          <p className="text-[12px] text-gray-400 font-medium">
            Call and verify before sending to kitchen
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {orders.map((order) => (
            <ConfirmationCard
              key={order.id}
              order={order}
              isRemoving={removingIds.has(order.id)}
              onConfirm={handleConfirm}
              onReject={handleRejectClick}
            />
          ))}
        </div>
      </div>
    </>
  );
}
