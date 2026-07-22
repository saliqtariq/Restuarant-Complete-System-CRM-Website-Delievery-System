"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingBag,
  Truck,
  Users,
  MenuSquare,
  CreditCard,
  MapPin,
  Tag,
  Star,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";

type SidebarProps = {
  counts?: {
    orders: number;
    pickup: number;
    delivery: number;
  };
};
export function Sidebar({ counts }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
    { name: "Orders", href: "/dashboard/orders", icon: ClipboardList, badge: counts?.orders ? counts.orders : null },
    { name: "Pickup Orders", href: "/dashboard/pickup", icon: ShoppingBag, badge: counts?.pickup ? counts.pickup : null },
    { name: "Delivery Orders", href: "/dashboard/delivery", icon: Truck, badge: counts?.delivery ? counts.delivery : null },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard, badge: null },
    { name: "Delivery Drivers Management", href: "/dashboard/drivers", icon: MapPin, badge: null },
    { name: "Coupons & Offers", href: "/dashboard/coupons", icon: Tag, badge: null },
    { name: "Customers", href: "/dashboard/customers", icon: Users, badge: null },
    { name: "Menu Management", href: "/dashboard/menu", icon: MenuSquare, badge: null },
    { name: "Reviews", href: "/dashboard/reviews", icon: Star, badge: null },
    { name: "Reports & Analytics", href: "/dashboard/reports", icon: BarChart3, badge: null },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, badge: null },
  ];

  return (
    <aside className="w-[220px] shrink-0 bg-[#3B0A0A] text-white flex flex-col h-screen sticky top-0 overflow-y-auto">

      {/* Logo */}
      <div className="flex items-center justify-center px-4 pt-3 pb-1">
        <Image
          src="/Mainlogotransparent.png"
          alt="Restaurant Logo"
          width={120}
          height={45}
          className="object-contain"
          priority
        />
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-3 flex flex-col px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all mb-0.5 ${
                isActive
                  ? "bg-[#5A0A0A] font-semibold shadow-inner"
                  : "hover:bg-[#550E0E] text-gray-200"
              }`}
            >
              <div className="flex items-center gap-2.5 text-[13px]">
                <Icon size={16} className={isActive ? "text-white" : "text-gray-300"} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-[#E63946] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}

        <Link
          href="/admin/login"
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg hover:bg-[#550E0E] text-gray-200 mt-2 text-[13px] transition-all"
        >
          <LogOut size={16} className="text-gray-300" />
          Logout
        </Link>
      </nav>

      {/* Promo Card — matches Figma bottom card */}
      <div className="p-3 pb-4">
        <div className="bg-[#5A0A0A] rounded-xl p-3 relative overflow-hidden border border-[#7A1A1A]" style={{ minHeight: 120 }}>
          <div className="relative z-10">
            <h4 className="text-white font-extrabold text-base leading-tight uppercase">OUTLAW<br/>ZINGER</h4>
            <p className="text-gray-300 text-[10px] mt-0.5 mb-2">Today&apos;s Special</p>
            <button className="bg-[#E63946] hover:bg-red-600 text-white text-[10px] font-bold py-1.5 px-3 rounded transition-colors shadow-md">
              View Menu
            </button>
          </div>
          {/* Burger emoji as placeholder for the food image */}
          <div className="absolute right-0 bottom-0 text-[72px] leading-none select-none pointer-events-none" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}>
            🍔
          </div>
        </div>
      </div>
    </aside>
  );
}
