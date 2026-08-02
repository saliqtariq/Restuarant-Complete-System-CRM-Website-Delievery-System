import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    id: "catering",
    title: "CATERING",
    image: "/CateringPic.jpeg",
    imagePosition: "center 90%",
    bullets: [
      "From 6 to 200 People",
      "Starting at Rs. 850 / Person",
      "Burgers",
      "Broast",
      "Wings",
      "Fries & Drinks",
    ],
    boldNote: "Requires 24 Hours Notice",
    ctaLabel: "ORDER CATERING",
    ctaHref: "/catering",
  },
  {
    id: "group-order",
    title: "GROUP ORDER",
    image: "/GroupOrderPic.png",
    imagePosition: "center 70%",
    bullets: [
      "Order up to 15 Meals",
      "Regular Menu Pricing",
      "Burgers",
      "Broast",
      "Wings",
      "Fries & Drinks",
    ],
    boldNote: "Order & Enjoy Today",
    ctaLabel: "START A GROUP ORDER",
    ctaHref: "/catering",
  },
];

export default function CrowdPleasers() {
  return (
    <section 
      className="w-full pt-4 pb-16 bg-cover bg-center"
      style={{ backgroundImage: "url('/updatedbgpic.png')" }}
    >
      <div className="max-w-5xl mx-auto px-4">
        {/* Heading */}
        <h2
          className="text-center text-[#4a1c0d] text-3xl md:text-4xl font-extrabold uppercase tracking-widest mb-8"
          style={{ fontFamily: "var(--font-bebas)", letterSpacing: "0.15em" }}
        >
          Crowd Pleasers
        </h2>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex flex-col rounded-sm overflow-hidden shadow-md hover:shadow-lg transition-shadow bg-white"
            >
              {/* Image with title overlay */}
              <div className="relative w-full h-52">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 95vw, 45vw"
                  className="object-cover"
                  style={{ objectPosition: card.imagePosition || "center" }}
                  loading="lazy"
                />
                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
                {/* Title */}
                <h3
                  className="absolute bottom-4 left-5 text-white text-4xl md:text-5xl font-bold uppercase tracking-wider drop-shadow-lg"
                  style={{ fontFamily: "var(--font-bebas)" }}
                >
                  {card.title}
                </h3>
              </div>

              {/* Body */}
              <div className="flex flex-col flex-1 px-5 pt-4 pb-5 bg-white">
                {/* Bullet points */}
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {card.bullets.map((bullet, i) => (
                    <span key={i}>
                      <span className="text-[#b4860b] font-bold mr-0.5">•</span>{" "}
                      {bullet}
                      {i < card.bullets.length - 1 ? " " : ""}
                    </span>
                  ))}{" "}
                  <span className="font-bold text-gray-800">
                    {card.boldNote}
                  </span>
                </p>

                {/* CTA Button */}
                <Link
                  href={card.ctaHref}
                  className="mt-auto block text-center bg-[#b4860b] hover:bg-[#9a7009] text-white text-sm font-bold uppercase tracking-widest py-3 px-6 transition-colors duration-200"
                  style={{ fontFamily: "var(--font-bebas)", fontSize: "1.1rem", letterSpacing: "0.1em" }}
                >
                  {card.ctaLabel}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
