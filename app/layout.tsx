import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Anton, Bebas_Neue } from "next/font/google";
import "./globals.css";
import { StoreLayout } from "@/components/StoreLayout";
import ToastContainer from "@/components/Toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});


const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Abraham's Table | Restaurant",
  description: "Abraham's Table - Authentic dining experience with catering, delivery, and more.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} ${bebasNeue.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">
        <StoreLayout>{children}</StoreLayout>
        <ToastContainer />
      </body>
    </html>
  );
}
