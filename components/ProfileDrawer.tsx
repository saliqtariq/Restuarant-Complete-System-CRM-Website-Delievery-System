"use client";

import { useState, useEffect, useRef } from "react";
import { X, FileText, MapPin, CreditCard, Heart, Loader2, Camera, ChevronLeft } from "lucide-react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/backend/supabase";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  user: SupabaseUser | null;
  handleSignOut: () => void;
}

export default function ProfileDrawer({ isOpen, onClose, user, handleSignOut }: ProfileDrawerProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [activeView, setActiveView] = useState<"main" | "orders" | "favorites" | "cards">("main");
  
  // Orders State
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Initialize form state when user changes or drawer opens
  useEffect(() => {
    const id = window.setTimeout(() => {
      if (!user?.user_metadata) return;
      setFirstName(user.user_metadata.first_name || "");
      setLastName(user.user_metadata.last_name || "");
      setPhone(user.user_metadata.phone || "");
      setDob(user.user_metadata.dob || "");
      setGender(user.user_metadata.gender || "");
      setAddress(user.user_metadata.address || "");
      setCity(user.user_metadata.city || "");
      setAvatarFile(null);
      setAvatarPreview(null);
    }, 0);

    return () => window.clearTimeout(id);
  }, [user, isOpen]);

  // Fetch orders when orders view is active
  useEffect(() => {
    if (activeView === "orders" && user) {
      setLoadingOrders(true);
      supabase
        .from("orders")
        .select("order_number, created_at, grand_total, status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) {
            setOrders(data);
          }
          setLoadingOrders(false);
        });
    }
  }, [activeView, user]);

  const fullName = `${user?.user_metadata?.first_name || ""} ${user?.user_metadata?.last_name || ""}`.trim() || "PROFILE";
  const initial = fullName.charAt(0).toUpperCase() || "U";
  const currentAvatar = user?.user_metadata?.avatar_url || null;
  const displayPhone = user?.user_metadata?.phone || "Add phone number";
  const displayEmail = user?.email || "";

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    let avatarUrl = user?.user_metadata?.avatar_url || null;

    // Upload avatar if a new file was selected
    if (avatarFile) {
      const fileExt = avatarFile.name.split(".").pop();
      if (!user) return;

      const filePath = `avatars/${user.id}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);
        avatarUrl = urlData.publicUrl;
      }
    }

    const { error } = await supabase.auth.updateUser({
      data: {
        first_name: firstName,
        last_name: lastName,
        phone: phone,
        dob: dob,
        gender: gender,
        address: address,
        city: city,
        avatar_url: avatarUrl,
      }
    });

    if (!error) {
      // Force a session refresh to trigger onAuthStateChange in Navbar
      await supabase.auth.refreshSession();
      setIsEditing(false);
    } else {
      console.error("Error updating profile:", error.message);
      // In a real app we'd show a toast here
    }
    
    setLoading(false);
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60]"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Decorative Top Accent Line */}
        <div className="w-full h-2 bg-gradient-to-r from-[#e5002a] via-[#4a1c0d] to-[#e5002a]"></div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 relative">
          <h2 
            className="text-3xl font-bold uppercase text-black m-0 tracking-wider w-full text-center" 
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            {fullName}
          </h2>
          <button
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 bg-[#e5002a] text-white p-1 rounded hover:bg-[#c40024] transition-colors"
            aria-label="Close profile"
          >
            <X size={24} strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col">
          {activeView === "main" ? (
            <>
              {/* User Info / Edit Card */}
          <div className="bg-[#f4f4f4] border-y border-gray-200 p-6">
            {!isEditing ? (
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {/* Initial Avatar */}
                  {currentAvatar ? (
                    <img src={currentAvatar} alt="Profile" className="w-14 h-14 rounded-full object-cover shrink-0" />
                  ) : (
                    <div className="w-14 h-14 bg-[#d9d9d9] rounded-full flex items-center justify-center text-black text-2xl font-bold shrink-0">
                      {initial}
                    </div>
                  )}
                  {/* Contact Info */}
                  <div className="flex flex-col text-black font-medium">
                    <span className="text-base">{displayPhone}</span>
                    <span className="text-sm text-gray-600">{displayEmail}</span>
                  </div>
                </div>
                {/* Edit Button */}
                <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-white text-[#e5002a] border border-[#e5002a] px-4 py-1.5 rounded-sm font-bold tracking-wide hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Edit
                </button>
              </div>
            ) : (
              <form onSubmit={handleSave} className="flex flex-col gap-3">
                {/* Profile Picture Upload */}
                <div className="flex justify-center mb-2">
                  <div 
                    className="relative w-20 h-20 cursor-pointer group"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {avatarPreview || currentAvatar ? (
                      <img 
                        src={avatarPreview || currentAvatar!} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover border-2 border-gray-300"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-[#d9d9d9] rounded-full flex items-center justify-center text-black text-3xl font-bold">
                        {initial}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Camera size={24} className="text-white" />
                    </div>
                    <input 
                      ref={fileInputRef}
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-black mb-1 font-medium">First Name</label>
                    <input 
                      type="text" 
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:border-[#e5002a]"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1 font-medium">Last Name</label>
                    <input 
                      type="text" 
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:border-[#e5002a]"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs text-black mb-1 font-medium">Phone Number</label>
                  <input 
                    type="tel" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:border-[#e5002a]"
                    placeholder="e.g. 03358746804"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-black mb-1 font-medium">Date of Birth</label>
                    <input 
                      type="date" 
                      value={dob} 
                      onChange={(e) => setDob(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:border-[#e5002a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1 font-medium">Gender</label>
                    <select 
                      value={gender} 
                      onChange={(e) => setGender(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:border-[#e5002a]"
                    >
                      <option value="" disabled>Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Others">Others</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-black mb-1 font-medium">City</label>
                    <input 
                      type="text" 
                      value={city} 
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:border-[#e5002a]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-black mb-1 font-medium">Address</label>
                    <input 
                      type="text" 
                      value={address} 
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-white border border-gray-300 rounded px-3 py-2 text-sm text-black focus:outline-none focus:border-[#e5002a]"
                    />
                  </div>
                </div>

                <div className="flex gap-2 mt-2">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 bg-gray-200 text-black py-2 rounded-sm font-bold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-[#e5002a] text-white py-2 rounded-sm font-bold flex items-center justify-center gap-2 hover:bg-[#c40024] transition-colors disabled:opacity-50"
                  >
                    {loading && <Loader2 size={16} className="animate-spin" />}
                    Save
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Menu Items */}
          <div className="flex flex-col py-2">
            <button 
              onClick={() => setActiveView("orders")}
              className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors w-full text-left cursor-pointer"
            >
              <FileText className="text-[#4a1c10]" size={24} />
              <span className="text-xl text-black font-medium tracking-wide">Order History</span>
            </button>

            <button 
              onClick={() => setActiveView("cards")}
              className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors w-full text-left cursor-pointer"
            >
              <CreditCard className="text-[#4a1c10]" size={24} />
              <span className="text-xl text-black font-medium tracking-wide">My Cards</span>
            </button>
            <button 
              onClick={() => setActiveView("favorites")}
              className="flex items-center gap-4 px-6 py-5 hover:bg-gray-50 transition-colors w-full text-left cursor-pointer"
            >
              <Heart className="text-[#4a1c10]" size={24} />
              <span className="text-xl text-black font-medium tracking-wide">My Favorites</span>
            </button>
          </div>
          </>
          ) : activeView === "orders" ? (
            /* Order History View */
            <div className="flex-1 flex flex-col bg-[#f4f4f4] min-h-full">
              <div className="flex items-center gap-3 px-6 py-5">
                <button 
                  onClick={() => setActiveView("main")} 
                  className="flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] border-[#e5002a] text-[#e5002a] hover:bg-red-50 transition-colors shrink-0"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                </button>
                <h3 className="text-2xl font-bold text-black uppercase m-0 mt-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  Order History
                </h3>
              </div>
              
              <div className="flex-1 flex flex-col p-6 overflow-y-auto">
                {loadingOrders ? (
                  <div className="flex flex-col items-center justify-center flex-1">
                    <Loader2 className="animate-spin text-[#e5002a] mb-4" size={32} />
                    <p className="text-gray-500">Loading orders...</p>
                  </div>
                ) : orders.length === 0 ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-center">
                    <h4 className="text-2xl font-bold text-black mb-8 tracking-tight" style={{ fontFamily: "var(--font-bebas)" }}>
                      No Order Found? Start Ordering
                    </h4>
                    <button 
                      onClick={() => {
                        onClose();
                      }}
                      className="bg-[#e5002a] text-white px-8 py-3 rounded-md font-bold uppercase tracking-wider hover:bg-[#c40024] transition-colors"
                    >
                      EXPLORE MENU
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map((order, idx) => (
                      <div key={idx} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="text-black font-bold uppercase">{order.order_number}</p>
                            <p className="text-xs text-gray-500">
                              {new Date(order.created_at).toLocaleDateString()} {new Date(order.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                            order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {order.status.replace("_", " ")}
                          </span>
                        </div>
                        <div className="pt-2 border-t border-gray-100 flex justify-between items-center mt-2">
                          <span className="text-sm text-gray-600">Total</span>
                          <span className="text-base font-bold text-[#e5002a]">Rs {order.grand_total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          ) : activeView === "favorites" ? (
            /* Favorites View */
            <div className="flex-1 flex flex-col bg-[#f4f4f4] min-h-full">
              <div className="flex items-center gap-3 px-6 py-5">
                <button 
                  onClick={() => setActiveView("main")} 
                  className="flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] border-[#e5002a] text-[#e5002a] hover:bg-red-50 transition-colors shrink-0"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                </button>
                <h3 className="text-2xl font-bold text-black uppercase m-0 mt-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  My Favorites
                </h3>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <Heart className="text-gray-300 mb-6" size={80} strokeWidth={1} />
                <h4 className="text-2xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: "var(--font-bebas)" }}>
                  No Favorites Yet
                </h4>
                <p className="text-gray-500 text-sm mb-8">
                  Tap the heart icon on any item to add it to your favorites.
                </p>
                <button 
                  onClick={() => {
                    onClose();
                  }}
                  className="bg-[#e5002a] text-white px-8 py-3 rounded-md font-bold uppercase tracking-wider hover:bg-[#c40024] transition-colors"
                >
                  EXPLORE MENU
                </button>
              </div>
            </div>
          ) : (
            /* Cards View */
            <div className="flex-1 flex flex-col bg-[#f4f4f4] min-h-full">
              <div className="flex items-center gap-3 px-6 py-5">
                <button 
                  onClick={() => setActiveView("main")} 
                  className="flex items-center justify-center w-6 h-6 rounded-full border-[1.5px] border-[#e5002a] text-[#e5002a] hover:bg-red-50 transition-colors shrink-0"
                >
                  <ChevronLeft size={16} strokeWidth={3} />
                </button>
                <h3 className="text-2xl font-bold text-black uppercase m-0 mt-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  My Cards
                </h3>
              </div>
              
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                <CreditCard className="text-gray-300 mb-6" size={80} strokeWidth={1} />
                <h4 className="text-2xl font-bold text-black mb-4 tracking-tight" style={{ fontFamily: "var(--font-bebas)" }}>
                  No Card Added Yet
                </h4>
                <p className="text-gray-500 text-sm mb-8">
                  Add a credit or debit card to checkout faster on your next order.
                </p>
                <button 
                  onClick={() => {
                    // Placeholder for Add Card action
                  }}
                  className="bg-[#e5002a] text-white px-8 py-3 rounded-md font-bold uppercase tracking-wider hover:bg-[#c40024] transition-colors"
                >
                  ADD NEW CARD
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Logout (Only show on main view) */}
        {activeView === "main" && (
          <div className="p-6 flex justify-center border-t border-gray-100 mt-auto">
            <button
              onClick={() => {
                handleSignOut();
                onClose();
              }}
              className="bg-[#e5002a] hover:bg-[#c40024] text-white uppercase tracking-widest font-bold px-10 py-3 rounded-sm transition-colors cursor-pointer w-full"
              style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem" }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
