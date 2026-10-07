"use client";

import { useState, useTransition, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  MenuCategoryData,
  MenuItem,
} from "@/lib/menu/data";
import {
  TakeawayCartItem,
  TakeawayPaymentMethod,
  RecentTakeawayOrder,
  createTakeawayOrder,
  getRecentTakeawayOrders,
  logoutTakeaway,
} from "@/app/actions/takeaway";
import {
  Plus,
  Minus,
  Trash2,
  LogOut,
  Search,
  RefreshCw,
  Maximize,
  Minimize,
  Printer,
  CreditCard,
  Banknote,
  CheckCircle2,
  X,
  AlertCircle,
  History,
  MessageSquare,
} from "lucide-react";

interface TakeawayPosClientProps {
  menuCategories: MenuCategoryData[];
}

// ── Types ────────────────────────────────────────────────────────────────────

type ReceiptData = {
  orderNumber: string;
  items: TakeawayCartItem[];
  subtotal: number;
  gst: number;
  grandTotal: number;
  paymentMethod: TakeawayPaymentMethod;
  amountTendered?: number;
  change?: number;
  timestamp: string;
};

function parseItemPrice(price: string): number {
  return parseFloat(price.replace(/[^0-9.]/g, "")) || 0;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatRS(amount: number) {
  return `RS ${Math.round(amount).toLocaleString("en-PK")}`;
}

function nowString() {
  return new Date().toLocaleString("en-PK", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// ── Cash Change Modal ─────────────────────────────────────────────────────────

function CashChangeModal({
  grandTotal,
  onConfirm,
  onCancel,
}: {
  grandTotal: number;
  onConfirm: (tendered: number) => void;
  onCancel: () => void;
}) {
  const [tendered, setTendered] = useState<string>("");

  const tenderedNum = parseFloat(tendered) || 0;
  const exact = Math.round(grandTotal);
  const change = tenderedNum - exact;
  const isValid = tenderedNum >= exact;

  // Numpad press handler
  function handleKey(key: string) {
    if (key === "C") {
      setTendered("");
    } else if (key === "⌫") {
      setTendered((prev) => prev.slice(0, -1));
    } else {
      setTendered((prev) => {
        const next = prev + key;
        // Prevent leading zeros
        if (next.length > 1 && next.startsWith("0")) return prev;
        return next;
      });
    }
  }

  // Physical keyboard support
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key >= "0" && e.key <= "9") {
        e.preventDefault();
        handleKey(e.key);
      } else if (e.key === "Backspace") {
        e.preventDefault();
        handleKey("⌫");
      } else if (e.key === "Escape") {
        e.preventDefault();
        onCancel();
      } else if (e.key === "Enter" && isValid) {
        e.preventDefault();
        onConfirm(tenderedNum);
      } else if (e.key === "Delete") {
        e.preventDefault();
        handleKey("C");
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValid, tenderedNum]);

  // Quick preset buttons — round up to next 100/500/1000
  const presets = [
    Math.ceil(grandTotal / 100) * 100,
    Math.ceil(grandTotal / 500) * 500,
    Math.ceil(grandTotal / 1000) * 1000,
  ].filter((v, i, arr) => v > exact && arr.indexOf(v) === i).slice(0, 3);

  const numpadKeys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "C", "0", "⌫"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150" style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}>
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-[340px] mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between border-b border-slate-100">
          <div>
            <h2 className="font-extrabold text-slate-900 text-sm">Cash Payment</h2>
            <p className="text-slate-400 text-[11px]">Tap numbers to enter amount received</p>
          </div>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-2">
          {/* Total Due + Change display */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2">
              <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider mb-0.5">Total Due</p>
              <p className="text-slate-900 font-extrabold text-base tracking-tight">Rs {Math.round(grandTotal).toLocaleString("en-PK")}</p>
            </div>
            <div className={`border rounded-lg px-3 py-2 transition-colors ${tenderedNum === 0 ? "bg-slate-50 border-slate-200"
              : isValid ? "bg-green-50 border-green-200"
                : "bg-red-50 border-red-200"
              }`}>
              <p className={`text-[9px] font-bold uppercase tracking-wider mb-0.5 ${tenderedNum === 0 ? "text-slate-400" : isValid ? "text-green-600" : "text-red-500"}`}>
                {tenderedNum === 0 ? "Change" : isValid ? "Change" : "Short"}
              </p>
              <p className={`font-extrabold text-base tracking-tight ${tenderedNum === 0 ? "text-slate-300" : isValid ? "text-green-700" : "text-red-600"}`}>
                {tenderedNum === 0
                  ? "—"
                  : isValid
                    ? `Rs ${Math.round(change).toLocaleString("en-PK")}`
                    : `Rs ${Math.round(Math.abs(change)).toLocaleString("en-PK")}`}
              </p>
            </div>
          </div>

          {/* Tendered display */}
          <div className={`rounded-lg border-2 px-3 py-2 flex items-center gap-2 transition-colors ${isValid && tenderedNum > 0 ? "border-green-400 bg-green-50" : "border-indigo-300 bg-white"
            }`}>
            <span className="text-slate-400 font-bold text-sm">Rs</span>
            <span className={`font-extrabold text-2xl tracking-tighter flex-1 ${tendered ? "text-slate-900" : "text-slate-300"}`}>
              {tendered ? parseInt(tendered).toLocaleString("en-PK") : "0"}
            </span>
            {isValid && tenderedNum > 0 && <span className="text-green-500 font-black text-base">✓</span>}
          </div>

          {/* Quick presets */}
          {presets.length > 0 && (
            <div className="flex gap-1.5">
              <button
                onClick={() => setTendered(String(exact))}
                className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-slate-700 font-bold text-[11px] transition-all"
              >
                Exact
              </button>
              {presets.map((p) => (
                <button
                  key={p}
                  onClick={() => setTendered(String(p))}
                  className="flex-1 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 border border-slate-200 hover:border-indigo-200 text-slate-700 font-bold text-[11px] transition-all"
                >
                  {p.toLocaleString("en-PK")}
                </button>
              ))}
            </div>
          )}

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-1.5">
            {numpadKeys.map((key) => (
              <button
                key={key}
                onClick={() => handleKey(key)}
                className={`h-10 rounded-lg font-extrabold text-base transition-all active:scale-95 select-none ${key === "C"
                  ? "bg-red-50 hover:bg-red-100 text-red-500 border border-red-200"
                  : key === "⌫"
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-600 border border-slate-200"
                    : "bg-slate-50 hover:bg-indigo-50 hover:text-indigo-700 text-slate-800 border border-slate-200 hover:border-indigo-200"
                  }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Confirm button */}
          <button
            onClick={() => isValid && onConfirm(tenderedNum)}
            disabled={!isValid}
            className={`w-full py-2.5 rounded-xl font-extrabold text-sm transition-all ${isValid
              ? "bg-green-500 hover:bg-green-400 text-white shadow-md shadow-green-200 active:scale-[0.98]"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
          >
            {isValid ? "✓ Confirm & Place Order" : "Enter Amount to Continue"}
          </button>
        </div>
      </div>
    </div>
  );
}


// ── Card Instruction Overlay ──────────────────────────────────────────────────

function CardInstructionOverlay({
  grandTotal,
  onConfirm,
  onCancel,
  isPending,
}: {
  grandTotal: number;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="bg-white/60 border-b border-slate-200/50 px-5 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-extrabold text-[#0B1528] tracking-tight">
              Debit Card Payment
            </h2>
            <p className="text-[#64748B] text-xs font-medium mt-0.5">
              Complete the payment using your debit card.
            </p>
          </div>
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-slate-600 transition p-1 rounded-lg hover:bg-slate-100/80"
            disabled={isPending}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {/* Amount */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 flex justify-between items-center shadow-inner">
            <span className="text-slate-500 text-sm">Amount to Charge</span>
            <span className="text-slate-900 font-extrabold text-xl">{formatRS(grandTotal)}</span>
          </div>

          {/* Steps */}
          <div className="space-y-2">
            {[
              "Enter the amount on the bank's card machine",
              "Ask customer to tap or insert their debit card",
              "Wait for the machine to display APPROVED",
              "Once approved, click confirm below",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-3 p-3 bg-white/50 border border-slate-200/60 rounded-xl">
                <span className="w-5 h-5 rounded-full bg-indigo-100 border border-indigo-200 text-indigo-600 text-[10px] font-black flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="text-slate-700 text-xs leading-relaxed">{step}</span>
              </div>
            ))}
          </div>

          {/* Warning */}
          <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <p className="text-amber-700 text-xs">Only confirm after the machine shows <strong>APPROVED</strong></p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={onCancel}
              disabled={isPending}
              className="flex-1 py-2.5 rounded-2xl bg-gray-100 border border-gray-200 text-gray-500 font-semibold text-base tracking-wide hover:bg-gray-200 transition-all duration-200 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isPending}
              className="flex-1 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-base tracking-wide transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-wait flex items-center justify-center gap-2"
            >
              {isPending ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Processing…</span>
                </>
              ) : (
                <span>Card Approved</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Receipt Modal ─────────────────────────────────────────────────────────────

function ReceiptModal({
  receipt,
  onClose,
}: {
  receipt: ReceiptData;
  onClose: () => void;
}) {
  const handlePrint = () => window.print();

  return (
    <>
      {/* ── Screen overlay (hidden during print) ── */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150 print:hidden">
        <div className="bg-white/90 backdrop-blur-xl border border-white/50 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="bg-green-50 border-b border-green-100 px-5 py-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              <div>
                <h2 className="font-extrabold text-green-800 text-sm">Order Placed!</h2>
                <p className="text-green-600/80 text-xs">Sent to kitchen • Token ID: {receipt.orderNumber}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-green-600/50 hover:text-green-700 transition">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Receipt content */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3 scrollbar-thin scrollbar-thumb-slate-300">
            {/* Store info */}
            <div className="text-center border-b border-dashed border-slate-200 pb-3">
              <p className="font-extrabold text-slate-800 text-base">Abraham's Table</p>
              <p className="text-slate-500 text-xs">Takeaway Receipt</p>
              <p className="text-slate-400 text-[11px] mt-0.5">{receipt.timestamp}</p>
              <p className="text-slate-800 font-extrabold text-sm mt-1 uppercase tracking-wide">
                Token ID: {receipt.orderNumber}
              </p>
            </div>

            {/* Items */}
            <div className="space-y-1.5">
              {receipt.items.map((item) => {
                const lineTotal = parseItemPrice(item.price) * item.quantity;
                return (
                  <div key={item.name} className="space-y-0.5">
                    <div className="flex justify-between text-xs text-slate-600">
                      <span className="flex-1 truncate pr-2">
                        {item.name} <span className="text-slate-400">×{item.quantity}</span>
                      </span>
                      <span className="font-bold text-slate-800 shrink-0">{formatRS(lineTotal)}</span>
                    </div>
                    {item.notes && (
                      <p className="text-[10px] text-amber-600 font-medium italic pl-1">
                        ↳ Note: {item.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Totals */}
            <div className="border-t border-dashed border-slate-200 pt-3 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-500">
                <span>Subtotal</span>
                <span className="text-slate-700">{formatRS(receipt.subtotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>GST (16%)</span>
                <span className="text-slate-700">{formatRS(receipt.gst)}</span>
              </div>
              <div className="flex justify-between font-extrabold text-sm text-slate-900 pt-1 border-t border-slate-200">
                <span>Total</span>
                <span className="text-slate-900">{formatRS(receipt.grandTotal)}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-500 pt-1">
                <span>Payment</span>
                <span className="text-slate-700 capitalize">
                  {receipt.paymentMethod === "card" ? "Debit Card" : "Cash"}
                </span>
              </div>
              {receipt.paymentMethod === "cash" && receipt.amountTendered !== undefined && (
                <>
                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Tendered</span>
                    <span className="text-slate-700">{formatRS(receipt.amountTendered)}</span>
                  </div>
                  <div className="flex justify-between text-xs font-bold text-slate-900">
                    <span>Change</span>
                    <span>{formatRS(receipt.change ?? 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Thank you */}
            <div className="text-center pt-2 text-black text-xs font-semibold">
              Thank you for your order!
            </div>
          </div>

          {/* Actions */}
          <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex gap-2 shrink-0 bg-slate-50">
            <button
              onClick={handlePrint}
              className="flex-1 py-3 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              <Printer className="w-4 h-4" />
              Print Receipt
            </button>
            <button
              onClick={onClose}
              className="flex-grow py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-sm transition-all active:scale-[0.98] shadow-lg shadow-indigo-200"
            >
              New Order
            </button>
          </div>
        </div>
      </div>

      {/* ── Print-only receipt (shown only when printing) ── */}
      <div className="receipt-print-only hidden print:block max-w-[320px] mx-auto p-4 bg-slate-50 [print-color-adjust:exact]">
        <div className="text-center mb-4">
          <p className="font-extrabold text-slate-800 text-xl">Abraham's Table</p>
          <p className="text-slate-500 text-sm mt-1">Takeaway Receipt</p>
          <p className="text-slate-400 text-xs mt-1">{receipt.timestamp}</p>
          <p className="text-slate-900 font-extrabold text-base mt-3 uppercase tracking-wide">
            Token ID: {receipt.orderNumber}
          </p>
        </div>

        <div className="border-t border-dashed border-slate-300 py-4 space-y-2">
          {receipt.items.map((item) => {
            const lineTotal = parseItemPrice(item.price) * item.quantity;
            return (
              <div key={item.name} className="space-y-0.5">
                <div className="flex justify-between text-sm text-slate-700">
                  <span className="flex-1 pr-2">
                    {item.name} <span className="text-slate-400">×{item.quantity}</span>
                  </span>
                  <span className="font-bold text-slate-900 shrink-0">{formatRS(lineTotal)}</span>
                </div>
                {item.notes && (
                  <p className="text-xs text-slate-500 italic pl-1">
                    * Note: {item.notes}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-dashed border-slate-300 pt-4 space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Subtotal</span>
            <span className="text-slate-700">{formatRS(receipt.subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-slate-500">
            <span>GST (16%)</span>
            <span className="text-slate-700">{formatRS(receipt.gst)}</span>
          </div>
        </div>

        <div className="border-t border-slate-200 mt-4 pt-3">
          <div className="flex justify-between font-extrabold text-lg text-slate-900">
            <span>Total</span>
            <span className="text-slate-900">{formatRS(receipt.grandTotal)}</span>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-sm text-slate-500">
            <span>Payment</span>
            <span className="text-slate-700">
              {receipt.paymentMethod === "card" ? "Debit Card" : "Cash"}
            </span>
          </div>
          {receipt.paymentMethod === "cash" && receipt.amountTendered !== undefined && (
            <>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Tendered</span>
                <span className="text-slate-700">{formatRS(receipt.amountTendered)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-slate-900">
                <span>Change</span>
                <span>{formatRS(receipt.change ?? 0)}</span>
              </div>
            </>
          )}
        </div>

        <div className="text-center mt-8 text-black text-xs font-bold">
          Thank you for your order!
        </div>
      </div>
    </>
  );
}

// ── Item Note Modal ──────────────────────────────────────────────────────────

function ItemNoteModal({
  item,
  initialNote,
  onSave,
  onClose,
}: {
  item: { name: string };
  initialNote: string;
  onSave: (note: string) => void;
  onClose: () => void;
}) {
  const [note, setNote] = useState(initialNote);
  const inputRef = useRef<HTMLInputElement>(null);

  const presets = [
    "No Mayo",
    "Extra Spicy",
    "No Onion",
    "Extra Sauce",
    "Crispy Well-Done",
    "No Pickle",
    "No Ice",
    "Separate Bag",
  ];

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm">Special Kitchen Note</h3>
            <p className="text-slate-400 text-xs mt-0.5 truncate max-w-[260px]">{item.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Quick Suggestions
            </label>
            <div className="flex flex-wrap gap-1.5">
              {presets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setNote((prev) => (prev ? `${prev}, ${preset}` : preset))}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 text-xs font-semibold border border-slate-200 transition-all active:scale-95"
                >
                  +{preset}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">
              Custom Instruction
            </label>
            <input
              ref={inputRef}
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  onSave(note.trim());
                }
              }}
              placeholder="e.g. Less oil, extra napkin"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-all"
            />
          </div>

          <div className="flex gap-2 pt-1">
            {note && (
              <button
                type="button"
                onClick={() => {
                  setNote("");
                  onSave("");
                }}
                className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 text-xs font-bold transition-all"
              >
                Clear Note
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => onSave(note.trim())}
              className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-200 transition-all active:scale-95"
            >
              Save Note
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Recent Orders Modal ───────────────────────────────────────────────────────

function RecentOrdersModal({
  onClose,
  onReprint,
}: {
  onClose: () => void;
  onReprint: (order: RecentTakeawayOrder) => void;
}) {
  const [orders, setOrders] = useState<RecentTakeawayOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getRecentTakeawayOrders()
      .then((data) => {
        if (active) {
          setOrders(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-white border border-slate-200 rounded-2xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/50">
          <div>
            <h2 className="font-extrabold text-slate-900 text-base">Recent Takeaway Orders</h2>
            <p className="text-slate-400 text-xs">Review past orders or re-print customer receipts</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3 scrollbar-thin">
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400 gap-2">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
              <p className="text-sm">Loading recent orders…</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <p className="font-semibold text-base">No takeaway orders found</p>
              <p className="text-xs text-slate-400 mt-1">Orders placed from this POS will appear here.</p>
            </div>
          ) : (
            orders.map((o) => {
              const dateStr = new Date(o.created_at).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              });
              const itemCount = (o.order_items || []).reduce((sum, it) => sum + it.quantity, 0);

              return (
                <div
                  key={o.id}
                  className="p-4 rounded-xl border border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md transition-all flex items-center justify-between gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-black text-base text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-lg">
                        #{o.order_number}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {dateStr}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          o.status === "cooking"
                            ? "bg-amber-100 text-amber-700"
                            : o.status === "ready"
                            ? "bg-green-100 text-green-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {o.status}
                      </span>
                      <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                        {o.payment_method === "card" ? "Debit Card" : "Cash"}
                      </span>
                    </div>

                    <div className="mt-2 text-xs text-slate-600 truncate">
                      {(o.order_items || []).map((it, idx) => (
                        <span key={idx} className="mr-2">
                          {it.item_name} <span className="text-slate-400">×{it.quantity}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <div className="font-extrabold text-sm text-slate-900">
                        {formatRS(o.grand_total)}
                      </div>
                      <div className="text-[10px] text-slate-400 font-medium">
                        {itemCount} item{itemCount !== 1 ? "s" : ""}
                      </div>
                    </div>

                    <button
                      onClick={() => onReprint(o)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 font-bold text-xs border border-slate-200 transition-all active:scale-95"
                      title="View & Re-print receipt"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Receipt</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ── Main POS Component ────────────────────────────────────────────────────────

export function TakeawayPosClient({ menuCategories }: TakeawayPosClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [cart, setCart] = useState<TakeawayCartItem[]>([]);
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [paymentMethod, setPaymentMethod] = useState<TakeawayPaymentMethod>("cash");

  // Modals
  const [showCashModal, setShowCashModal] = useState(false);
  const [showCardModal, setShowCardModal] = useState(false);
  const [showRecentModal, setShowRecentModal] = useState(false);
  const [editingItemNote, setEditingItemNote] = useState<{ name: string; notes?: string } | null>(null);
  const [receipt, setReceipt] = useState<ReceiptData | null>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.error("Fullscreen toggle error:", err);
    }
  };

  // ── Filtered items ──────────────────────────────────────────────────────────

  const allItems = menuCategories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryId: cat.id, categoryTitle: cat.title }))
  );

  const displayedItems = allItems.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.categoryId === selectedCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.serves.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // ── Totals ──────────────────────────────────────────────────────────────────

  const subtotal = cart.reduce((sum, item) => {
    return sum + (parseItemPrice(item.price) * item.quantity);
  }, 0);
  const gst = subtotal * 0.16;
  const grandTotal = subtotal + gst;
  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  // ── Cart operations ─────────────────────────────────────────────────────────

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.name === item.name);
      if (existing) {
        return prev.map((i) =>
          i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { name: item.name, price: item.price, image: item.image, quantity: 1 }];
    });
  };

  const updateQuantity = (name: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.name === name) {
            const newQty = i.quantity + delta;
            return newQty > 0 ? { ...i, quantity: newQty } : null;
          }
          return i;
        })
        .filter((i): i is TakeawayCartItem => i !== null)
    );
  };

  const updateItemNote = (name: string, note: string) => {
    setCart((prev) =>
      prev.map((i) => (i.name === name ? { ...i, notes: note || undefined } : i))
    );
  };

  const removeFromCart = (name: string) => {
    setCart((prev) => prev.filter((i) => i.name !== name));
  };

  const clearCart = () => setCart([]);

  // ── Order placement ─────────────────────────────────────────────────────────

  /** Called when cashier clicks "Place Order" */
  function handlePlaceOrderClick() {
    if (cart.length === 0) return;
    setErrorMessage(null);
    if (paymentMethod === "cash") {
      setShowCashModal(true);
    } else {
      setShowCardModal(true);
    }
  }

  /** Submits order after cash confirmation */
  function handleCashConfirm(tendered: number) {
    setShowCashModal(false);
    submitOrder({ tendered, change: tendered - grandTotal });
  }

  /** Submits order after cashier confirms card approved */
  function handleCardConfirm() {
    submitOrder({});
  }

  function submitOrder({ tendered, change }: { tendered?: number; change?: number }) {
    startTransition(async () => {
      const result = await createTakeawayOrder(cart, paymentMethod);
      if (result.success) {
        setShowCardModal(false);
        setReceipt({
          orderNumber: result.orderNumber,
          items: [...cart],
          subtotal,
          gst,
          grandTotal,
          paymentMethod,
          amountTendered: tendered,
          change,
          timestamp: nowString(),
        });
        clearCart();
      } else {
        setShowCardModal(false);
        setErrorMessage(result.error);
      }
    });
  }

  function handleReprintOrder(recent: RecentTakeawayOrder) {
    setShowRecentModal(false);
    setReceipt({
      orderNumber: recent.order_number,
      items: recent.order_items.map((it) => {
        const noteMatch = it.item_name.match(/^(.*?)\s*\[Note:\s*(.*?)\]$/);
        return {
          name: noteMatch ? noteMatch[1] : it.item_name,
          price: it.price,
          image: "",
          quantity: it.quantity,
          notes: noteMatch ? noteMatch[2] : undefined,
        };
      }),
      subtotal: recent.subtotal,
      gst: recent.gst,
      grandTotal: recent.grand_total,
      paymentMethod: recent.payment_method,
      timestamp: new Date(recent.created_at).toLocaleString("en-PK", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Print styles + POS micro-animation styles */}
      <style jsx global>{`
        @media print {
          @page { margin: 0; size: 80mm auto; }
        }
        @keyframes pos-cart-in {
          from { opacity: 0; transform: translateX(12px) scale(0.97); }
          to   { opacity: 1; transform: translateX(0)   scale(1); }
        }
        @keyframes pos-badge-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          60%  { transform: scale(1.25); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @keyframes pos-item-in {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pos-cart-item-enter {
          animation: pos-cart-in 220ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .pos-menu-item-enter {
          animation: pos-item-in 180ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .pos-badge-pop {
          animation: pos-badge-pop 280ms cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        /* Smooth number transitions inside cart */
        .pos-qty-num {
          transition: transform 140ms cubic-bezier(0.34, 1.56, 0.64, 1),
                      opacity 120ms ease;
        }
      `}</style>

      <div className="flex h-screen w-full overflow-hidden bg-gradient-to-br from-indigo-50 via-white to-sky-50 text-slate-900 print:hidden">

        {/* ── LEFT & CENTER: MENU SELECTION ──────────────────────── */}
        <div className="flex-1 min-w-0 flex flex-col h-full border-r border-slate-200/60 backdrop-blur-sm">

          {/* Top Navigation Bar */}
          <header className="h-16 px-6 bg-white/40 backdrop-blur-md border-b border-white/60 flex items-center justify-between shrink-0 shadow-sm shadow-slate-200/20">
            <div className="flex items-center gap-3">
              <div className="relative w-10 h-10 shrink-0 flex items-center justify-center">
                <Image
                  src="/Mainlogo.png"
                  alt="Restaurant Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                  priority
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-[family-name:var(--font-montserrat)] font-extrabold text-sm text-slate-800 tracking-wider uppercase">
                    Takeaway POS
                  </h1>
                </div>
                <p className="text-xs font-medium text-slate-500">Abraham's Table</p>
              </div>
            </div>

            {/* Search bar & quick actions */}
            <div className="flex items-center gap-4">
              <div className="relative w-96">
                <input
                  type="text"
                  placeholder="Search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-10 py-2 bg-white/60 backdrop-blur-sm border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 transition-all shadow-sm"
                />
                <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>

              <button
                onClick={() => setShowRecentModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/70 backdrop-blur-sm hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 border border-slate-200 hover:border-indigo-200 transition-all shadow-sm active:scale-95"
                title="View recent takeaway orders"
              >
                <History className="w-3.5 h-3.5 text-indigo-600" />
                <span>Recent Orders</span>
              </button>

              <button
                onClick={() => logoutTakeaway()}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-white/60 backdrop-blur-sm hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 hover:border-slate-300 transition shadow-sm"
                title="Logout from POS"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          </header>

          {/* Main Content Area: Left Category Sidebar + Center Product Grid */}
          <div className="flex-1 min-w-0 flex overflow-hidden">

            {/* Vertical Category Rail */}
            <aside className="w-44 xl:w-48 h-full bg-white/30 backdrop-blur-md border-r border-slate-200/60 flex flex-col shrink-0">
              <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left transition-all duration-200 active:scale-[0.97] ${selectedCategory === "all"
                    ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-200 border border-transparent"
                    : "text-slate-900 font-extrabold hover:bg-white/60 border border-transparent hover:border-slate-200 hover:shadow-sm"
                    }`}
                >
                  <span>All Items</span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all duration-200 ${selectedCategory === "all"
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600 border border-slate-200/50"
                      }`}
                  >
                    {allItems.length}
                  </span>
                </button>

                {menuCategories.map((cat) => {
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`w-full group flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-left transition-all duration-200 active:scale-[0.97] ${isSelected
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white font-extrabold shadow-md shadow-indigo-200 border border-transparent"
                        : "text-slate-900 font-extrabold hover:bg-white/60 border border-transparent hover:border-slate-200 hover:shadow-sm"
                        }`}
                    >
                      <span className="truncate">{cat.title}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all duration-200 ${isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600 border border-slate-200/50"
                          }`}
                      >
                        {cat.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            </aside>

            {/* Product Grid Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-transparent scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
              {displayedItems.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-4 text-slate-400 shadow-sm">
                    <Search className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-800">No items found</h3>
                  <p className="text-sm text-slate-500 max-w-sm mt-1">
                    No items match your search or category filter. Try clearing the search query.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
                  {displayedItems.map((item, idx) => {
                    const inCart = cart.find((i) => i.name === item.name);
                    return (
                      <button
                        key={item.name}
                        onClick={() => addToCart(item)}
                        style={{ animationDelay: `${Math.min(idx * 18, 180)}ms` }}
                        className={`pos-menu-item-enter group relative flex flex-col text-left bg-white/90 hover:bg-white border border-slate-200/60 hover:border-indigo-300 rounded-2xl p-3.5 transition-all duration-200 hover:shadow-lg hover:shadow-indigo-100/50 active:scale-[0.97] overflow-hidden cursor-pointer ${
                          inCart ? "ring-2 ring-indigo-400/40 border-indigo-300" : ""
                        }`}
                      >
                        {/* Active in Cart Badge */}
                        {inCart && (
                          <span key={inCart.quantity} className="pos-badge-pop absolute top-2.5 right-2.5 z-10 w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-black flex items-center justify-center shadow-md">
                            {inCart.quantity}
                          </span>
                        )}

                        {/* Image Area */}
                        <div className="relative w-full aspect-square rounded-xl bg-slate-50 overflow-hidden mb-3 flex items-center justify-center p-2 border border-slate-100 group-hover:border-indigo-200 transition-all duration-200">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
                            className="object-contain group-hover:scale-105 transition-transform duration-300 ease-out drop-shadow-md"
                          />
                        </div>

                        {/* Item Details */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <h4 className="font-bold text-sm text-slate-800 line-clamp-2 group-hover:text-indigo-600 transition-colors duration-150">
                              {item.name}
                            </h4>
                            <p className="text-[11px] text-stone-400 line-clamp-2 mt-0.5 min-h-[30px]">
                              {item.serves}
                            </p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                              {item.price}
                            </span>
                            <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-indigo-600 text-slate-500 group-hover:text-white flex items-center justify-center transition-all duration-200 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-indigo-200">
                              <Plus className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: CASHIER CART & CHECKOUT ────────────────── */}
        <div className="w-[320px] xl:w-[350px] h-full flex flex-col bg-white/40 backdrop-blur-md border-l border-slate-200/60 shrink-0">

          {/* Top Action Bar */}
          <div className="h-16 px-5 border-b border-white/60 flex items-center justify-end bg-transparent shrink-0 shadow-sm shadow-slate-200/20">
            <button
              onClick={toggleFullscreen}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${isFullscreen
                ? "bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200"
                : "bg-white/80 text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-white hover:border-slate-300"
                }`}
              title={isFullscreen ? "Exit Fullscreen (Esc)" : "Enter Fullscreen (F11)"}
            >
              {isFullscreen ? (
                <>
                  <Minimize className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Exit Full</span>
                </>
              ) : (
                <>
                  <Maximize className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Fullscreen</span>
                </>
              )}
            </button>
          </div>

          {/* Order Container */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex-1 flex flex-col bg-white/50 backdrop-blur-lg border-l border-t border-slate-200/60 rounded-tl-xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.05)]">

              {/* Order Header */}
              <div className="px-4 py-3 bg-white/70 border-b border-slate-200/60 flex items-center justify-between shrink-0">
                <h2 className="font-extrabold text-xs text-slate-800 tracking-wider uppercase">Current Order</h2>
                <div className="flex items-center gap-2">
                  {cart.length > 0 && (
                    <button
                      onClick={clearCart}
                      className="flex items-center gap-1 text-[10px] font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition"
                      title="Clear current order"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Clear</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Cart Item List */}
              <div className="flex-1 overflow-y-auto p-3 pr-2 space-y-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <div className="relative w-24 h-24 mb-4">
                      <Image
                        src="/AddtocartpicNOBG.png"
                        alt="Empty cart"
                        fill
                        className="object-contain drop-shadow-lg"
                      />
                    </div>
                    <h4 className="font-bold text-slate-400 text-sm">No items in order</h4>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.name}
                      className="pos-cart-item-enter flex items-center justify-between p-4 bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200"
                    >
                      <div className="flex flex-col gap-1 min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <h5 className="font-extrabold text-sm text-slate-800 tracking-wide truncate">{item.name}</h5>
                          <button
                            type="button"
                            onClick={() => setEditingItemNote({ name: item.name, notes: item.notes })}
                            className={`p-1 rounded-md transition-all ${
                              item.notes
                                ? "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                : "text-slate-400 hover:text-indigo-600 hover:bg-slate-100"
                            }`}
                            title={item.notes ? `Note: ${item.notes} (Click to edit)` : "Add kitchen note (e.g. No mayo)"}
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <span className="text-slate-500">{item.price}</span>
                          <span className="text-slate-400 font-medium">×{item.quantity}</span>
                          <span className="text-slate-700 font-bold">
                            = {formatRS(parseItemPrice(item.price) * item.quantity)}
                          </span>
                        </div>
                        {item.notes && (
                          <div
                            onClick={() => setEditingItemNote({ name: item.name, notes: item.notes })}
                            className="mt-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg flex items-center gap-1 cursor-pointer hover:bg-amber-100 transition-colors"
                          >
                            <span>⚡ {item.notes}</span>
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center bg-white border border-slate-200/80 rounded-full p-1 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.name, -1)}
                            className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-500 hover:border-red-200 border border-transparent flex items-center justify-center text-slate-600 transition-all duration-150 active:scale-90"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="pos-qty-num w-8 text-center font-bold text-sm text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.name, 1)}
                            className="w-7 h-7 rounded-full bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white transition-all duration-150 active:scale-90"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.name)}
                          className="flex items-center justify-center text-slate-300 hover:text-red-500 hover:scale-110 transition-all duration-150"
                          title="Remove"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Error Banner */}
              {errorMessage && (
                <div className="mx-3 mb-2 p-2 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-600 shrink-0 flex items-center gap-2 shadow-sm">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {errorMessage}
                  <button onClick={() => setErrorMessage(null)} className="ml-auto text-red-400 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Summary & Checkout Section */}
              <div className="p-4 bg-white/80 backdrop-blur-md border-t border-slate-200 shrink-0">
                <div className="space-y-2 text-xs text-slate-500 mb-4">
                  <div className="flex justify-between">
                    <span className="text-slate-600">Subtotal</span>
                    <span className="text-slate-800 font-bold">{formatRS(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">Tax (16%)</span>
                    <span className="text-slate-800 font-bold">{formatRS(gst)}</span>
                  </div>
                  <div className="border-t border-dashed border-slate-200/80 my-1" />
                  <div className="flex justify-between text-sm font-black text-slate-800 pt-1">
                    <span>Total</span>
                    <span className="text-indigo-600 text-base">{formatRS(grandTotal)}</span>
                  </div>
                </div>

                {/* Payment Methods */}
                <div className="mb-4">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Method</div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setPaymentMethod("cash")}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 border active:scale-95 ${
                        paymentMethod === "cash"
                          ? "bg-green-500 text-white border-green-500 shadow-md shadow-green-200 scale-[1.02]"
                          : "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 hover:border-green-300 hover:shadow-sm"
                      }`}
                    >
                      <Banknote className="w-3.5 h-3.5" />
                      Cash
                    </button>
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-bold transition-all duration-200 border active:scale-95 ${
                        paymentMethod === "card"
                          ? "bg-blue-500 text-white border-blue-500 shadow-md shadow-blue-200 scale-[1.02]"
                          : "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:border-blue-300 hover:shadow-sm"
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      Debit Card
                    </button>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrderClick}
                  disabled={cart.length === 0 || isPending}
                  className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2 select-none ${
                    cart.length === 0 || isPending
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                      : "bg-indigo-600 hover:bg-indigo-500 active:bg-indigo-700 text-white shadow-lg shadow-indigo-200/60 hover:shadow-indigo-300/60 active:scale-[0.98] hover:scale-[1.01]"
                  }`}
                >
                  {isPending ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Processing…</span>
                    </>
                  ) : (
                    <span>Place Order {cart.length > 0 ? `· ${totalQuantity} item${totalQuantity !== 1 ? "s" : ""}` : ""}</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Modals ── */}
      {showCashModal && (
        <CashChangeModal
          grandTotal={grandTotal}
          onConfirm={handleCashConfirm}
          onCancel={() => setShowCashModal(false)}
        />
      )}

      {showCardModal && (
        <CardInstructionOverlay
          grandTotal={grandTotal}
          onConfirm={handleCardConfirm}
          onCancel={() => setShowCardModal(false)}
          isPending={isPending}
        />
      )}

      {receipt && (
        <ReceiptModal
          receipt={receipt}
          onClose={() => setReceipt(null)}
        />
      )}

      {editingItemNote && (
        <ItemNoteModal
          item={{ name: editingItemNote.name }}
          initialNote={editingItemNote.notes || ""}
          onSave={(note) => {
            updateItemNote(editingItemNote.name, note);
            setEditingItemNote(null);
          }}
          onClose={() => setEditingItemNote(null)}
        />
      )}

      {showRecentModal && (
        <RecentOrdersModal
          onClose={() => setShowRecentModal(false)}
          onReprint={handleReprintOrder}
        />
      )}
    </>
  );
}
