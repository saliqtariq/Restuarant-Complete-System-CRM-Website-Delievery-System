"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronDown, ShoppingBag, Truck, CheckCheck } from "lucide-react";
import { useNotifications } from "./OrderNotificationProvider";

function timeAgo(dateStr: string) {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function Header() {
  const { notifications, unreadCount, markAllRead } = useNotifications();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setDropdownOpen((prev) => !prev);
    if (!dropdownOpen && unreadCount > 0) {
      markAllRead();
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-10">
      {/* Hamburger + Search */}
      <div className="flex items-center gap-4 flex-1">
        <button className="text-gray-500 hover:text-gray-700 transition-colors p-1">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <div className="relative w-full max-w-sm">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
            <Search className="w-4 h-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full py-2 pl-10 pr-4 text-sm text-gray-700 bg-gray-50 rounded-full border border-gray-200 focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none placeholder-gray-400"
            placeholder="Search orders, customers, items..."
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-3">

        {/* Notification Bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            id="notification-bell-btn"
            onClick={handleBellClick}
            className="relative p-2 text-gray-500 hover:text-gray-700 transition-colors rounded-full hover:bg-gray-100"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1 min-w-[16px] h-4 bg-red-500 border border-white rounded-full flex items-center justify-center text-white font-bold"
                style={{ fontSize: "9px", padding: "0 3px" }}
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </span>
            )}
            {unreadCount === 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gray-300 border border-white rounded-full" />
            )}
          </button>

          {/* Dropdown */}
          {dropdownOpen && (
            <div
              className="absolute right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              style={{ width: "340px", top: "100%", zIndex: 50 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <div>
                  <span className="text-sm font-bold text-gray-900">Notifications</span>
                  {notifications.length > 0 && (
                    <span className="ml-2 text-xs text-gray-400">{notifications.length} total</span>
                  )}
                </div>
                {notifications.length > 0 && (
                  <button
                    onClick={markAllRead}
                    className="flex items-center gap-1 text-xs text-red-500 hover:text-red-700 font-medium transition-colors"
                  >
                    <CheckCheck size={13} />
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="overflow-y-auto" style={{ maxHeight: "360px" }}>
                {notifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <Bell className="w-8 h-8 text-gray-200 mb-2" />
                    <p className="text-sm text-gray-400 font-medium">No notifications yet</p>
                    <p className="text-xs text-gray-300 mt-1">New orders will appear here</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                      style={{ background: n.read ? "transparent" : "rgba(230,57,70,0.03)" }}
                    >
                      {/* Icon */}
                      <div
                        className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: "rgba(230,57,70,0.1)" }}
                      >
                        {n.order_type === "pickup" ? (
                          <ShoppingBag size={14} color="#E63946" />
                        ) : (
                          <Truck size={14} color="#E63946" />
                        )}
                      </div>

                      {/* Text */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-gray-900 truncate">
                            {n.customer_name}
                          </span>
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                          )}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          #{n.order_number} · RS {Number(n.grand_total).toLocaleString()}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-0.5 capitalize">
                          {n.order_type} · {timeAgo(n.created_at)}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200" />

        {/* User Profile */}
        <div className="flex items-center gap-2.5 cursor-pointer hover:bg-gray-50 rounded-xl px-2 py-1.5 transition-colors">
          <div className="w-9 h-9 rounded-full bg-slate-800 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            SA
          </div>
          <div className="hidden md:block">
            <div className="text-sm font-bold text-gray-900 leading-none">Saliq Admin</div>
            <div className="text-[11px] text-gray-400 mt-0.5">Administrator</div>
          </div>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </div>
      </div>
    </header>
  );
}
