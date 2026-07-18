"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import type { SalesDay, TopItem, PaymentBreakdown } from "@/app/actions/dashboard";

export function SalesOverviewChart({ data }: { data: SalesDay[] }) {
  const totalSales = data.reduce((sum, d) => sum + d.sales, 0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">SALES OVERVIEW (Last 7 Days)</h3>
          <div className="text-2xl font-bold text-gray-900">Rs {totalSales.toLocaleString()}</div>
        </div>
      </div>
      {totalSales === 0 ? (
        <div className="h-[200px] w-full flex items-center justify-center text-gray-400 font-medium text-sm">
          No sales data for the last 7 days.
        </div>
      ) : (
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9ca3af' }} tickFormatter={(val) => val === 0 ? '0' : `${val / 1000}K`} />
              <RechartsTooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                formatter={(value) => [`Rs ${value}`, 'Sales']}
              />
              <Line type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export function PaymentMethodsChart({ data }: { data: PaymentBreakdown[] }) {
  const colors = ['#ef4444', '#f59e0b', '#22c55e', '#3b82f6', '#8b5cf6'];
  const total = data.reduce((sum, d) => sum + d.total, 0);

  const formattedData = data.map((d, i) => ({
    name: d.method.toUpperCase(),
    value: d.total,
    percentage: total > 0 ? ((d.total / total) * 100).toFixed(1) + '%' : '0%',
    color: colors[i % colors.length],
  })).sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider">PAYMENT METHODS</h3>
      </div>
      {total === 0 ? (
         <div className="h-[140px] w-full flex items-center justify-center text-gray-400 font-medium text-sm">
           No payment data yet.
         </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="w-[140px] h-[140px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={formattedData}
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {formattedData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xs text-gray-500">Total</span>
              <span className="text-sm font-bold text-gray-900">Rs {total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className="space-y-4 flex-1 ml-6">
            {formattedData.map((item, i) => (
              <div key={i} className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                  <div>
                    <div className="text-xs font-bold text-gray-900 max-w-[90px] truncate" title={item.name}>{item.name}</div>
                    <div className="text-[10px] text-gray-500">Rs {item.value.toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-900">{item.percentage}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function TopSellingItems({ items }: { items: TopItem[] }) {
  const bgColors = ["bg-orange-100", "bg-red-100", "bg-yellow-100", "bg-orange-50", "bg-yellow-50"];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1 h-full">
      <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-6">TOP SELLING ITEMS</h3>
      {items.length === 0 ? (
        <div className="h-[140px] w-full flex items-center justify-center text-gray-400 font-medium text-sm">
          No sales data yet.
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-sm font-bold text-gray-400 w-4">{i + 1}</div>
                <div className={`w-10 h-10 rounded-lg ${bgColors[i % bgColors.length]} flex items-center justify-center text-xl`}>
                  🍔
                </div>
                <div>
                  <div className="text-sm font-bold text-gray-900 max-w-[120px] truncate" title={item.item_name}>{item.item_name}</div>
                  <div className="text-xs text-gray-500">{item.total_quantity} Orders</div>
                </div>
              </div>
              <div className="text-sm font-bold text-gray-900">Rs {item.total_revenue.toLocaleString()}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AnalyticsWidgets({ 
  salesData, 
  topItems, 
  paymentBreakdown 
}: { 
  salesData: SalesDay[], 
  topItems: TopItem[], 
  paymentBreakdown: PaymentBreakdown[] 
}) {
  return (
    <div className="flex flex-col xl:flex-row gap-6 mt-6">
      <div className="flex-[1.5]">
        <SalesOverviewChart data={salesData} />
      </div>
      <div className="flex-1">
        <PaymentMethodsChart data={paymentBreakdown} />
      </div>
      <div className="flex-1">
        <TopSellingItems items={topItems} />
      </div>
    </div>
  );
}
