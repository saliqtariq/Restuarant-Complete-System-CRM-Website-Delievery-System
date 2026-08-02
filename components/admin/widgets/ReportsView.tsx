"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { DashboardSummary, SalesDay, TopItem, PaymentBreakdown } from "@/app/actions/dashboard";
import { ReviewRow } from "@/app/actions/reviews";
import { TrendingUp, ShoppingCart, Users, Star } from "lucide-react";

const COLORS = ["#E63946", "#f59e0b", "#22c55e", "#6366f1", "#d1d5db"];

type Props = {
  summary: DashboardSummary;
  salesData: SalesDay[];
  topItems: TopItem[];
  paymentData: PaymentBreakdown[];
  reviews: ReviewRow[];
  totalRevenue: number;
  avgOrderValue: number;
};

function StatCard({
  title,
  value,
  sub,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  sub: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${color}`}>
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-xs font-bold uppercase text-gray-400 tracking-wide">{title}</p>
        <p className="text-2xl font-extrabold text-gray-900 mt-0.5">{value}</p>
        <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export function ReportsView({
  summary,
  salesData,
  topItems,
  paymentData,
  reviews,
  totalRevenue,
  avgOrderValue,
}: Props) {
  const totalReviews = reviews.length;
  const avgRating =
    reviews.filter((r) => r.rating).reduce((s, r) => s + (r.rating ?? 0), 0) /
    (reviews.filter((r) => r.rating).length || 1);

  const pieData = paymentData.map((p, i) => ({
    name: p.method.toUpperCase(),
    value: p.total,
    color: COLORS[i % COLORS.length],
  }));

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue (All Time)"
          value={`Rs ${totalRevenue.toLocaleString()}`}
          sub={`Today: Rs ${summary.todayRevenue.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-[#E63946]"
        />
        <StatCard
          title="Total Orders (Today)"
          value={summary.totalOrders.toString()}
          sub={`Pending: ${summary.pendingOrders}`}
          icon={ShoppingCart}
          color="bg-orange-400"
        />
        <StatCard
          title="Avg. Order Value"
          value={`Rs ${Math.round(avgOrderValue).toLocaleString()}`}
          sub="Based on all time orders"
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Avg. Rating"
          value={totalReviews > 0 ? `${avgRating.toFixed(1)} / 5` : "N/A"}
          sub={`${totalReviews} total reviews`}
          icon={Star}
          color="bg-yellow-400"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Overview */}
        <div className="xl:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-5">
            Sales Overview (Last 7 Days)
          </h3>
          <div className="h-55">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#9ca3af" }}
                  tickFormatter={(v) => (v === 0 ? "0" : `${v / 1000}K`)}
                />
                <Tooltip
                  contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                  formatter={(value) => [`Rs ${Number(value).toLocaleString()}`, "Sales"]}
                />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#E63946"
                  strokeWidth={3}
                  dot={{ r: 4, strokeWidth: 2, fill: "#fff" }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-5">
            Payment Methods
          </h3>
          {pieData.length === 0 ? (
            <p className="text-gray-400 text-sm">No data yet.</p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="w-40 h-40 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={55}
                      outerRadius={78}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xs text-gray-500">Total</span>
                  <span className="text-sm font-bold text-gray-900">
                    Rs {totalRevenue.toLocaleString()}
                  </span>
                </div>
              </div>
              <div className="w-full space-y-2">
                {pieData.map((item, i) => {
                  const pct =
                    totalRevenue > 0 ? Math.round((item.value / totalRevenue) * 100) : 0;
                  return (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="font-bold text-gray-700">{item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Top Selling Items */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-5">
          Top Selling Items (All Time)
        </h3>
        {topItems.length === 0 ? (
          <p className="text-gray-400 text-sm">No order data yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase text-gray-400 font-bold border-b border-gray-100">
                <tr>
                  <th className="text-left py-2 px-3">#</th>
                  <th className="text-left py-2 px-3">Item Name</th>
                  <th className="text-right py-2 px-3">Orders</th>
                  <th className="text-right py-2 px-3">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {topItems.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="py-3 px-3 text-gray-400 font-bold">{i + 1}</td>
                    <td className="py-3 px-3 font-bold text-gray-900">{item.item_name}</td>
                    <td className="py-3 px-3 text-right text-gray-600">{item.total_quantity}</td>
                    <td className="py-3 px-3 text-right font-bold text-gray-900">
                      Rs {Math.round(item.total_revenue).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
