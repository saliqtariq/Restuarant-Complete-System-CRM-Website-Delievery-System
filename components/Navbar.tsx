import Image from "next/image";
import Link from "next/link";
import { User } from "lucide-react";

export default function Navbar() {
  return (
    <nav className="w-full h-24 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-12 shrink-0">
      
      {/* Left Group: Logo and Main Menu */}
      <div className="flex items-center space-x-6 lg:space-x-10">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/">
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

        {/* Center section: Main Navigation Links */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6 text-[#4a1c10] font-[family-name:var(--font-anton)] text-xl tracking-widest pt-1 whitespace-nowrap">
          <Link href="/menu" className="hover:opacity-80 transition-opacity">MENU</Link>
          <Link href="/catering" className="hover:opacity-80 transition-opacity">CATERING</Link>
          <Link href="/values" className="hover:opacity-80 transition-opacity">OUR VALUES</Link>
          <Link href="/values" className="hover:opacity-80 transition-opacity">DOWNLOAD APP</Link>
        </div>
      </div>

      {/* Right section: Actions */}
      <div className="flex items-center space-x-4 lg:space-x-6 text-[#4a1c10] tracking-widest font-['Avenir_Next',_sans-serif] font-semibold text-sm whitespace-nowrap">
        {/* Find a location */}
        <Link href="/locations" className="hidden lg:flex items-center hover:opacity-80 transition-opacity">
          <Image src="/LocationPin Pic.png" alt="Location" width={36} height={36} className="object-contain" />
          <span className="pt-1 -ml-1">FIND ABRAHAM'S TABLE</span>
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
      </div>
    </nav>
  );
}
