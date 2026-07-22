import Image from "next/image";
import PresetBoxes from "@/components/catering/PresetBoxes";
import CateringBoxBuilder from "@/components/catering/CateringBoxBuilder";
import CateringInquiryForm from "@/components/catering/CateringInquiryForm";
import { Package, UtensilsCrossed, ShieldCheck, Truck } from "lucide-react";

export const metadata = {
  title: "Catering & Party Crates | Abraham's Table",
  description: "Order bulk burgers, fries buckets, dip pots & beverages for family reunions, big parties, and corporate events.",
};

export default function CateringPage() {
  return (
    <div className="bg-[#faf8f5] min-h-screen pb-16">

      {/* ─── HERO BANNER ─── */}
      <section className="relative bg-[#3b1200] text-white py-20 px-4 overflow-hidden shadow-xl">
        {/* Background Image Watermark */}
        <div className="absolute inset-0 opacity-15 pointer-events-none mix-blend-overlay">
          <Image
            src="/CateringPic.jpeg"
            alt="Catering Background"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="relative max-w-5xl mx-auto text-center z-10">
          <h1
            className="text-4xl sm:text-6xl font-extrabold uppercase tracking-wide leading-none mb-4 text-amber-50"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Abraham's Party Crates & Catering
          </h1>
          <p className="text-amber-100/90 text-sm sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Savor hot gourmet smash burgers, XL loaded fries buckets, signature dip pots, and ice-cold beverages — packed fresh in insulated party crates for your ultimate gatherings.
          </p>

          {/* Key Value Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto pt-6 border-t border-amber-900/40 text-xs text-amber-200">
            <div className="flex items-center justify-center gap-2">
              <Package size={18} className="text-amber-400 shrink-0" />
              <span>Bulk Party Crates</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <UtensilsCrossed size={18} className="text-amber-400 shrink-0" />
              <span>Burgers, Dips & Sides</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Truck size={18} className="text-amber-400 shrink-0" />
              <span>Insulated Hot Delivery</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <ShieldCheck size={18} className="text-amber-400 shrink-0" />
              <span>Family Reunion Ready</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRESET BOXES SECTION ─── */}
      <PresetBoxes />

      {/* ─── CUSTOM BOX BUILDER ─── */}
      <CateringBoxBuilder />

      {/* ─── LARGE EVENT INQUIRY FORM ─── */}
      <CateringInquiryForm />

    </div>
  );
}
