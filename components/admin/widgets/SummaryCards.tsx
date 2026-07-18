import { DollarSign, ShoppingBag, Users, Clock, TrendingUp, TrendingDown } from "lucide-react";
import type { DashboardSummary } from "@/app/actions/dashboard";

function calcTrend(today: number, yesterday: number) {
  if (yesterday === 0) return today > 0 ? "100%" : "0%";
  const diff = Math.abs(today - yesterday);
  return ((diff / yesterday) * 100).toFixed(1) + "%";
}

export function SummaryCards({ summary }: { summary: DashboardSummary }) {
  const revTrend = calcTrend(summary.todayRevenue, summary.yesterdayRevenue);
  const revPos = summary.todayRevenue >= summary.yesterdayRevenue;
  
  const ordTrend = calcTrend(summary.totalOrders, summary.yesterdayOrders);
  const ordPos = summary.totalOrders >= summary.yesterdayOrders;

  const pendTrend = calcTrend(summary.pendingOrders, summary.yesterdayPending);
  const pendPos = summary.pendingOrders <= summary.yesterdayPending; // lower pending is generally better, but we'll show up/down arrow based on change

  const summaryData = [
    {
      title: "TODAY'S REVENUE",
      value: `Rs ${summary.todayRevenue.toLocaleString()}`,
      trend: revTrend,
      isPositive: revPos,
      comparison: "vs yesterday",
      icon: DollarSign,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    {
      title: "TOTAL ORDERS",
      value: summary.totalOrders.toString(),
      trend: ordTrend,
      isPositive: ordPos,
      comparison: "vs yesterday",
      icon: ShoppingBag,
      iconBg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "TOTAL USERS",
      value: summary.activeUsers.toString(),
      trend: "N/A",
      isPositive: true,
      comparison: "all time",
      icon: Users,
      iconBg: "bg-purple-50",
      iconColor: "text-purple-500",
    },
    {
      title: "PENDING ORDERS",
      value: summary.pendingOrders.toString(),
      trend: pendTrend,
      isPositive: pendPos,
      comparison: "vs yesterday",
      icon: Clock,
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {summaryData.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-3">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.title}</p>
              <div className={`w-10 h-10 rounded-full ${item.iconBg} flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-5 h-5 ${item.iconColor}`} />
              </div>
            </div>
            <h3 className="text-[28px] font-bold text-gray-900 leading-none mb-3">{item.value}</h3>
            <div className="flex items-center gap-1.5 text-xs font-medium">
              {item.trend !== "N/A" ? (
                <span className={`flex items-center gap-0.5 font-bold ${item.isPositive ? "text-green-500" : "text-red-500"}`}>
                  {item.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {item.isPositive ? "+" : "-"}{item.trend}
                </span>
              ) : (
                <span className="flex items-center gap-0.5 font-bold text-gray-500">
                   -
                </span>
              )}
              <span className="text-gray-400">{item.comparison}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
