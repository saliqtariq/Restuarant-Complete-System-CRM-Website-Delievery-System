import ValuesHero from "./ValuesHero";
import IngredientsMarquee from "./IngredientsMarquee";
import FreshStatement from "./FreshStatement";
import CareersSection from "./CareersSection";

export default function OurValues() {
  return (
    <section className="w-full bg-white pb-16">
      <ValuesHero />
      <IngredientsMarquee />
      <FreshStatement />
      <CareersSection />
    </section>
  );
}
