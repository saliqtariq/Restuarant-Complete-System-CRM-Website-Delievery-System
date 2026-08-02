import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Health & Safety | Abraham's Table",
  description: "Health & Safety standards and food safety advancements at Abraham's Table restaurant.",
};

export default function HealthSafetyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="w-full bg-linear-to-br from-[#451400] via-[#5a1e08] to-[#451400] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1
            className="text-5xl md:text-7xl text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Health & Safety Policy
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Our Safety Advancements & Hygiene Standards • Last updated: July 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-10">

          {/* Commitment */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Our Safety Advancements & Commitment
            </h2>
            <p>
              At Abraham&apos;s Table, the health, safety, and well-being of our guests, kitchen crew, and community are our highest priorities. We maintain strict hygiene protocols and advanced food-safety management systems across all locations to ensure every meal is prepared with the utmost cleanliness and quality.
            </p>
          </section>

          {/* Food Safety & Handling */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Food Safety & Preparation Standards
            </h2>
            <p>We strictly adhere to national and international food safety regulations (including Punjab Food Authority guidelines):</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Source Verification:</strong> All ingredients, meats, and fresh produce are sourced exclusively from certified food suppliers adhering to strict quality control.</li>
              <li><strong>Temperature Monitoring:</strong> Cold storage, refrigeration, and cooking temperatures are logged digitally in real time to prevent foodborne risks.</li>
              <li><strong>Cross-Contamination Prevention:</strong> Dedicated color-coded cutting boards, utensils, and prep zones are used for raw meats, fresh vegetables, and cooked items.</li>
              <li><strong>Freshness Assurance:</strong> We enforce strict First-In, First-Out (FIFO) inventory controls and daily quality audits.</li>
            </ul>
          </section>

          {/* Sanitation & Hygiene */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Sanitation & Restaurant Hygiene
            </h2>
            <p>Our dining areas, kitchens, and delivery processes undergo regular sanitization protocols:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>High-touch surfaces (tables, door handles, ordering kiosks, point-of-sale systems) are disinfected every 30 minutes.</li>
              <li>Kitchen staff wear food-grade protective gloves, hairnets, and dedicated clean uniforms.</li>
              <li>Hand-sanitizing stations are accessible for both guests and team members throughout our restaurants.</li>
              <li>Delivery bags and containers are sealed with tamper-evident safety seals prior to leaving our kitchens.</li>
            </ul>
          </section>

          {/* Employee Wellness */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Employee Health & Training
            </h2>
            <p>Our team members undergo mandatory health screenings and comprehensive safety training:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Daily health checks prior to starting shifts. Team members exhibiting any symptoms of illness are required to rest at home with paid sick leave.</li>
              <li>Mandatory 20-second handwashing routines enforced every 30 minutes and after handling any raw materials.</li>
              <li>Continuous food safety certification and regular third-party audit inspections.</li>
            </ul>
          </section>

          {/* Allergen & Contact */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Allergen Information & Queries
            </h2>
            <p>
              If you have specific food allergies, dietary restrictions, or health safety concerns, please inform our team when placing your order or contact our Safety Compliance team directly at:
            </p>
            <div className="mt-4 bg-gray-50 border border-gray-200 p-4 rounded-md">
              <p className="font-semibold text-[#451400]">Abraham&apos;s Table Quality & Safety Team</p>
              <p>Email: <a href="mailto:safety@abrahamstable.com" className="text-[#e5002a] hover:underline">safety@abrahamstable.com</a></p>
              <p>Phone: 0335-8746804</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
