"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Phone, Clock, Navigation, ShoppingBag, Truck, X } from "lucide-react";
import { useCartStore } from "@/lib/cartStore";

const LOCATIONS = [
  {
    id: "gulberg",
    name: "Abraham's Table - Main Branch (Gulberg)",
    city: "Lahore",
    area: "Gulberg III",
    address: "M.M. Alam Road, Gulberg III, Lahore, Punjab",
    phone: "0335-8746804",
    hours: "12:00 PM - 02:00 AM Daily",
    mapUrl: "https://maps.google.com/?q=M.M.+Alam+Road+Gulberg+III+Lahore",
    tag: "Main Branch"
  },
  {
    id: "dha",
    name: "Abraham's Table - DHA Phase 5",
    city: "Lahore",
    area: "DHA Phase 5",
    address: "Sector C, Commercial Area, DHA Phase 5, Lahore, Punjab",
    phone: "0335-8746804",
    hours: "12:00 PM - 02:00 AM Daily",
    mapUrl: "https://maps.google.com/?q=DHA+Phase+5+Sector+C+Lahore",
    tag: "Express & Dining"
  },
  {
    id: "johar-town",
    name: "Abraham's Table - Johar Town",
    city: "Lahore",
    area: "Johar Town",
    address: "Block R1, Main Boulevard, Johar Town, Lahore, Punjab",
    phone: "0335-8746804",
    hours: "12:00 PM - 02:00 AM Daily",
    mapUrl: "https://maps.google.com/?q=Johar+Town+Block+R1+Lahore",
    tag: "Family Dining"
  }
];

export default function LocationsPage() {
  const router = useRouter();
  const setLocation = useCartStore((s) => s.setLocation);

  const [selectedLocation, setSelectedLocation] = useState<typeof LOCATIONS[0] | null>(null);
  const [showDeliveryInput, setShowDeliveryInput] = useState(false);
  const [userDeliveryAddress, setUserDeliveryAddress] = useState("");
  const [addressError, setAddressError] = useState("");

  const handlePickup = () => {
    if (!selectedLocation) return;
    setLocation("pickup", selectedLocation.address);
    setSelectedLocation(null);
    setShowDeliveryInput(false);
    setUserDeliveryAddress("");
    router.push("/menu");
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userDeliveryAddress.trim()) {
      setAddressError("Please enter your delivery address");
      return;
    }

    setLocation("delivery", userDeliveryAddress.trim());
    setSelectedLocation(null);
    setShowDeliveryInput(false);
    setUserDeliveryAddress("");
    setAddressError("");
    router.push("/menu");
  };

  const handleCloseModal = () => {
    setSelectedLocation(null);
    setShowDeliveryInput(false);
    setUserDeliveryAddress("");
    setAddressError("");
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7]">
      {/* Header Banner */}
      <div className="w-full bg-[#451400] text-white py-14 px-6 text-center">
        <h1
          className="text-4xl md:text-6xl font-bold uppercase tracking-wider mb-2"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          3 Abraham&apos;s Table Locations in Lahore
        </h1>
        <p className="text-amber-200/80 text-sm md:text-base font-medium">
          Dine-in, Pickup & Delivery Available Across All Branches
        </p>
      </div>

      {/* Main Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        
        {/* City Summary Section */}
        <div className="mb-10 pb-6 border-b border-amber-900/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-[#451400] uppercase" style={{ fontFamily: "var(--font-anton)" }}>
              LAHORE ({LOCATIONS.length})
            </h2>
            <p className="text-gray-600 text-sm">Select a branch below for directions, order pickup, or contact details.</p>
          </div>
          <Link
            href="/menu"
            className="inline-flex items-center justify-center bg-[#451400] text-white px-6 py-2.5 rounded text-sm font-bold uppercase tracking-wider hover:bg-[#7a2e15] transition-colors"
            style={{ fontFamily: "var(--font-anton)" }}
          >
            Order Online Now
          </Link>
        </div>

        {/* Location Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {LOCATIONS.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-xl shadow-sm border border-amber-900/10 overflow-hidden flex flex-col hover:shadow-md transition-shadow"
            >
              {/* Card Header */}
              <div className="bg-[#451400]/5 p-5 border-b border-amber-900/10 flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase bg-[#451400] text-white px-2.5 py-1 rounded">
                    {loc.tag}
                  </span>
                  <h3
                    className="text-xl font-bold text-[#451400] uppercase mt-3 leading-tight"
                    style={{ fontFamily: "var(--font-anton)" }}
                  >
                    {loc.area}
                  </h3>
                </div>
                <MapPin className="text-[#a32a22] shrink-0" size={24} />
              </div>

              {/* Card Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start gap-2.5">
                    <MapPin size={16} className="text-[#451400] shrink-0 mt-0.5" />
                    <span>{loc.address}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone size={16} className="text-[#451400] shrink-0" />
                    <a href={`tel:${loc.phone.replace(/-/g, '')}`} className="font-semibold text-[#451400] hover:underline">
                      {loc.phone}
                    </a>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock size={16} className="text-[#451400] shrink-0" />
                    <span className="text-xs font-medium text-gray-600">{loc.hours}</span>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-4 border-t border-gray-100 flex items-center gap-3">
                  <a
                    href={loc.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 border border-[#451400] text-[#451400] py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#451400] hover:text-white transition-colors"
                  >
                    <Navigation size={14} />
                    Get Directions
                  </a>
                  <button
                    onClick={() => {
                      setSelectedLocation(loc);
                      setShowDeliveryInput(false);
                    }}
                    className="flex-1 inline-flex items-center justify-center bg-[#a32a22] text-white py-2 rounded text-xs font-bold uppercase tracking-wider hover:bg-[#7a2e15] transition-colors cursor-pointer"
                  >
                    Order Here
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Order Mode Selection Modal */}
      {selectedLocation && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {!showDeliveryInput ? (
              <>
                <div className="text-center mb-6">
                  <span className="text-[11px] font-bold uppercase tracking-wider bg-[#a32a22]/10 text-[#a32a22] px-3 py-1 rounded-full">
                    {selectedLocation.area} Branch
                  </span>
                  <h3 className="text-2xl font-bold text-[#451400] uppercase mt-2" style={{ fontFamily: "var(--font-anton)" }}>
                    How would you like your order?
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {selectedLocation.address}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Pickup Option */}
                  <button
                    onClick={handlePickup}
                    className="flex flex-col items-center justify-center p-5 border-2 border-amber-900/10 rounded-xl hover:border-[#451400] hover:bg-[#451400]/5 transition-all group cursor-pointer text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#451400]/10 flex items-center justify-center text-[#451400] group-hover:bg-[#451400] group-hover:text-white transition-colors mb-3">
                      <ShoppingBag size={24} />
                    </div>
                    <span className="font-bold text-[#451400] text-sm uppercase tracking-wide">Pickup</span>
                    <span className="text-[11px] text-gray-500 mt-1">Collect from branch</span>
                  </button>

                  {/* Delivery Option */}
                  <button
                    onClick={() => {
                      setShowDeliveryInput(true);
                      setUserDeliveryAddress(`${selectedLocation.area}, Lahore`);
                    }}
                    className="flex flex-col items-center justify-center p-5 border-2 border-amber-900/10 rounded-xl hover:border-[#a32a22] hover:bg-[#a32a22]/5 transition-all group cursor-pointer text-center"
                  >
                    <div className="w-12 h-12 rounded-full bg-[#a32a22]/10 flex items-center justify-center text-[#a32a22] group-hover:bg-[#a32a22] group-hover:text-white transition-colors mb-3">
                      <Truck size={24} />
                    </div>
                    <span className="font-bold text-[#a32a22] text-sm uppercase tracking-wide">Delivery</span>
                    <span className="text-[11px] text-gray-500 mt-1">Delivered to your door</span>
                  </button>
                </div>
              </>
            ) : (
              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div className="text-center mb-4">
                  <div className="w-12 h-12 mx-auto rounded-full bg-[#a32a22]/10 flex items-center justify-center text-[#a32a22] mb-2">
                    <Truck size={24} />
                  </div>
                  <h3 className="text-2xl font-bold text-[#451400] uppercase" style={{ fontFamily: "var(--font-anton)" }}>
                    Enter Delivery Address
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Delivering from {selectedLocation.area} branch
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#451400] uppercase mb-1">
                    Your Full Delivery Address
                  </label>
                  <input
                    type="text"
                    required
                    value={userDeliveryAddress}
                    onChange={(e) => {
                      setUserDeliveryAddress(e.target.value);
                      if (addressError) setAddressError("");
                    }}
                    placeholder="House / Street / Block / Area, Lahore"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[#a32a22] focus:ring-1 focus:ring-[#a32a22]"
                    autoFocus
                  />
                  {addressError && (
                    <p className="text-xs text-red-600 font-medium mt-1">{addressError}</p>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowDeliveryInput(false)}
                    className="flex-1 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-2.5 bg-[#a32a22] text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#7a2e15] transition-colors"
                    style={{ fontFamily: "var(--font-anton)" }}
                  >
                    Confirm Delivery
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

