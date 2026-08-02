import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Abraham's Table",
  description: "Terms and Conditions for Abraham's Table restaurant — governing your use of our website, ordering services, and dining under Pakistani law.",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="w-full bg-linear-to-br from-[#451400] via-[#5a1e08] to-[#451400] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1
            className="text-5xl md:text-7xl text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Terms & Conditions
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Last updated: July 16, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-10">

          {/* Acceptance */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Acceptance of Terms
            </h2>
            <p>
              Welcome to Abraham&apos;s Table. By accessing or using our website (<strong>abrahamstable.pk</strong>), mobile application, or dining at any of our restaurant locations, you agree to be bound by these Terms and Conditions (&quot;Terms&quot;). If you do not agree with any part of these Terms, you must not use our services.
            </p>
            <p>
              These Terms are governed by and construed in accordance with the laws of the <strong>Islamic Republic of Pakistan</strong>, including the Contract Act, 1872, the Sale of Goods Act, 1930, the Consumer Protection laws of the respective provinces, and the Prevention of Electronic Crimes Act, 2016 (PECA).
            </p>
          </section>

          {/* Definitions */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Definitions
            </h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>&quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; &quot;us&quot;</strong> refers to Abraham&apos;s Table, a restaurant business registered and operating in Pakistan.</li>
              <li><strong>&quot;Customer,&quot; &quot;you,&quot; &quot;your&quot;</strong> refers to any individual or entity using our services.</li>
              <li><strong>&quot;Services&quot;</strong> includes dine-in, takeaway, online ordering, delivery, catering, table reservations, and any related services.</li>
              <li><strong>&quot;Platform&quot;</strong> refers to our website, mobile application, and any associated digital interfaces.</li>
              <li><strong>&quot;Order&quot;</strong> refers to any request placed by you for food, beverages, or related products.</li>
            </ul>
          </section>

          {/* Eligibility */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Eligibility
            </h2>
            <p>
              You must be at least <strong>18 years of age</strong> to create an account or place orders on our platform. Persons under 18 may use our services only under the supervision of a parent or legal guardian. By using our services, you represent and warrant that you have the legal capacity to enter into a binding agreement under the Contract Act, 1872.
            </p>
          </section>

          {/* Account */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Account Registration
            </h2>
            <p>To access certain features, you may need to create an account. You agree to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Provide accurate, current, and complete information during registration.</li>
              <li>Maintain the security and confidentiality of your login credentials.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Accept responsibility for all activities that occur under your account.</li>
            </ul>
            <p className="mt-4">
              We reserve the right to suspend or terminate your account if we suspect fraudulent, abusive, or illegal activity, in accordance with PECA 2016.
            </p>
          </section>

          {/* Orders and Payments */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Orders & Payments
            </h2>
            <h3 className="text-xl font-bold text-[#451400] mt-6 mb-2">Placing Orders</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>All orders placed through our platform constitute an offer to purchase, subject to our acceptance.</li>
              <li>We reserve the right to refuse or cancel any order at our discretion, including orders with pricing errors, stock unavailability, or suspected fraud.</li>
              <li>Order confirmation will be sent via email or SMS upon acceptance.</li>
            </ul>

            <h3 className="text-xl font-bold text-[#451400] mt-6 mb-2">Pricing</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>All prices displayed on our platform are in <strong>Pakistani Rupees (PKR)</strong> and include applicable taxes unless otherwise stated.</li>
              <li>Prices are subject to change without prior notice. The price at the time of order placement shall apply.</li>
              <li>General Sales Tax (GST) at the applicable rate is included in the listed prices as required by the Sales Tax Act, 1990.</li>
            </ul>

            <h3 className="text-xl font-bold text-[#451400] mt-6 mb-2">Payment Methods</h3>
            <ul className="list-disc pl-6 space-y-2">
              <li>We accept Cash on Delivery (COD), credit/debit cards, JazzCash, EasyPaisa, and bank transfers.</li>
              <li>All online payments are processed through secure, PCI-DSS compliant third-party payment gateways.</li>
              <li>We do not store your complete credit/debit card information on our servers.</li>
            </ul>
          </section>

          {/* Delivery */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Delivery Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Delivery is available within our designated service areas. Delivery zones and charges may vary by location.</li>
              <li>Estimated delivery times are approximate and may be affected by traffic, weather, or high order volume.</li>
              <li>You are responsible for providing an accurate and complete delivery address. We are not liable for failed deliveries due to incorrect address information.</li>
              <li>A minimum order value may apply for delivery services.</li>
              <li>Risk of loss and title for items pass to you upon delivery.</li>
            </ul>
          </section>

          {/* Cancellation & Refunds */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Cancellation & Refund Policy
            </h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Orders may be cancelled within <strong>2 minutes</strong> of placement, before food preparation begins.</li>
              <li>Once preparation has started, cancellations will not be accepted and no refund will be issued.</li>
              <li>If you receive an incorrect or defective order, please contact us within <strong>30 minutes</strong> of delivery with photographic evidence. We will either replace the item or issue a full refund.</li>
              <li>Refunds for online payments will be processed within <strong>7-14 business days</strong> to the original payment method.</li>
              <li>Cash on delivery refunds will be issued via JazzCash, EasyPaisa, or bank transfer.</li>
              <li>This refund policy is in compliance with the <strong>Punjab Consumer Protection Act, 2005</strong> and equivalent provincial consumer protection laws.</li>
            </ul>
          </section>

          {/* Food Safety */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Food Safety & Allergens
            </h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>All our food is prepared in compliance with the <strong>Punjab Food Authority Act, 2011</strong> (or equivalent provincial food authority regulations) and Pakistan Standards and Quality Control Authority (PSQCA) standards.</li>
              <li>Our kitchen handles common allergens including gluten, dairy, eggs, nuts, soy, and shellfish. Cross-contamination may occur.</li>
              <li>If you have specific food allergies or dietary requirements, please inform us before placing your order. We will make reasonable efforts to accommodate your needs but cannot guarantee a completely allergen-free environment.</li>
              <li>All meat served at Abraham&apos;s Table is <strong>100% Halal</strong>, sourced from certified Halal suppliers in accordance with Islamic dietary laws.</li>
            </ul>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Intellectual Property
            </h2>
            <p>
              All content on our platform — including but not limited to logos, trademarks, text, images, graphics, menu designs, recipes, and software — is the exclusive property of Abraham&apos;s Table and is protected under the <strong>Intellectual Property Organization of Pakistan (IPO-Pakistan)</strong> regulations, the <strong>Trade Marks Ordinance, 2001</strong>, and the <strong>Copyright Ordinance, 1962</strong>.
            </p>
            <p className="mt-4">
              You may not reproduce, distribute, modify, create derivative works from, publicly display, or commercially exploit any content from our platform without our express written permission.
            </p>
          </section>

          {/* Prohibited Conduct */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Prohibited Conduct
            </h2>
            <p>When using our services, you agree not to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Use the platform for any unlawful purpose or in violation of Pakistani law.</li>
              <li>Attempt to gain unauthorized access to our systems, networks, or data (punishable under PECA 2016, Section 3-4).</li>
              <li>Transmit any malware, viruses, or harmful code.</li>
              <li>Impersonate another person or misrepresent your identity.</li>
              <li>Place fraudulent orders or provide false information.</li>
              <li>Harass, abuse, or threaten our staff, delivery personnel, or other customers.</li>
              <li>Scrape, crawl, or use automated tools to extract data from our platform.</li>
            </ul>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Limitation of Liability
            </h2>
            <p>To the maximum extent permitted by Pakistani law:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Our total liability for any claim arising from or related to our services shall not exceed the amount paid by you for the specific order in question.</li>
              <li>We shall not be liable for any indirect, incidental, special, consequential, or punitive damages.</li>
              <li>We are not liable for delays or failures in performance resulting from circumstances beyond our reasonable control (force majeure), including natural disasters, government actions, civil unrest, epidemics, or internet/power outages.</li>
              <li>Our platform is provided on an &quot;as is&quot; and &quot;as available&quot; basis without warranties of any kind, either express or implied.</li>
            </ul>
          </section>

          {/* Indemnification */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Indemnification
            </h2>
            <p>
              You agree to indemnify, defend, and hold harmless Abraham&apos;s Table, its directors, officers, employees, and agents from any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of our services, violation of these Terms, or infringement of any rights of a third party.
            </p>
          </section>

          {/* Dispute Resolution */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Dispute Resolution
            </h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Any dispute arising from these Terms shall first be resolved through good-faith negotiation between the parties.</li>
              <li>If negotiation fails, the dispute shall be referred to <strong>arbitration</strong> under the Arbitration Act, 1940, administered in Lahore, Punjab, Pakistan.</li>
              <li>The arbitration shall be conducted in English or Urdu, and the arbitrator&apos;s decision shall be final and binding.</li>
              <li>Nothing in this clause prevents either party from seeking injunctive relief from the competent courts of Pakistan.</li>
              <li>These Terms shall be governed by and construed in accordance with the laws of Pakistan. The courts of <strong>Lahore, Punjab</strong> shall have exclusive jurisdiction.</li>
            </ul>
          </section>

          {/* Catering Terms */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Catering Services
            </h2>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Catering orders require a minimum of <strong>24 hours advance notice</strong>.</li>
              <li>A non-refundable deposit of <strong>50%</strong> of the total order value is required at the time of booking.</li>
              <li>The remaining balance is due upon delivery or at the event.</li>
              <li>Cancellations made less than 12 hours before the scheduled event will forfeit the deposit.</li>
              <li>Menu customization and special dietary requirements must be communicated at the time of booking.</li>
            </ul>
          </section>

          {/* Modifications */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Modifications to Terms
            </h2>
            <p>
              We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to our platform. Continued use of our services after any modifications constitutes your acceptance of the revised Terms. We recommend reviewing this page periodically.
            </p>
          </section>

          {/* Severability */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Severability
            </h2>
            <p>
              If any provision of these Terms is found to be invalid or unenforceable by a court of competent jurisdiction in Pakistan, the remaining provisions shall continue in full force and effect. The invalid provision shall be modified to the minimum extent necessary to make it valid and enforceable.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Contact Us
            </h2>
            <p>For any questions regarding these Terms and Conditions, please reach out to us:</p>
            <div className="mt-4 bg-[#f9f5f0] border border-[#e5d5c0] rounded-lg p-6 space-y-2">
              <p className="font-bold text-[#451400] text-lg" style={{ fontFamily: "var(--font-bebas)" }}>
                Abraham&apos;s Table
              </p>
              <p>📧 Email: <a href="mailto:legal@abrahamstable.pk" className="text-[#e5002a] hover:underline">legal@abrahamstable.pk</a></p>
              <p>📞 Phone: <a href="tel:+923358746804" className="text-[#e5002a] hover:underline">+92 335 8746804</a></p>
              <p>📍 Address: Lahore, Punjab, Pakistan</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
