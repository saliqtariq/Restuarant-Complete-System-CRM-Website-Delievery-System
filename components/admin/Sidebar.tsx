"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  ClipboardList,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  Users,
  MenuSquare,
  CreditCard,
  CalendarDays,
  MapPin,
  Tag,
  Star,
  BarChart3,
  LogOut,
  X,
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
  const [mobileOpen, setMobileOpen] = useState(false);

  // Listen for toggle event from the Header hamburger button
  useEffect(() => {
    const handleToggle = () => setMobileOpen((prev) => !prev);
    window.addEventListener("toggle-admin-sidebar", handleToggle);
    return () => window.removeEventListener("toggle-admin-sidebar", handleToggle);
  }, []);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, badge: null },
    { name: "Orders", href: "/dashboard/orders", icon: ClipboardList, badge: counts?.orders ? counts.orders : null },
    { name: "Pickup Orders", href: "/dashboard/pickup", icon: ShoppingBag, badge: counts?.pickup ? counts.pickup : null },
    { name: "Delivery Orders", href: "/dashboard/delivery", icon: Truck, badge: counts?.delivery ? counts.delivery : null },
    { name: "Catering", href: "/dashboard/catering", icon: UtensilsCrossed, badge: null },
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard, badge: null },
    { name: "Delivery Drivers Management", href: "/dashboard/drivers", icon: MapPin, badge: null },
    { name: "Coupons & Offers", href: "/dashboard/coupons", icon: Tag, badge: null },
    { name: "Customers", href: "/dashboard/customers", icon: Users, badge: null },
    { name: "Reservations", href: "/dashboard/reservations", icon: CalendarDays, badge: null },
    { name: "Reviews", href: "/dashboard/reviews", icon: Star, badge: null },
    { name: "Reports & Analytics", href: "/dashboard/reports", icon: BarChart3, badge: null },

  ];

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <Image
          src="/Mainlogotransparent.png"
          alt="Restaurant Logo"
          width={120}
          height={45}
          className="object-contain"
          priority
        />
        {/* Close button — mobile only */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden text-white/70 hover:text-white p-1 -mr-1 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={22} />
        </button>
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
                <span className="bg-[#E63946] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-5 text-center">
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
      {/* Bottom spacing */}
      <div className="p-3 pb-4">
        <div className="rounded-xl" style={{ minHeight: 120 }} />
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar — always visible on lg+ */}
      <aside className="hidden lg:flex w-55 shrink-0 bg-[#3B0A0A] text-white flex-col h-screen sticky top-0 overflow-y-auto sidebar-scroll">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar — slide in from left */}
      <aside
        className={`fixed top-0 left-0 h-full w-65 bg-[#3B0A0A] text-white flex flex-col z-50 lg:hidden transform transition-transform duration-300 ease-in-out overflow-y-auto sidebar-scroll ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
