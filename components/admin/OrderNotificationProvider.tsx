"use client";

import { createContext, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/backend/supabase";

export type OrderNotification = {
  id: string;
  order_number: string;
  customer_name: string;
  grand_total: number;
  order_type: string;
  created_at: string;
  read: boolean;
};

type NotificationContextType = {
  notifications: OrderNotification[];
  unreadCount: number;
  toasts: OrderNotification[];
  markAllRead: () => void;
  dismissToast: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  toasts: [],
  markAllRead: () => {},
  dismissToast: () => {},
});

export function useNotifications() {
  return useContext(NotificationContext);
}

export function OrderNotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [toasts, setToasts] = useState<OrderNotification[]>([]);
  const lastCheckedRef = useRef<string>(new Date(Date.now() - 30000).toISOString());
  const router = useRouter();

  useEffect(() => {
    const handleNewOrders = (newOrders: any[]) => {
      if (!newOrders || newOrders.length === 0) return;

      const formatted: OrderNotification[] = newOrders.map((row) => ({
        id: row.id,
        order_number: row.order_number,
        customer_name: row.customer_name,
        grand_total: Number(row.grand_total),
        order_type: row.order_type,
        created_at: row.created_at,
        read: false,
      }));

      setNotifications((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const filteredNew = formatted.filter((n) => !existingIds.has(n.id));

        if (filteredNew.length > 0) {
          setToasts((tPrev) => [...filteredNew, ...tPrev]);
          // Automatically refresh the Next.js server data so table updates without manual refresh!
          router.refresh();
          return [...filteredNew, ...prev].slice(0, 50);
        }
        return prev;
      });

      const newestTime = newOrders.reduce(
        (max, item) => (new Date(item.created_at) > new Date(max) ? item.created_at : max),
        lastCheckedRef.current
      );
      lastCheckedRef.current = newestTime;
    };

    // 1. Server API Poller (bypasses browser RLS seamlessly)
    const pollServerNotifications = async () => {
      try {
        const res = await fetch(`/api/admin/notifications?since=${encodeURIComponent(lastCheckedRef.current)}`);
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            handleNewOrders(data.orders);
          }
        }
      } catch (err) {
        console.error("Notification polling error:", err);
      }
    };

    // Initial check
    pollServerNotifications();

    // Fast 3-second poll loop
    const pollInterval = setInterval(pollServerNotifications, 3000);

    // 2. Realtime WebSocket listener
    const channel = supabase
      .channel("realtime:orders")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "orders" },
        (payload) => {
          if ((payload.new as any)?.status !== "awaiting_payment") {
            handleNewOrders([payload.new]);
          }
        }
      )
      .subscribe();

    return () => {
      clearInterval(pollInterval);
      supabase.removeChannel(channel);
    };
  }, [router]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider
      value={{ notifications, unreadCount, toasts, markAllRead, dismissToast }}
    >
      {children}
    </NotificationContext.Provider>
  );
}
