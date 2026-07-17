"use client";

import { useState, useEffect } from "react";
import { X, Search, MapPin, CheckCircle2 } from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";

// Dynamically import MapComponent to disable SSR
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center text-gray-500">Loading map...</div>,
});

// Dummy Pickup Data
const OUTLETS = [
  { id: 1, name: "Abraham's Table - Main Branch", address: "M.M. Alam Road, Gulberg III, Lahore", position: [31.5102, 74.3441] as [number, number] },
  { id: 2, name: "Abraham's Table - DHA Phase 5", address: "Sector C, DHA Phase 5, Lahore", position: [31.4621, 74.4093] as [number, number] },
  { id: 3, name: "Abraham's Table - Johar Town", address: "Block R1, Johar Town, Lahore", position: [31.4697, 74.2728] as [number, number] },
];

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const setLocation = useCartStore((s) => s.setLocation);
  const [activeTab, setActiveTab] = useState<"delivery" | "pickup">("pickup");

  // Delivery State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number]>([31.5204, 74.3587]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  // Pickup State
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);

  // Search logic using OpenStreetMap Nominatim
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2 && activeTab === "delivery") {
        setIsSearching(true);
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + ", Lahore")}&format=json&limit=5`
          );
          const data = await res.json();
          setSuggestions(data);
        } catch (err) {
          console.error("Geocoding error", err);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, activeTab]);

  const handleSelectLocation = (location: any) => {
    setMapPosition([parseFloat(location.lat), parseFloat(location.lon)]);
    const shortAddress = location.display_name.split(",").slice(0, 2).join(",");
    setSelectedAddress(shortAddress);
    setSearchQuery("");
    setSuggestions([]);
  };

  const handleSelectOutlet = (outlet: typeof OUTLETS[0]) => {
    setSelectedOutlet(outlet.id);
    setMapPosition(outlet.position);
  };

  const handleConfirm = () => {
    if (activeTab === "delivery") {
      const address = selectedAddress || searchQuery.trim();
      if (address) {
        setLocation("delivery", address);
      }
    } else {
      const outlet = OUTLETS.find((o) => o.id === selectedOutlet);
      if (outlet) {
        setLocation("pickup", outlet.address);
      }
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentOutletName =
    activeTab === "pickup" && selectedOutlet
      ? OUTLETS.find((o) => o.id === selectedOutlet)?.name
      : null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-black/60 backdrop-blur-sm p-0 md:p-6 lg:p-10">
      <div className="bg-white w-full h-full max-w-[1400px] mx-auto md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">

        {/* ─── Left Sidebar ─── */}
        <div className="w-full md:w-[420px] lg:w-[460px] shrink-0 flex flex-col bg-[#faf8f5] z-10 shadow-[4px_0_30px_rgba(0,0,0,0.07)] h-1/2 md:h-full">

          {/* Toggle Pill — pinned at top */}
          <div className="px-7 pt-6 pb-0 shrink-0">
            <div className="flex rounded-full bg-white border border-[#e8e0d8] shadow-sm p-1.5 gap-1">

              {/* PICKUP */}
              <button
                onClick={() => setActiveTab("pickup")}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-full font-bold tracking-[0.12em] uppercase text-sm transition-all duration-300 ${
                  activeTab === "pickup"
                    ? "bg-[#3b1200] text-white shadow-[0_4px_14px_rgba(59,18,0,0.35)]"
                    : "text-[#a0826d] hover:text-[#3b1200]"
                }`}
              >
                {/* Fork & knife / store icon */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className={activeTab === "pickup" ? "text-white" : "text-[#a0826d]"}
                >
                  <path d="M3 2v6c0 1.66 1.34 3 3 3h0v11h2V11h0c1.66 0 3-1.34 3-3V2H9v5H7V2H5v5H3V2H3z" fill="currentColor"/>
                  <path d="M16 2c-1.66 0-3 1.57-3 3.5V11h2.5v11H18V2h-2z" fill="currentColor"/>
                </svg>
                Pickup
              </button>

              {/* DELIVERY */}
              <button
                onClick={() => setActiveTab("delivery")}
                className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-full font-bold tracking-[0.12em] uppercase text-sm transition-all duration-300 ${
                  activeTab === "delivery"
                    ? "bg-[#3b1200] text-white shadow-[0_4px_14px_rgba(59,18,0,0.35)]"
                    : "text-[#a0826d] hover:text-[#3b1200]"
                }`}
              >
                {/* Car / delivery icon */}
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"
                  className={activeTab === "delivery" ? "text-white" : "text-[#a0826d]"}
                >
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="currentColor"/>
                </svg>
                Delivery
              </button>

            </div>
          </div>


          {/* Content Area */}
          <div className="flex-1 flex flex-col px-8 pt-6 pb-8 overflow-y-auto min-h-0">

            {/* ── DELIVERY TAB ── */}
            {activeTab === "delivery" ? (
              <div className="flex flex-col h-full relative">

                {/* Search Input */}
                <div className="relative z-20 mb-6">
                  <div
                    className={`flex items-center bg-white border rounded-xl px-4 py-4 transition-all shadow-sm ${
                      isSearching
                        ? "border-[#3b1200]"
                        : "border-[#ddd] focus-within:border-[#3b1200] focus-within:shadow-md"
                    }`}
                  >
                    <input
                      type="text"
                      placeholder="City, Area, or Street Address"
                      className="flex-1 outline-none text-[15px] text-gray-800 bg-transparent placeholder-gray-400 font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-[#3b1200] border-t-transparent rounded-full animate-spin ml-3 shrink-0" />
                    ) : (
                      <Search size={20} className="text-[#b4860b] ml-3 shrink-0" strokeWidth={2.5} />
                    )}
                  </div>

                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-30">
                      {suggestions.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full text-left px-5 py-4 hover:bg-[#faf8f5] border-b border-gray-50 last:border-0 flex items-start gap-3 transition-colors"
                        >
                          <MapPin size={18} className="text-[#e5002a] mt-0.5 shrink-0" />
                          <span className="text-[13px] text-gray-700 line-clamp-2">{loc.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Empty / Selected State */}
                <div className="flex-1 flex flex-col items-center justify-center text-center">
                  {selectedAddress || searchQuery.trim().length > 0 ? (
                    <div className="flex flex-col items-center w-full">
                      <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-5 text-green-500 shadow-sm">
                        <CheckCircle2 size={38} strokeWidth={1.5} />
                      </div>
                      <h3
                        className="text-[#3b1200] mb-1"
                        style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.05em", fontSize: "1.6rem" }}
                      >
                        {selectedAddress ? "Location Selected" : "Use This Address?"}
                      </h3>
                      <p className="text-gray-500 mb-8 text-[14px] max-w-[260px] leading-relaxed">
                        {selectedAddress || searchQuery}
                      </p>
                      <button
                        onClick={handleConfirm}
                        className="w-full bg-[#3b1200] hover:bg-[#5a1e00] text-white uppercase font-bold tracking-widest py-4 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                        style={{ fontFamily: "var(--font-bebas)", fontSize: "1.1rem" }}
                      >
                        Confirm Delivery Here
                      </button>
                    </div>
                  ) : (
                    /* Branded Empty State */
                    <div className="flex flex-col items-center select-none">
                      <div className="relative w-36 h-36 mb-5 opacity-[0.12]">
                        <Image src="/Mainlogowithnotext.png" alt="Watermark" fill className="object-contain" />
                      </div>
                      <p className="text-[#7a5c4a] font-semibold text-[15px] mb-2 max-w-[240px] leading-relaxed">
                        Find a location to order online, see a menu, and get info.
                      </p>
                      <p className="text-[#b09080] text-xs max-w-[220px] leading-relaxed">
                        Delivery pricing and fees may apply.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            ) : (
              /* ── PICKUP TAB ── */
              <div className="flex flex-col h-full gap-3 relative">
                <p className="text-[#7a5c4a] text-[13px] font-medium">
                  Select a branch near you to pick up your order.
                </p>

                <div
                  className="space-y-3 flex-1 min-h-0 pr-1 location-scroll"
                  style={{
                    overflowY: "auto",
                    scrollBehavior: "smooth",
                    WebkitOverflowScrolling: "touch",
                  }}
                >
                  {OUTLETS.map((outlet) => {
                    const isSelected = selectedOutlet === outlet.id;
                    return (
                      <label
                        key={outlet.id}
                        className={`flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-[#3b1200] bg-white shadow-md"
                            : "border-[#e8e0d8] bg-white hover:border-[#3b1200]/30 hover:shadow-sm"
                        }`}
                      >
                        {/* Custom Radio */}
                        <div
                          onClick={() => handleSelectOutlet(outlet)}
                          className={`mt-1 w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all cursor-pointer ${
                            isSelected ? "border-[#3b1200] bg-[#3b1200]" : "border-gray-300"
                          }`}
                        >
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <input
                          type="radio"
                          name="outlet"
                          value={outlet.id}
                          checked={isSelected}
                          onChange={() => handleSelectOutlet(outlet)}
                          className="sr-only"
                        />
                        <div className="ml-4 flex-1 mt-0.5">
                          <h4
                            className="font-bold text-[#3b1200] m-0 leading-tight text-[15px]"
                          >
                            {outlet.address}
                          </h4>
                          <p 
                            className="text-[#a0826d] uppercase mt-1.5 leading-relaxed"
                            style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.06em", fontSize: "1rem" }}
                          >
                            {outlet.name}
                          </p>
                        </div>
                        {isSelected && (
                          <CheckCircle2 size={20} className="text-[#3b1200] ml-3 mt-0.5 shrink-0" />
                        )}
                      </label>
                    );
                  })}
                </div>

                {selectedOutlet && (
                  <div className="pt-4 border-t border-[#e8e0d8] shrink-0">
                    <button
                      onClick={handleConfirm}
                      className="w-full bg-[#3b1200] hover:bg-[#5a1e00] text-white uppercase font-bold tracking-widest py-4 px-8 rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                      style={{ fontFamily: "var(--font-bebas)", fontSize: "1.1rem" }}
                    >
                      Confirm Pickup
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ─── Right Map Area ─── */}
        <div className="flex-1 relative bg-gray-100 h-1/2 md:h-full z-0 order-first md:order-last">

          {/* Floating Pill Status */}
          {(selectedAddress || currentOutletName) && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3 z-20 whitespace-nowrap hidden sm:flex">
              {activeTab === "pickup" ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#451400] shrink-0">
                  <path d="M3 2v6c0 1.66 1.34 3 3 3h0v11h2V11h0c1.66 0 3-1.34 3-3V2H9v5H7V2H5v5H3V2H3z" fill="currentColor"/>
                  <path d="M16 2c-1.66 0-3 1.57-3 3.5V11h2.5v11H18V2h-2z" fill="currentColor"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#451400] shrink-0">
                  <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z" fill="currentColor"/>
                </svg>
              )}
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  {activeTab === "pickup" ? "PICKUP FROM" : "DELIVERING TO"}
                </span>
                <span className="text-sm font-bold text-[#111] max-w-[200px] truncate">
                  {activeTab === "pickup" ? currentOutletName : selectedAddress || searchQuery}
                </span>
              </div>
            </div>
          )}

          {/* Floating Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 bg-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:text-red-600 hover:bg-gray-50 transition-all z-20"
          >
            <X size={24} strokeWidth={2.5} />
          </button>

          <MapComponent position={mapPosition} />
        </div>

      </div>
    </div>
  );
}
