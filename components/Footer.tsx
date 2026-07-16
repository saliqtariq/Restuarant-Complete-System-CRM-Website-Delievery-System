"use client";

import Image from 'next/image';
import Link from 'next/link';
const Facebook = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const Twitter = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const Instagram = ({ size = 24 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Footer() {
  return (
    <footer className="w-full bg-white text-[#3E2b2f] pt-16 pb-8 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-8 mb-16 items-start">
          {/* Left Column - Main Links */}
          <div className="self-start flex flex-col space-y-3" style={{ fontFamily: 'var(--font-anton)' }}>
            <Link href="/contact" className="text-2xl text-[#451400] uppercase tracking-wide hover:text-[#7a2e15] transition-colors">
              Contact Support
            </Link>
            <Link href="/careers" className="text-2xl text-[#451400] uppercase tracking-wide hover:text-[#7a2e15] transition-colors">
              Careers
            </Link>
            <Link href="/privacy" className="text-2xl text-[#451400] uppercase tracking-wide hover:text-[#7a2e15] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-2xl text-[#451400] uppercase tracking-wide hover:text-[#7a2e15] transition-colors">
              Terms & Conditions
            </Link>
          </div>

          {/* Middle Column - Secondary Links */}
          <div className="self-start flex flex-col space-y-3">
            <Link href="/values" className="text-base font-bold text-[#451400] hover:underline">
              Our Values
            </Link>
            <Link href="/news" className="text-base font-bold text-[#451400] hover:underline">
              News & Events
            </Link>
            <Link href="/health-safety" className="text-base font-bold text-[#451400] hover:underline">
              Health & Safety
            </Link>
            <Link href="/locations" className="text-base font-bold text-[#451400] hover:underline">
              All Locations
            </Link>
            <Link href="/fundraising" className="text-base font-bold text-[#451400] hover:underline">
              Fundraising
            </Link>
          </div>

          {/* Right Column - Join Promo */}
          <div className="self-start w-full flex items-start justify-center md:-mt-3 md:justify-end">
            <div className="flex w-[168px] flex-col items-center text-center">
              {/* Logo */}
              <Image
                src="/Mainlogowithnotext.png"
                alt="Abraham's Table Logo"
                width={52}
                height={52}
                className="h-[52px] w-auto object-contain"
              />

              {/* Welcome Back */}
              <p className="mt-1 text-[#a32a22] text-[8px] font-bold uppercase tracking-[0.14em] leading-none whitespace-nowrap">
                Welcome Back,
              </p>

              {/* Name */}
              <h2
                className="text-[2rem] leading-none font-normal uppercase text-[#451400]"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                Saliq
              </h2>

              {/* Subtitle */}
              <p className="mt-1.5 text-[#6b7280] text-[10px] leading-snug">
                Check your rewards and
                <br />
                recent order history.
              </p>

              {/* View Account button */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  window.dispatchEvent(new Event("open-profile-drawer"));
                }}
                className="mt-2.5 w-full border border-[#451400] rounded-sm bg-white px-3 py-1.5 text-[#451400] text-sm font-bold uppercase tracking-wide hover:bg-[#451400] hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-anton)" }}
              >
                View Account
              </button>
            </div>
          </div>
        </div>

        {/* App & Social Section */}
        <div className="flex flex-col md:flex-row justify-between items-start gap-8 pb-8">
          <div className="flex flex-col">
            <h4 className="font-bold text-sm uppercase mb-3 text-[#451400]">Download Our App</h4>
            <div className="flex space-x-3">
              <div className="w-[120px] h-[40px] bg-black rounded flex items-center justify-center text-white text-[10px]">
                App Store
              </div>
              <div className="w-[120px] h-[40px] relative">
                <Image src="/getitongooglePlaceholder.png" alt="Get it on Google Play" fill className="object-contain" />
              </div>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end">
            <h4 className="font-bold text-sm uppercase mb-3 text-[#451400]">Connect With Us</h4>
            <div className="flex space-x-4">
              <div className="w-8 h-8 rounded-full bg-[#451400] text-white flex items-center justify-center">
                <Instagram size={16} />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#451400] text-white flex items-center justify-center">
                <Twitter size={16} />
              </div>
              <div className="w-8 h-8 rounded-full bg-[#451400] text-white flex items-center justify-center">
                <Facebook size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* Footer legal links */}
        <div className="border-t border-gray-200 pt-8 flex flex-wrap gap-4 text-xs font-bold text-gray-500">
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
          <Link href="/terms" className="hover:underline">Terms of Use</Link>
          <Link href="/accessibility" className="hover:underline">Accessibility Statement</Link>
        </div>
      </div>
    </footer>
  );
}
