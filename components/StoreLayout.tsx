"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

export function StoreLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // If we are on the dashboard, admin, kds, or delivery routes, don't show the store Navbar/Footer
  const isAdminOrKds = 
    pathname?.startsWith("/dashboard") || 
    pathname?.startsWith("/admin") || 
    pathname?.startsWith("/kds") ||
    pathname?.startsWith("/delivery");

  if (isAdminOrKds) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}
