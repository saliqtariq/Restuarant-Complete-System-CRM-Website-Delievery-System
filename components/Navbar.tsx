"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Menu, X, Minus, Plus, Trash2, CircleUserRound } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/backend/supabase";
import { useCartStore } from "@/lib/cartStore";
import ProfileDrawer from "./ProfileDrawer";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const totalItems = useCartStore((s) => s.totalItems);
  const totalPrice = useCartStore((s) => s.totalPrice);

  const closeMobile = () => setMobileOpen(false);
  const closeCart = () => setCartOpen(false);

  const itemCount = totalItems();
  const total = totalPrice();

  return (
    <>
      <nav className="w-full h-24 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 shrink-0 relative z-50">

        {/* Left Group: Logo and Main Menu */}
        <div className="flex items-center space-x-6 lg:space-x-10">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" onClick={closeMobile}>
              <Image
                src="/Mainlogo.png"
                alt="Restaurant Logo"
                width={120}
                height={120}
                className="object-contain h-20 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-[#4a1c10] font-[family-name:var(--font-anton)] text-xl tracking-widest pt-3 whitespace-nowrap">
            <Link
              href="/#explore-menu"
              className="group relative pb-2 transition-colors hover:text-[#9b1b1b] cursor-pointer"
            >
              MENU
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#9b1b1b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link href="/catering" className="group relative pb-2 transition-colors hover:text-[#9b1b1b]">
              CATERING
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#9b1b1b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link href="/values" className="group relative pb-2 transition-colors hover:text-[#9b1b1b]">
              OUR VALUES
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#9b1b1b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
            <Link href="/download" className="group relative pb-2 transition-colors hover:text-[#9b1b1b]">
              DOWNLOAD APP
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#9b1b1b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </Link>
          </div>
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center space-x-4 lg:space-x-6 text-[#4a1c10] tracking-widest font-['Avenir_Next',_sans-serif] font-semibold text-sm whitespace-nowrap">
          {/* Find a location */}
          <Link href="/locations" className="hidden lg:flex items-center hover:opacity-80 transition-opacity">
            <Image src="/LocationPin Pic.png" alt="Location" width={36} height={36} className="object-contain" />
            <span className="pt-1 -ml-1">FIND ABRAHAM&apos;S TABLE</span>
          </Link>

          {/* User / Sign In */}
          {user ? (
            <button onClick={() => setProfileOpen(true)} title="Open Profile" className="hidden sm:flex items-center space-x-2 hover:opacity-80 transition-opacity text-black cursor-pointer">
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="black"/>
                  <circle cx="12" cy="8.5" r="4" fill="white"/>
                  <path d="M5.5 20C5.5 16.5 8.5 14.5 12 14.5C15.5 14.5 18.5 16.5 18.5 20" fill="white"/>
                </svg>
              )}
              <span className="uppercase text-2xl tracking-widest font-bold pt-1" style={{ fontFamily: "var(--font-bebas)" }}>
                {user.user_metadata?.first_name || "PROFILE"}
              </span>
            </button>
          ) : (
            <Link href="/signin" className="hidden sm:flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <User size={30} className="stroke-[2.5]" />
              <span className="pt-1">SIGN IN / JOIN</span>
            </Link>
          )}

          {/* Cart */}
          <button onClick={() => setCartOpen(true)} className="flex items-center space-x-2 hover:opacity-80 transition-opacity relative cursor-pointer">
            <Image src="/AddtocartPic.png" alt="Cart" width={56} height={56} className="object-contain" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#a62116] text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-[bounce_0.3s_ease-in-out]">
                {itemCount}
              </span>
            )}
          </button>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden flex items-center justify-center p-1 text-[#4a1c10] hover:text-[#9b1b1b] transition-colors"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={28} strokeWidth={2.5} /> : <Menu size={28} strokeWidth={2.5} />}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={closeMobile}
        />
      )}

      {/* Mobile Slide-in Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 h-24 border-b border-gray-100">
          <Link href="/" onClick={closeMobile}>
            <Image
              src="/Mainlogo.png"
              alt="Restaurant Logo"
              width={90}
              height={90}
              className="object-contain h-16 w-auto"
            />
          </Link>
          <button
            onClick={closeMobile}
            className="text-[#4a1c10] hover:text-[#9b1b1b] transition-colors"
            aria-label="Close menu"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <nav className="flex flex-col px-6 pt-6 gap-1 font-[family-name:var(--font-anton)] text-xl tracking-widest text-[#4a1c10]">
          <Link
            href="/#explore-menu"
            onClick={closeMobile}
            className="text-left py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors block"
          >
            MENU
          </Link>
          <Link href="/catering" onClick={closeMobile} className="py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors block">
            CATERING
          </Link>
          <Link href="/values" onClick={closeMobile} className="py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors block">
            OUR VALUES
          </Link>
          <Link href="/download" onClick={closeMobile} className="py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors block">
            DOWNLOAD APP
          </Link>
          <Link href="/locations" onClick={closeMobile} className="py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors block">
            FIND LOCATION
          </Link>
          {user ? (
            <button onClick={() => { setProfileOpen(true); closeMobile(); }} className="py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors flex items-center gap-3 text-left w-full uppercase text-black font-bold text-xl tracking-widest" style={{ fontFamily: "var(--font-bebas)" }}>
              {user.user_metadata?.avatar_url ? (
                <img src={user.user_metadata.avatar_url} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="12" cy="12" r="12" fill="black"/>
                  <circle cx="12" cy="8.5" r="4" fill="white"/>
                  <path d="M5.5 20C5.5 16.5 8.5 14.5 12 14.5C15.5 14.5 18.5 16.5 18.5 20" fill="white"/>
                </svg>
              )}
              <span className="pt-1">{user.user_metadata?.first_name || "PROFILE"}</span>
            </button>
          ) : (
            <Link href="/signin" onClick={closeMobile} className="py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors flex items-center gap-3">
              <User size={22} className="stroke-[2.5]" />
              SIGN IN / JOIN
            </Link>
          )}
        </nav>
      </div>

      {/* Cart Drawer Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={closeCart}
        />
      )}

      {/* Cart Slide-in Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-80 md:w-96 bg-white z-50 shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Cart Header */}
        <div className="flex items-center justify-between px-6 h-24 border-b border-gray-100">
          <h2 className="text-3xl font-bold uppercase text-[#4a1c10] m-0 tracking-wider" style={{ fontFamily: "var(--font-bebas)" }}>
            Your Cart {itemCount > 0 && <span className="text-[#b4860b]">({itemCount})</span>}
          </h2>
          <button
            onClick={closeCart}
            className="text-[#4a1c10] hover:text-[#9b1b1b] transition-colors"
            aria-label="Close cart"
          >
            <X size={26} strokeWidth={2.5} />
          </button>
        </div>

        {items.length === 0 ? (
          /* Cart Body - Empty State */
          <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6 shadow-inner">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                <path d="M3 6h18" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
            </div>
            <h3 className="text-3xl uppercase text-[#4a1c0d] mb-3 tracking-wider font-bold" style={{ fontFamily: "var(--font-bebas)" }}>
              Cart is Empty
            </h3>
            <p className="text-gray-500 text-base mb-8 font-medium">
              Looks like you haven&apos;t added any delicious items yet.
            </p>
            <Link
              href="/#explore-menu"
              onClick={closeCart}
              className="w-full bg-[#a62116] hover:bg-[#851a11] text-white uppercase font-bold tracking-widest py-4 px-6 rounded-md transition-all duration-300 shadow-md flex justify-center"
              style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem" }}
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          /* Cart Body - Items */
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center gap-4 bg-gray-50 rounded-lg p-4 border border-gray-100 transition-all hover:shadow-sm"
                >
                  {/* Item Image */}
                  <div className="relative w-24 h-24 flex-shrink-0 rounded-md overflow-hidden bg-white shadow-sm border border-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-contain p-1"
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h4
                      className="text-[#4a1c0d] text-lg uppercase leading-tight m-0 font-bold"
                      style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.05em" }}
                    >
                      {item.name}
                    </h4>
                    <p
                      className="text-[#b4860b] text-base m-0 mt-1 font-semibold"
                      style={{ fontFamily: "var(--font-bebas)" }}
                    >
                      {item.price}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#4a1c0d] hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={14} strokeWidth={3} />
                      </button>
                      <span
                        className="text-[#4a1c0d] text-lg font-bold min-w-[1.5rem] text-center"
                        style={{ fontFamily: "var(--font-bebas)" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.name, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[#4a1c0d] hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.name)}
                    className="flex-shrink-0 text-gray-400 hover:text-[#a62116] transition-colors p-1"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 size={16} strokeWidth={2} />
                  </button>
                </div>
              ))}
            </div>

            {/* Cart Footer */}
            <div className="border-t border-gray-100 p-4 space-y-3">
              {/* Total */}
              <div className="flex items-center justify-between">
                <span
                  className="text-[#4a1c0d] text-2xl uppercase font-bold"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  Total
                </span>
                <span
                  className="text-[#b4860b] text-2xl font-bold"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  RS {total.toLocaleString()}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                className="w-full bg-[#a62116] hover:bg-[#851a11] text-white uppercase font-bold tracking-widest py-4 px-6 rounded-md transition-all duration-300 shadow-md"
                style={{ fontFamily: "var(--font-bebas)", fontSize: "1.2rem" }}
              >
                Checkout
              </button>

              {/* Clear Cart */}
              <button
                onClick={clearCart}
                className="w-full text-center text-gray-400 hover:text-[#a62116] text-sm uppercase tracking-wider font-semibold transition-colors py-1"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>

      <ProfileDrawer 
        isOpen={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        handleSignOut={handleSignOut}
      />
    </>
  );
}
