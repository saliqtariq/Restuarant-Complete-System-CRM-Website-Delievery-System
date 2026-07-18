"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ReactNode } from "react";

export function StoreLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // If we are on the dashboard or admin routes, don't show the store Navbar/Footer
  const isAdmin = pathname?.startsWith("/dashboard") || pathname?.startsWith("/admin");

  if (isAdmin) {
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
