import Image from "next/image";

const bestSellers = [
  {
    name: "CHICKEN N CHIPS",
    price: "RS 1420",
    image: "/BestSellersDeal.png",
  },
  {
    name: "ZINGER BUTCHER",
    price: "RS 650",
    image: "/Zinger Butcher.png",
  },
  {
    name: "SAUCY CHICKEN PARATHA",
    price: "RS 670",
    image: "/SaucyLachParatha.png",
  },
  {
    name: "ABRAHAM'S DOUBLE STACK",
    price: "RS 890",
    image: "/Abraham's Double Stack.png",
  },
  {
    name: "TWISTER WRAP COMBO",
    price: "RS 760",
    image: "/TwisterCombo.png",
  },
  {
    name: "BURGER N CHICKEN COMBO",
    price: "RS 550",
    image: "/Burger n Chicken Combo.png",
  },
];

export default function BestSellers() {
  return (
    <section className="w-full bg-white pt-6 pb-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 
          className="text-[#4a1c0d] text-5xl md:text-7xl uppercase tracking-normal m-0 leading-none"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Best Sellers
        </h2>

        {/* Items Grid */}
        <div className="mt-2 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-0 md:gap-y-2">
          {bestSellers.map((item) => (
            <div key={item.name} className="flex flex-col items-center text-center group cursor-pointer -mt-2">
              <div className="relative w-full h-40 md:h-48 lg:h-52 mb-2">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-contain transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h3 
                className="text-[#4a1c0d] text-xl md:text-2xl uppercase leading-none m-0 mb-1"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                {item.name}
              </h3>
              <p className="text-[#b4860b] text-xl tracking-wider mb-2" style={{ fontFamily: "var(--font-bebas)" }}>
                {item.price}
              </p>
              
              <div className="h-6 w-full flex justify-center items-center">
                <span className="text-[#b4860b] text-xl hidden group-hover:flex items-center gap-1" style={{ fontFamily: "var(--font-bebas)" }}>
                  ORDER 
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 stroke-[3] stroke-current" fill="none" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
