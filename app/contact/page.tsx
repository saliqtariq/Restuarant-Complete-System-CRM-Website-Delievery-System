import { FeedbackForm } from "@/components/FeedbackForm";

export const metadata = {
  title: "Contact Support | Abraham's Table",
  description: "Get in touch with us. Leave a suggestion, review, or contact our support team.",
};

const MailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a47c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2"></rect>
    <path d="M22 6l-10 7L2 6"></path>
  </svg>
);

const PhoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a47c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
  </svg>
);

const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#c4a47c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const DividerLeafIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#c4a47c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22c4-4 4-10 0-14-4 4-4 10 0 14z" />
    <path d="M12 22v-7" />
    <path d="M12 15c-2-2-2-5 0-7" />
    <path d="M12 15c2-2 2-5 0-7" />
  </svg>
);

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f3efe8] py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="max-w-5xl w-full mx-auto">
        <div className="text-center mb-16">
          <h1 
            className="text-5xl md:text-6xl uppercase text-[#451400] mb-4"
            style={{ fontFamily: 'var(--font-anton)' }}
          >
            Contact Support
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We&apos;d love to hear from you! Whether you have a suggestion, review, or need assistance, please drop us a message below.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-stretch justify-center">
          
          {/* Left Card: Feedback Form */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <div className="w-full max-w-md bg-white p-10 sm:p-12 rounded-[2rem] shadow-sm flex items-center justify-center">
              <FeedbackForm />
            </div>
          </div>
          
          {/* Right Card: Contact Info */}
          <div className="w-full lg:w-1/2 flex justify-start">
            <div className="w-full max-w-md bg-[#2b1b15] p-10 sm:p-12 rounded-[2rem] shadow-sm relative overflow-hidden flex flex-col justify-center">
              {/* Optional: subtle background texture overlay could go here */}
              
              <div className="relative z-10">
                <h2 className="text-[#c4a47c] text-lg font-serif font-medium uppercase tracking-widest mb-1">
                  Get In
                </h2>
                <h1 className="text-white text-6xl md:text-7xl uppercase leading-none mb-6" style={{ fontFamily: 'var(--font-anton)' }}>
                  Touch
                </h1>
                
                <div className="h-[1px] bg-[#422f27] w-full mb-8"></div>
                
                <div className="space-y-6">
                  {/* Email */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full border border-[#c4a47c]/40 flex items-center justify-center shrink-0">
                      <MailIcon />
                    </div>
                    <div className="pt-1">
                      <h3 className="text-[11px] font-bold text-[#c4a47c] uppercase tracking-widest mb-1">Email</h3>
                      <a href="mailto:support@abrahamstable.com" className="text-[#fdfbf7] font-medium text-[15px] hover:text-[#c4a47c] transition-colors">
                        support@abrahamstable.com
                      </a>
                    </div>
                  </div>
                  
                  <div className="h-[1px] bg-[#422f27] w-full"></div>
                  
                  {/* Phone */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full border border-[#c4a47c]/40 flex items-center justify-center shrink-0">
                      <PhoneIcon />
                    </div>
                    <div className="pt-1">
                      <h3 className="text-[11px] font-bold text-[#c4a47c] uppercase tracking-widest mb-1">Phone</h3>
                      <a href="tel:+15551234567" className="text-[#fdfbf7] font-medium text-[15px] hover:text-[#c4a47c] transition-colors">
                        (555) 123-4567
                      </a>
                    </div>
                  </div>
                  
                  <div className="h-[1px] bg-[#422f27] w-full"></div>
                  
                  {/* Business Hours */}
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 rounded-full border border-[#c4a47c]/40 flex items-center justify-center shrink-0">
                      <ClockIcon />
                    </div>
                    <div className="pt-1">
                      <h3 className="text-[11px] font-bold text-[#c4a47c] uppercase tracking-widest mb-1">Business Hours</h3>
                      <p className="text-[#fdfbf7] font-medium text-[15px]">
                        Mon - Sun: 10:00 AM - 10:00 PM
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-center gap-4 opacity-50">
                   <div className="h-[1px] bg-[#c4a47c] flex-1 max-w-[80px]"></div>
                   <DividerLeafIcon />
                   <div className="h-[1px] bg-[#c4a47c] flex-1 max-w-[80px]"></div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
