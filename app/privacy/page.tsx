import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Abraham's Table",
  description: "Privacy Policy for Abraham's Table restaurant — how we collect, use, and protect your personal data under Pakistani law.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Banner */}
      <div className="w-full bg-linear-to-br from-[#451400] via-[#5a1e08] to-[#451400] py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1
            className="text-5xl md:text-7xl text-white uppercase tracking-wider mb-4"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            Privacy Policy
          </h1>
          <p className="text-white/70 text-sm md:text-base">
            Last updated: July 16, 2026
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 md:py-20">
        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed space-y-10">

          {/* Introduction */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Introduction
            </h2>
            <p>
              Abraham&apos;s Table (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting and respecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your personal information when you visit our website, use our mobile application, dine at our restaurants, or interact with us in any other way.
            </p>
            <p>
              This policy is drafted in accordance with the <strong>Prevention of Electronic Crimes Act, 2016 (PECA)</strong>, the <strong>Personal Data Protection Bill</strong> of Pakistan, and other applicable laws of the Islamic Republic of Pakistan.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Information We Collect
            </h2>
            <p>We may collect the following types of personal information:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Identity Data:</strong> Full name, date of birth, gender, CNIC number (where required by law).</li>
              <li><strong>Contact Data:</strong> Email address, phone number, delivery address, city.</li>
              <li><strong>Account Data:</strong> Username, password (stored securely with hashing), profile picture.</li>
              <li><strong>Order Data:</strong> Order history, food preferences, dietary requirements, payment method used.</li>
              <li><strong>Transaction Data:</strong> Payment details processed through third-party payment gateways (we do not store full card numbers).</li>
              <li><strong>Technical Data:</strong> IP address, browser type and version, device information, time zone, operating system, and platform.</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, and navigation paths.</li>
              <li><strong>Marketing Data:</strong> Communication preferences and opt-in/opt-out choices.</li>
            </ul>
          </section>

          {/* How We Collect */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              How We Collect Your Data
            </h2>
            <p>We collect personal information through:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Account registration and sign-up forms.</li>
              <li>Online ordering and table reservation systems.</li>
              <li>Customer feedback and contact forms.</li>
              <li>Subscription to our newsletter or promotional offers.</li>
              <li>Cookies and similar tracking technologies (see our Cookie section below).</li>
              <li>In-store interactions, including CCTV surveillance for security purposes.</li>
              <li>Third-party services such as Google Analytics and social media platforms.</li>
            </ul>
          </section>

          {/* How We Use */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              How We Use Your Information
            </h2>
            <p>We use your personal data for the following lawful purposes:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>To process and fulfill your food orders and reservations.</li>
              <li>To create, manage, and maintain your account.</li>
              <li>To communicate order status, confirmations, and delivery updates.</li>
              <li>To personalize your experience and recommend menu items based on preferences.</li>
              <li>To process payments securely through authorized payment gateways.</li>
              <li>To send promotional offers, loyalty rewards, and newsletters (with your consent).</li>
              <li>To comply with legal obligations under Pakistani law, including tax and food safety regulations.</li>
              <li>To improve our website, services, and customer experience.</li>
              <li>To investigate and prevent fraud, unauthorized access, or illegal activity as per PECA 2016.</li>
            </ul>
          </section>

          {/* Data Sharing */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Data Sharing & Disclosure
            </h2>
            <p>
              We do <strong>not</strong> sell, rent, or trade your personal information to third parties. However, we may share your data with:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Delivery Partners:</strong> To fulfill and deliver your orders (name, address, phone number).</li>
              <li><strong>Payment Processors:</strong> Secure third-party gateways such as JazzCash, EasyPaisa, or bank payment portals for transaction processing.</li>
              <li><strong>Service Providers:</strong> Hosting, analytics, and email service providers who assist in operating our platform.</li>
              <li><strong>Law Enforcement:</strong> When required by law, court order, or government authorities under the Pakistan Penal Code, PECA 2016, or FIA directives.</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the business.</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Data Security
            </h2>
            <p>
              We implement industry-standard security measures to protect your personal data, including:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>SSL/TLS encryption for all data transmitted between your browser and our servers.</li>
              <li>Secure password hashing using bcrypt or equivalent algorithms.</li>
              <li>Access controls to limit data access to authorized personnel only.</li>
              <li>Regular security audits and vulnerability assessments.</li>
              <li>Compliance with PCI-DSS standards for payment data handling.</li>
            </ul>
            <p className="mt-4">
              While we take every reasonable precaution, no method of electronic transmission or storage is 100% secure. We cannot guarantee absolute security of your data.
            </p>
          </section>

          {/* Cookies */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Cookies & Tracking
            </h2>
            <p>
              Our website uses cookies and similar technologies to enhance your browsing experience. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Essential Cookies:</strong> Required for the website to function (e.g., session management, cart functionality).</li>
              <li><strong>Analytics Cookies:</strong> Help us understand usage patterns and improve our services (e.g., Google Analytics).</li>
              <li><strong>Marketing Cookies:</strong> Used to deliver relevant advertisements and measure campaign effectiveness.</li>
            </ul>
            <p className="mt-4">
              You can manage cookie preferences through your browser settings. Disabling essential cookies may affect website functionality.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Your Rights
            </h2>
            <p>Under applicable Pakistani law, you have the right to:</p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal retention obligations.</li>
              <li><strong>Withdraw Consent:</strong> Opt out of marketing communications at any time.</li>
              <li><strong>Data Portability:</strong> Request your data in a commonly used format.</li>
              <li><strong>Complaint:</strong> Lodge a complaint with the Pakistan Telecommunication Authority (PTA) or relevant authority if you believe your data rights have been violated.</li>
            </ul>
            <p className="mt-4">
              To exercise any of these rights, please contact us using the details provided below.
            </p>
          </section>

          {/* Data Retention */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Data Retention
            </h2>
            <p>
              We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected, including satisfying any legal, accounting, or reporting requirements under Pakistani law. Typically:
            </p>
            <ul className="list-disc pl-6 space-y-2 mt-4">
              <li>Account data is retained until you delete your account.</li>
              <li>Order and transaction records are retained for a minimum of 6 years as required by the Income Tax Ordinance, 2001, and the Sales Tax Act, 1990.</li>
              <li>CCTV footage is retained for up to 90 days unless required for ongoing investigations.</li>
            </ul>
          </section>

          {/* Children */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Children&apos;s Privacy
            </h2>
            <p>
              Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal data from minors. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately and we will take steps to delete such information.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2
              className="text-3xl text-[#451400] uppercase tracking-wide mb-4 border-b-2 border-[#e5002a] pb-2 inline-block"
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              Changes to This Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated &quot;Last Updated&quot; date. We encourage you to review this page periodically. Continued use of our services after changes constitutes acceptance of the updated policy.
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
            <p>If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
            <div className="mt-4 bg-[#f9f5f0] border border-[#e5d5c0] rounded-lg p-6 space-y-2">
              <p className="font-bold text-[#451400] text-lg" style={{ fontFamily: "var(--font-bebas)" }}>
                Abraham&apos;s Table
              </p>
              <p>📧 Email: <a href="mailto:privacy@abrahamstable.pk" className="text-[#e5002a] hover:underline">privacy@abrahamstable.pk</a></p>
              <p>📞 Phone: <a href="tel:+923358746804" className="text-[#e5002a] hover:underline">+92 335 8746804</a></p>
              <p>📍 Address: Lahore, Punjab, Pakistan</p>
            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
