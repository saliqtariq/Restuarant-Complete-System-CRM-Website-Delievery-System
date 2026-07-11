import HeroSection from "@/components/HeroSection";
import PopularItems from "@/components/menu/PopularItems";
import BestSellers from "@/components/menu/BestSellers";
import ExploreMenu from "@/components/menu/ExploreMenu";
import CrowdPleasers from "@/components/menu/CrowdPleasers";

export default function Home() {
  return (
    <main className="flex-1 bg-white flex flex-col">
      <HeroSection />
      
      {/* Join Rewards / Sign In Banner */}
      <section className="w-full bg-white py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
          <a
            href="#join"
            className="bg-[#461a0f] text-white px-8 py-2.5 rounded-md text-xl md:text-2xl tracking-wide transition hover:bg-[#34130b]"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            RESERVE TABLE
          </a>
          
          <span 
            className="text-[#461a0f] text-xl md:text-2xl"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            OR
          </span>
          
          <a
            href="#signin"
            className="text-[#b4860b] text-xl md:text-2xl tracking-wide underline decoration-2 underline-offset-4 hover:text-[#916a08] transition"
            style={{ fontFamily: "var(--font-bebas)" }}
          >
            SIGN IN
          </a>
        </div>
      </section>

      {/* Divider */}
      <div className="w-full max-w-7xl mx-auto px-4">
        <hr className="border-t border-gray-500" />
      </div>

      <ExploreMenu />
      <PopularItems />
      <BestSellers />
      <CrowdPleasers />
    </main>
  );
}
