"use client";

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function SalesOverviewChart() {
  const data = [
    { name: 'Mon', sales: 20000 },
    { name: 'Tue', sales: 25000 },
    { name: 'Wed', sales: 22000 },
    { name: 'Thu', sales: 30000 },
    { name: 'Fri', sales: 38000 },
    { name: 'Sat', sales: 42000 },
    { name: 'Sun', sales: 35000 },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-2">SALES OVERVIEW</h3>
          <div className="text-2xl font-bold text-gray-900">Rs 358,400</div>
          <div className="text-xs text-green-500 font-bold mt-1">↑ 16.8% <span className="text-gray-400 font-normal">vs last week</span></div>
        </div>
        <select className="bg-transparent text-sm text-gray-500 font-medium outline-none cursor-pointer">
          <option>This Week</option>
          <option>Last Week</option>
          <option>This Month</option>
        </select>
      </div>
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
    </div>
  );
}

export function PaymentMethodsChart() {
  const data = [
    { name: 'Online Card', value: 161280, percentage: '45%', color: '#ef4444' }, // red-500
    { name: 'Easypaisa / JazzCash', value: 89600, percentage: '25%', color: '#f59e0b' }, // amber-500
    { name: 'Cash on Delivery', value: 71680, percentage: '20%', color: '#22c55e' }, // green-500
    { name: 'Other', value: 35840, percentage: '10%', color: '#d1d5db' }, // gray-300
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <div className="flex justify-between items-start mb-6">
        <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider">PAYMENT METHODS</h3>
        <select className="bg-transparent text-sm text-gray-500 font-medium outline-none cursor-pointer">
          <option>This Week</option>
        </select>
      </div>
      <div className="flex items-center justify-between">
        <div className="w-[140px] h-[140px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={50}
                outerRadius={70}
                paddingAngle={2}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-gray-500">Total</span>
            <span className="text-sm font-bold text-gray-900">Rs 358,400</span>
          </div>
        </div>
        
        <div className="space-y-4 flex-1 ml-6">
          {data.map((item, i) => (
            <div key={i} className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                <div>
                  <div className="text-xs font-bold text-gray-900">{item.name}</div>
                  <div className="text-[10px] text-gray-500">Rs {item.value.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-xs font-bold text-gray-900">{item.percentage}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TopSellingItems() {
  const items = [
    { rank: 1, name: "Outlaw Zinger Burger", orders: "245 Orders", rev: "Rs 161,280", imgBg: "bg-orange-100" },
    { rank: 2, name: "Family Meals", orders: "180 Orders", rev: "Rs 85,500", imgBg: "bg-red-100" },
    { rank: 3, name: "Crispy Chicken Bucket", orders: "150 Orders", rev: "Rs 67,500", imgBg: "bg-yellow-100" },
    { rank: 4, name: "Duo Box", orders: "120 Orders", rev: "Rs 47,400", imgBg: "bg-orange-50" },
    { rank: 5, name: "Fries (Regular)", orders: "110 Orders", rev: "Rs 19,800", imgBg: "bg-yellow-50" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex-1">
      <h3 className="font-bold text-gray-900 uppercase text-sm tracking-wider mb-6">TOP SELLING ITEMS</h3>
      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="text-sm font-bold text-gray-400 w-4">{item.rank}</div>
              <div className={`w-10 h-10 rounded-lg ${item.imgBg} flex items-center justify-center text-xl`}>
                🍔
              </div>
              <div>
                <div className="text-sm font-bold text-gray-900">{item.name}</div>
                <div className="text-xs text-gray-500">{item.orders}</div>
              </div>
            </div>
            <div className="text-sm font-bold text-gray-900">{item.rev}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AnalyticsWidgets() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 mt-6">
      <div className="flex-[1.5]">
        <SalesOverviewChart />
      </div>
      <div className="flex-1">
        <PaymentMethodsChart />
      </div>
      <div className="flex-1">
        <TopSellingItems />
      </div>
    </div>
  );
}
