"use client";

import { useState, useEffect } from "react";
import { OrderRow } from "@/app/actions/dashboard";
import { getDriversByBranch, Driver } from "@/app/actions/drivers";
import { assignDriverToOrder } from "@/app/actions/delivery";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  order: OrderRow | null;
  onDispatchComplete: () => void;
};

export function DriverDispatchModal({ isOpen, onClose, order, onDispatchComplete }: Props) {
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loadingDrivers, setLoadingDrivers] = useState(true);
  const [selectedDriver, setSelectedDriver] = useState<string>("");
  const [dispatching, setDispatching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !order) return;
    let active = true;

    // Fetch all drivers for now (can filter by branch if needed later)
    void getDriversByBranch("All Branches").then((data) => {
      if (!active) return;
      // Filter for active or on delivery drivers (allow batching)
      const available = data.filter(d => d.status === "Active" || d.status === "On Delivery");
      setDrivers(available);
      if (available.length > 0) setSelectedDriver(available[0].id);
      setLoadingDrivers(false);
    });

    return () => {
      active = false;
      setLoadingDrivers(true);
    };
  }, [isOpen, order]);

  if (!isOpen || !order) return null;

  const handleDispatch = async () => {
    if (!selectedDriver) return;
    setDispatching(true);
    setError(null);

    const driver = drivers.find(d => d.id === selectedDriver);
    if (!driver) return;

    // Open window synchronously to avoid popup blocker
    const newWindow = window.open("about:blank", "_blank");

    try {
      const result = await assignDriverToOrder(order.id, selectedDriver);
      if (result.success && result.token) {
        // Generate WhatsApp link
        const baseUrl = window.location.origin;
        const trackingLink = `${baseUrl}/delivery/${result.token}`;
        
        const message = `*New Delivery Assignment!* 🚀\n\n*Order:* #${order.order_number}\n*Customer:* ${order.customer_name}\n*Phone:* ${order.phone}\n*Address:* ${order.delivery_address}, ${order.city}\n\n*Items Total:* Rs ${order.grand_total}\n*Payment:* ${order.payment_method.toUpperCase()}\n\n*Tracking & Map:* ${trackingLink}`;
        
        // Format phone number to include country code (assuming Pakistan 92 for numbers starting with 0)
        let cleanPhone = driver.phone.replace(/[^0-9]/g, '');
        if (cleanPhone.startsWith('03') && cleanPhone.length === 11) {
          cleanPhone = '92' + cleanPhone.substring(1);
        }
        
        const waLink = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        
        if (newWindow) {
          newWindow.location.href = waLink;
        } else {
          // Fallback if popup blocker still blocked it
          window.location.href = waLink;
        }
        
        onDispatchComplete();
        onClose();
      } else {
        setError(result.error || "Failed to assign driver");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setDispatching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Dispatch Delivery</h2>
            <p className="text-sm text-gray-500 mt-1">Assign driver for Order #{order.order_number}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}
          
          {/* Order Details Preview */}
          <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Delivery Info</h3>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-gray-500">Customer:</span> <span className="font-medium text-gray-900">{order.customer_name} ({order.phone})</span></p>
              <p><span className="text-gray-500">Address:</span> <span className="font-medium text-gray-900">{order.delivery_address}, {order.city}</span></p>
              <p><span className="text-gray-500">Amount:</span> <span className="font-bold text-[#E63946]">Rs {order.grand_total} ({order.payment_method.toUpperCase()})</span></p>
            </div>
          </div>

          {/* Driver Selection */}
          <div>
            <label className="block text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide">Select Driver</label>
            {loadingDrivers ? (
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin"></div>
                Loading available drivers...
              </div>
            ) : drivers.length === 0 ? (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                No active drivers available right now.
              </div>
            ) : (
              <select
                value={selectedDriver}
                onChange={(e) => setSelectedDriver(e.target.value)}
                className="w-full bg-white border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-[#E63946] focus:border-[#E63946] block p-3 outline-none transition-colors"
              >
                {drivers.map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} ({d.phone}) - {d.branch} {d.status === "On Delivery" ? "(On Delivery)" : ""}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleDispatch}
            disabled={dispatching || !selectedDriver}
            className="px-5 py-2.5 bg-[#128C7E] hover:bg-[#075E54] text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
          >
            {dispatching ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21"/><path d="M9 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M14 10a.5.5 0 0 0 1 0V9a.5.5 0 0 0-1 0v1Z"/><path d="M9.5 13.5c1.5 1 3.5 1 5 0"/></svg>
            )}
            Dispatch & Send WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}
