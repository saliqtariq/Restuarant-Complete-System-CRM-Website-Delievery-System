"use client";

import { useEffect } from "react";
import { X, ShoppingBag, Truck } from "lucide-react";
import { useNotifications, OrderNotification } from "./OrderNotificationProvider";

function Toast({ notification, onDismiss }: { notification: OrderNotification; onDismiss: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  const isPickup = notification.order_type === "pickup";

  return (
    <div
      className="order-toast"
      style={{
        background: "linear-gradient(135deg, #1e0a0a 0%, #3B0A0A 100%)",
        border: "1px solid #7A1A1A",
        borderLeft: "4px solid #E63946",
        borderRadius: "12px",
        padding: "14px 16px",
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        minWidth: "300px",
        maxWidth: "360px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), 0 0 0 1px rgba(230,57,70,0.15)",
        animation: "toastSlideIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        position: "relative",
        color: "white",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "36px",
          height: "36px",
          borderRadius: "8px",
          background: "rgba(230,57,70,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isPickup ? (
          <ShoppingBag size={18} color="#E63946" />
        ) : (
          <Truck size={18} color="#E63946" />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "3px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#E63946",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            🛎 New {isPickup ? "Pickup" : "Delivery"} Order
          </span>
        </div>
        <div style={{ fontSize: "13px", fontWeight: 600, color: "#fff", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {notification.customer_name}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "11px", color: "#aaa" }}>
            #{notification.order_number}
          </span>
          <span style={{ fontSize: "11px", color: "#ccc", fontWeight: 600 }}>
            RS {Number(notification.grand_total).toLocaleString()}
          </span>
        </div>

        {/* Progress bar auto-dismiss indicator */}
        <div
          style={{
            marginTop: "10px",
            height: "2px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "2px",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              height: "100%",
              background: "#E63946",
              borderRadius: "2px",
              animation: "toastProgress 6s linear forwards",
            }}
          />
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#888",
          padding: "2px",
          display: "flex",
          alignItems: "center",
          flexShrink: 0,
          transition: "color 0.2s",
        }}
        onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#fff")}
        onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#888")}
      >
        <X size={14} />
      </button>
    </div>
  );
}

export function OrderToastContainer() {
  const { toasts, dismissToast } = useNotifications();

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(110%) scale(0.9); }
          to   { opacity: 1; transform: translateX(0)   scale(1);   }
        }
        @keyframes toastProgress {
          from { width: 100%; }
          to   { width: 0%; }
        }
      `}</style>
      <div
        style={{
          position: "fixed",
          bottom: "24px",
          right: "24px",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          alignItems: "flex-end",
          pointerEvents: "none",
        }}
      >
        {toasts.map((toast) => (
          <div key={toast.id} style={{ pointerEvents: "auto" }}>
            <Toast
              notification={toast}
              onDismiss={() => dismissToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </>
  );
}
