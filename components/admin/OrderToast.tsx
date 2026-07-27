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
        background: "#ffffff",
        border: "1px solid #f1f5f9",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        minWidth: "320px",
        maxWidth: "380px",
        boxShadow: "0 10px 40px -10px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.05)",
        animation: "toastSlideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        position: "relative",
        color: "#1e293b",
        overflow: "hidden",
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: "44px",
          height: "44px",
          borderRadius: "12px",
          background: "#fff1f2",
          border: "1px solid #ffe4e6",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {isPickup ? (
          <ShoppingBag size={20} color="#E63946" strokeWidth={2} />
        ) : (
          <Truck size={20} color="#E63946" strokeWidth={2} />
        )}
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0, paddingTop: "2px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: "#E63946",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            New {isPickup ? "Pickup" : "Delivery"}
          </span>
          <span style={{ fontSize: "14px", lineHeight: 1 }}>🎉</span>
        </div>
        
        <div 
          style={{ 
            fontSize: "16px", 
            fontFamily: "serif", 
            fontWeight: 700, 
            color: "#0f172a", 
            marginBottom: "6px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis"
          }}
        >
          {notification.customer_name}
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "13px", color: "#64748b", fontWeight: 500 }}>
            #{notification.order_number}
          </span>
          <span style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#cbd5e1" }} />
          <span style={{ fontSize: "13px", color: "#0f172a", fontWeight: 700 }}>
            RS {Number(notification.grand_total).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={onDismiss}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#94a3b8",
          padding: "6px",
          margin: "-4px -4px 0 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          transition: "all 0.2s ease",
          borderRadius: "8px",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#475569";
          e.currentTarget.style.backgroundColor = "#f1f5f9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#94a3b8";
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        <X size={16} strokeWidth={2} />
      </button>

      {/* Progress bar auto-dismiss indicator */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "#f1f5f9",
        }}
      >
        <div
          style={{
            height: "100%",
            background: "#E63946",
            animation: "toastProgress 6s linear forwards",
          }}
        />
      </div>
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
          from { opacity: 0; transform: translateX(120%) scale(0.95); }
          to   { opacity: 1; transform: translateX(0) scale(1); }
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
          gap: "12px",
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
