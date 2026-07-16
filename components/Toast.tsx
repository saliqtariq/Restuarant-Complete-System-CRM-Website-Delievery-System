"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { create } from "zustand";
import { X } from "lucide-react";

/* ─── Toast Store ─── */
export interface ToastMessage {
  id: string;
  name: string;
  image?: string;
  price?: string;
  description?: string;
}

interface ToastState {
  toasts: ToastMessage[];
  addToast: (t: Omit<ToastMessage, "id">) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (t) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    set((s) => ({ toasts: [...s.toasts, { ...t, id }] }));
  },
  removeToast: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/* ─── Single Toast ─── */
function ToastItem({ toast }: { toast: ToastMessage }) {
  const remove = useToastStore((s) => s.removeToast);
  const [visible, setVisible] = useState(false);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // trigger enter animation
    const enterTimer = setTimeout(() => setVisible(true), 10);

    // auto-dismiss after 2.5s
    const dismissTimer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => remove(toast.id), 350);
    }, 2500);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(dismissTimer);
    };
  }, [toast.id, remove]);

  const handleClose = () => {
    setExiting(true);
    setTimeout(() => remove(toast.id), 350);
  };

  return (
    <div
      className={`flex items-center gap-4 bg-white rounded-2xl shadow-xl border border-gray-100 px-5 py-4 min-w-[340px] max-w-[420px] transition-all duration-300 ease-out ${
        visible && !exiting
          ? "translate-x-0 opacity-100"
          : "translate-x-[120%] opacity-0"
      }`}
    >
      {/* Green Check */}
      <div className="flex-shrink-0 w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={3}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      {/* Item Thumbnail */}
      {toast.image && (
        <div className="relative w-14 h-14 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={toast.image}
            alt={toast.name}
            fill
            sizes="56px"
            className="object-contain p-1"
          />
        </div>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p
          className="text-[#4a1c0d] text-lg font-bold uppercase truncate m-0 leading-tight"
          style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.04em" }}
        >
          {toast.name}
        </p>
        <p className="text-gray-500 text-sm m-0 mt-1 font-medium">
          {toast.description || "Added to cart"}
        </p>
      </div>

      {/* Close */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 text-gray-300 hover:text-gray-500 transition-colors p-1"
        aria-label="Dismiss"
      >
        <X size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/* ─── Toast Container (mount once in layout) ─── */
export default function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[100] flex flex-col gap-2 pointer-events-auto">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}
