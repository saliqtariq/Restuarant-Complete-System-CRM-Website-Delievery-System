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
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {bestSellers.map((item) => (
            <div key={item.name} className="flex flex-col items-center text-center group cursor-pointer">
              <div className="w-full h-64 md:h-72 lg:h-80 mb-4 flex items-center justify-center">
                <img 
                  src={item.image} 
                  alt={item.name} 
                  className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
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
