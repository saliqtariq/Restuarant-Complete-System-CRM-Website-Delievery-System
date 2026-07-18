import { DollarSign, ShoppingBag, Users, Clock, TrendingUp, TrendingDown } from "lucide-react";

const summaryData = [
  {
    title: "TODAY'S REVENUE",
    value: "Rs 58,400",
    trend: "14.6%",
    isPositive: true,
    comparison: "vs yesterday",
    icon: DollarSign,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
  {
    title: "TOTAL ORDERS",
    value: "127",
    trend: "12.5%",
    isPositive: true,
    comparison: "vs yesterday",
    icon: ShoppingBag,
    iconBg: "bg-orange-50",
    iconColor: "text-orange-500",
  },
  {
    title: "ACTIVE USERS",
    value: "64",
    trend: "8.1%",
    isPositive: true,
    comparison: "vs yesterday",
    icon: Users,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-500",
  },
  {
    title: "PENDING ORDERS",
    value: "18",
    trend: "6.3%",
    isPositive: false,
    comparison: "vs yesterday",
    icon: Clock,
    iconBg: "bg-red-50",
    iconColor: "text-red-500",
  },
];

export function SummaryCards() {
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
              <span className={`flex items-center gap-0.5 font-bold ${item.isPositive ? "text-green-500" : "text-red-500"}`}>
                {item.isPositive ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                {item.isPositive ? "+" : "-"}{item.trend}
              </span>
              <span className="text-gray-400">{item.comparison}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
