"use client";

import Image from "next/image";
import Link from "next/link";
import { User, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = () => setMobileOpen(false);

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
            <button
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("explore-menu");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                  window.history.pushState(null, "", "/#explore-menu");
                }
              }}
              className="group relative pb-2 transition-colors hover:text-[#9b1b1b] cursor-pointer"
            >
              MENU
              <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#9b1b1b] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
            </button>
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
          <Link href="/signin" className="hidden sm:flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <User size={30} className="stroke-[2.5]" />
            <span className="pt-1">SIGN IN / JOIN</span>
          </Link>

          {/* Cart */}
          <Link href="/cart" className="flex items-center space-x-2 hover:opacity-80 transition-opacity relative">
            <Image src="/CartPic.png" alt="Cart" width={36} height={36} className="object-contain" />
          </Link>

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
          <button
            onClick={() => {
              closeMobile();
              setTimeout(() => {
                const element = document.getElementById("explore-menu");
                if (element) element.scrollIntoView({ behavior: "smooth" });
              }, 300);
            }}
            className="text-left py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors"
          >
            MENU
          </button>
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
          <Link href="/signin" onClick={closeMobile} className="py-4 border-b border-gray-100 hover:text-[#9b1b1b] transition-colors flex items-center gap-3">
            <User size={22} className="stroke-[2.5]" />
            SIGN IN / JOIN
          </Link>
        </nav>
      </div>
    </>
  );
}
