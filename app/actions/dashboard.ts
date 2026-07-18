"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";

// ─── Types ────────────────────────────────────────────────────────────────────

export type OrderRow = {
  id: string;
  order_number: string;
  order_type: string;
  customer_name: string;
  phone: string;
  city: string;
  delivery_address: string;
  subtotal: number;
  delivery_fee: number;
  gst: number;
  grand_total: number;
  payment_method: string;
  status: string;
  created_at: string;
};

export type DashboardSummary = {
  todayRevenue: number;
  yesterdayRevenue: number;
  totalOrders: number;
  yesterdayOrders: number;
  activeUsers: number;
  pendingOrders: number;
  yesterdayPending: number;
};

export type OrderStatusCounts = {
  pickup: number;
  delivery: number;
  preparing: number;
  completed: number;
};

export type PickupQueueItem = {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  status: string;
  payment_method: string;
  created_at: string;
};

export type SalesDay = {
  name: string;
  sales: number;
};

export type TopItem = {
  item_name: string;
  total_quantity: number;
  total_revenue: number;
};

export type PaymentBreakdown = {
  method: string;
  total: number;
};

// ─── Helper ───────────────────────────────────────────────────────────────────

function todayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

function yesterdayRange() {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - 1);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setDate(end.getDate() - 1);
  end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

// ─── Summary Cards Data ───────────────────────────────────────────────────────

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const today = todayRange();
  const yesterday = yesterdayRange();

  const [
    { data: todayOrders },
    { data: yesterdayOrders },
    { count: pendingCount },
    { count: yesterdayPending },
    { count: userCount },
  ] = await Promise.all([
    supabaseAdmin
      .from("orders")
      .select("grand_total")
      .gte("created_at", today.start)
      .lte("created_at", today.end),
    supabaseAdmin
      .from("orders")
      .select("grand_total")
      .gte("created_at", yesterday.start)
      .lte("created_at", yesterday.end),
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "cooking"])
      .gte("created_at", today.start)
      .lte("created_at", today.end),
    supabaseAdmin
      .from("orders")
      .select("*", { count: "exact", head: true })
      .in("status", ["pending", "cooking"])
      .gte("created_at", yesterday.start)
      .lte("created_at", yesterday.end),
    supabaseAdmin
      .from("profiles")
      .select("*", { count: "exact", head: true }),
  ]);

  const todayRevenue = (todayOrders ?? []).reduce(
    (sum, o) => sum + Number(o.grand_total),
    0
  );
  const yesterdayRevenue = (yesterdayOrders ?? []).reduce(
    (sum, o) => sum + Number(o.grand_total),
    0
  );

  return {
    todayRevenue,
    yesterdayRevenue,
    totalOrders: todayOrders?.length ?? 0,
    yesterdayOrders: yesterdayOrders?.length ?? 0,
    activeUsers: userCount ?? 0,
    pendingOrders: pendingCount ?? 0,
    yesterdayPending: yesterdayPending ?? 0,
  };
}

// ─── Live Orders ──────────────────────────────────────────────────────────────

export async function getLiveOrders(): Promise<OrderRow[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*")
    .not("status", "eq", "delivered")
    .not("status", "eq", "cancelled")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) {
    console.error("getLiveOrders error:", error);
    return [];
  }
  return data ?? [];
}

// ─── Order Status Counts ──────────────────────────────────────────────────────

export async function getOrderStatusCounts(): Promise<OrderStatusCounts> {
  const today = todayRange();

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("order_type, status")
    .gte("created_at", today.start)
    .lte("created_at", today.end);

  if (error) {
    console.error("getOrderStatusCounts error:", error);
    return { pickup: 0, delivery: 0, preparing: 0, completed: 0 };
  }

  const rows = data ?? [];
  return {
    pickup: rows.filter((r) => r.order_type === "pickup" && r.status !== "delivered" && r.status !== "cancelled").length,
    delivery: rows.filter((r) => r.order_type === "delivery" && r.status === "out_for_delivery").length,
    preparing: rows.filter((r) => r.status === "cooking").length,
    completed: rows.filter((r) => r.status === "delivered").length,
  };
}

// ─── Pickup Queue ─────────────────────────────────────────────────────────────

export async function getPickupQueue(): Promise<PickupQueueItem[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("id, order_number, customer_name, phone, status, payment_method, created_at")
    .eq("order_type", "pickup")
    .in("status", ["pending", "cooking", "ready"])
    .order("created_at", { ascending: true })
    .limit(5);

  if (error) {
    console.error("getPickupQueue error:", error);
    return [];
  }
  return data ?? [];
}

// ─── Sales Overview (last 7 days) ─────────────────────────────────────────────

export async function getSalesOverview(): Promise<SalesDay[]> {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const now = new Date();
  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("grand_total, created_at")
    .gte("created_at", sevenDaysAgo.toISOString())
    .not("status", "eq", "cancelled");

  if (error || !data) return days.map((name) => ({ name, sales: 0 }));

  // Build a map: day-of-week index → total sales
  const salesMap: Record<number, number> = {};
  for (const row of data) {
    const d = new Date(row.created_at);
    const dayIdx = d.getDay();
    salesMap[dayIdx] = (salesMap[dayIdx] ?? 0) + Number(row.grand_total);
  }

  // Build result for last 7 days in order
  const result: SalesDay[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dayIdx = d.getDay();
    result.push({ name: days[dayIdx], sales: salesMap[dayIdx] ?? 0 });
  }
  return result;
}

// ─── Top Selling Items ────────────────────────────────────────────────────────

export async function getTopSellingItems(): Promise<TopItem[]> {
  const { data, error } = await supabaseAdmin
    .from("order_items")
    .select("item_name, quantity, price");

  if (error || !data) return [];

  // Aggregate by item name
  const map: Record<string, { total_quantity: number; total_revenue: number }> = {};
  for (const row of data) {
    if (!map[row.item_name]) map[row.item_name] = { total_quantity: 0, total_revenue: 0 };
    map[row.item_name].total_quantity += row.quantity;
    const priceNum = parseFloat(String(row.price).replace(/[^0-9.]/g, "")) || 0;
    map[row.item_name].total_revenue += priceNum * row.quantity;
  }

  return Object.entries(map)
    .map(([item_name, v]) => ({ item_name, ...v }))
    .sort((a, b) => b.total_quantity - a.total_quantity)
    .slice(0, 5);
}

// ─── Payment Method Breakdown ─────────────────────────────────────────────────

export async function getPaymentMethodBreakdown(): Promise<PaymentBreakdown[]> {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("payment_method, grand_total")
    .not("status", "eq", "cancelled");

  if (error || !data) return [];

  const map: Record<string, number> = {};
  for (const row of data) {
    const method = row.payment_method ?? "unknown";
    map[method] = (map[method] ?? 0) + Number(row.grand_total);
  }

  return Object.entries(map).map(([method, total]) => ({ method, total }));
}
