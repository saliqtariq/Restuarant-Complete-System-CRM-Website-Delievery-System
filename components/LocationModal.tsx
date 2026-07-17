"use client";

import { useState, useEffect } from "react";
import { X, Search, MapPin, Store, Truck, Navigation, LocateFixed } from "lucide-react";
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
  { id: 1, name: "Abraham's Table - Main Branch", address: "M.M. Alam Road, Gulberg III, Lahore" },
  { id: 2, name: "Abraham's Table - DHA Phase 5", address: "Sector C, DHA Phase 5, Lahore" },
  { id: 3, name: "Abraham's Table - Johar Town", address: "Block R1, Johar Town, Lahore" },
];

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LocationModal({ isOpen, onClose }: LocationModalProps) {
  const [activeTab, setActiveTab] = useState<"delivery" | "pickup">("delivery");
  
  // Delivery State
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [mapPosition, setMapPosition] = useState<[number, number]>([31.5204, 74.3587]); // Default Lahore
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  
  // Pickup State
  const [selectedOutlet, setSelectedOutlet] = useState<number | null>(null);

  // Search logic using OpenStreetMap Nominatim
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 2 && activeTab === "delivery") {
        setIsSearching(true);
        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery + ", Lahore")}&format=json&limit=5`);
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

  const handleConfirm = () => {
    if (activeTab === "delivery") {
      alert(`Delivery location set to: ${selectedAddress || "Map Pin"}`);
    } else {
      const outlet = OUTLETS.find(o => o.id === selectedOutlet);
      alert(`Pickup outlet set to: ${outlet?.name}`);
    }
    onClose();
  };

  if (!isOpen) return null;

  const currentOutletName = activeTab === "pickup" && selectedOutlet ? OUTLETS.find(o => o.id === selectedOutlet)?.name : null;

  return (
    <div className="fixed inset-0 z-[100] flex bg-black/50 backdrop-blur-sm p-0 md:p-6 lg:p-12">
      <div className="bg-white w-full h-full max-w-[1400px] mx-auto md:rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row relative">
        
        {/* Left Sidebar */}
        <div className="w-full md:w-[400px] lg:w-[450px] shrink-0 flex flex-col bg-white z-10 shadow-[4px_0_24px_rgba(0,0,0,0.06)] h-1/2 md:h-full">
          
          {/* Toggle Pill */}
          <div className="bg-gray-100 p-1.5 rounded-full flex mx-6 mt-8 mb-8 shadow-inner">
            <button
              onClick={() => setActiveTab("pickup")}
              className={`flex-1 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                activeTab === "pickup" ? "bg-[#451400] text-white shadow-md" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Store size={18} /> Pickup
            </button>
            <button
              onClick={() => setActiveTab("delivery")}
              className={`flex-1 py-3 rounded-full font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2 ${
                activeTab === "delivery" ? "bg-[#451400] text-white shadow-md" : "text-gray-500 hover:text-gray-900"
              }`}
            >
              <Truck size={18} /> Delivery
            </button>
          </div>

          {/* Content Area */}
          <div className="flex-1 flex flex-col px-8 pb-8 overflow-y-auto min-h-0">
            {activeTab === "delivery" ? (
              <div className="flex flex-col h-full relative">
                {/* Search Input */}
                <div className="relative z-20 mb-8">
                  <div className="flex items-center border-b border-gray-300 py-2 focus-within:border-[#451400] transition-colors">
                    <input
                      type="text"
                      placeholder="Address"
                      className="flex-1 outline-none text-lg text-gray-800 bg-transparent placeholder-gray-400 font-medium"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {isSearching ? (
                      <div className="w-5 h-5 border-2 border-[#451400] border-t-transparent rounded-full animate-spin ml-3"></div>
                    ) : (
                      <Search size={24} className="text-[#b4860b] ml-3" strokeWidth={2.5} />
                    )}
                  </div>

                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-30">
                      {suggestions.map((loc, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSelectLocation(loc)}
                          className="w-full text-left px-5 py-4 hover:bg-gray-50 border-b border-gray-50 last:border-0 flex items-start gap-3 transition-colors"
                        >
                          <MapPin size={20} className="text-[#e5002a] mt-0.5 shrink-0" />
                          <span className="text-base text-gray-700 line-clamp-2">{loc.display_name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Empty / Selected State */}
                <div className="flex-1 flex flex-col items-center justify-center text-center mt-4">
                  {selectedAddress ? (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 text-green-600">
                        <MapPin size={40} />
                      </div>
                      <h3 className="text-xl font-bold text-[#111] mb-2">Location Selected</h3>
                      <p className="text-gray-600 mb-8 text-lg">{selectedAddress}</p>
                      <button
                        onClick={handleConfirm}
                        className="w-full bg-[#e5002a] hover:bg-[#c40024] text-white uppercase font-bold tracking-widest py-4 px-8 rounded-full transition-all shadow-md flex items-center justify-center gap-2 text-lg"
                        style={{ fontFamily: "var(--font-bebas)" }}
                      >
                        Confirm Delivery Here
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center opacity-60">
                      <div className="relative w-32 h-32 mb-6 grayscale opacity-40">
                         <Image src="/ChickenBucket.png" alt="Icon" fill className="object-contain" />
                      </div>
                      <p className="text-gray-500 font-medium text-lg mb-4 max-w-[280px]">
                        Search for a delivery address to get started
                      </p>
                      <p className="text-gray-400 text-sm max-w-[280px]">
                        Menu pricing for delivery is higher and fees apply.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col h-full gap-4 relative">
                <p className="text-gray-500 font-medium text-center mb-4">Select a branch near you to pick up your order.</p>
                <div className="space-y-4 flex-1 overflow-y-auto pr-2">
                  {OUTLETS.map((outlet) => (
                    <label
                      key={outlet.id}
                      className={`flex items-start p-5 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedOutlet === outlet.id ? "border-[#451400] bg-[#451400]/5 shadow-sm" : "border-gray-200 bg-white hover:border-[#451400]/30"
                      }`}
                    >
                      <input
                         type="radio"
                         name="outlet"
                         value={outlet.id}
                         checked={selectedOutlet === outlet.id}
                         onChange={() => setSelectedOutlet(outlet.id)}
                         className="mt-1 w-5 h-5 text-[#451400] accent-[#451400] shrink-0"
                      />
                      <div className="ml-4">
                         <h4 className="text-xl font-bold uppercase text-[#111] m-0 leading-tight" style={{ fontFamily: "var(--font-bebas)" }}>{outlet.name}</h4>
                         <p className="text-gray-500 text-sm mt-1.5">{outlet.address}</p>
                      </div>
                    </label>
                  ))}
                </div>
                
                {selectedOutlet && (
                  <div className="pt-4 border-t border-gray-100 mt-2 shrink-0">
                    <button
                      onClick={handleConfirm}
                      className="w-full bg-[#e5002a] hover:bg-[#c40024] text-white uppercase font-bold tracking-widest py-4 px-8 rounded-full transition-all shadow-md flex items-center justify-center gap-2 text-lg"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      Confirm Pickup
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Map Area */}
        <div className="flex-1 relative bg-gray-100 h-1/2 md:h-full z-0 order-first md:order-last">
          
          {/* Floating Pill Status */}
          {(selectedAddress || currentOutletName) && (
            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white rounded-full shadow-lg px-6 py-3 flex items-center gap-3 z-20 whitespace-nowrap hidden sm:flex">
               {activeTab === "pickup" ? <Store size={20} className="text-[#451400]" /> : <Truck size={20} className="text-[#451400]" />}
               <div className="flex flex-col">
                 <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">{activeTab === "pickup" ? "PICKUP FROM" : "DELIVERING TO"}</span>
                 <span className="text-sm font-bold text-[#111]">{activeTab === "pickup" ? currentOutletName : selectedAddress}</span>
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
