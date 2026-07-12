import React from "react";
import Image from "next/image";

export default function OurValues() {
  const ingredients = [
    { id: 1, src: '/chickenraw.png', alt: 'Chicken' },
    { id: 2, src: '/Lime Juice.png', alt: 'Lime Juice' },
    { id: 3, src: '/Jelepenos.png', alt: 'Jalapeños' },
    { id: 4, src: '/Bellpepper.png', alt: 'Bell Pepper' },
    { id: 5, src: '/Onion.png', alt: 'Onion' },
    { id: 6, src: '/Garli.png', alt: 'Garlic' },
    ...Array.from({ length: 8 }).map((_, i) => ({ id: i + 7, src: '', alt: `Image ${i + 7}` }))
  ];

  return (
    <section className="w-full bg-white pb-16">
      {/* Title Area with Background Image */}
      <div 
        className="w-full py-24 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/updatedbgpic.png')" }}
      >
        <h2 
          className="text-white text-5xl md:text-7xl font-extrabold uppercase tracking-widest text-center"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          Our Values
        </h2>
      </div>

      {/* Full-width Text with Background Video */}
      <div className="w-full relative overflow-hidden min-h-[400px] flex items-center justify-center">
        {/* Background Video */}
        <video 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
        >
          <source src="/freshveg.mp4" type="video/mp4" />
        </video>
        
        {/* Dark Overlay */}
        <div className="absolute top-0 left-0 w-full h-full bg-black/40 z-10"></div>

        {/* Text Content */}
        <div className="relative z-20 p-8 md:p-16 text-center max-w-5xl mx-auto">
          <p className="text-white text-2xl md:text-4xl font-bold uppercase leading-relaxed tracking-wider shadow-sm drop-shadow-md">
            We believe great meals begin with premium ingredients. Using quality halal chicken and local ingredients from trusted suppliers
          </p>
        </div>
      </div>

      {/* Heading */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 flex flex-col items-center">
        <h3 
          className="text-[#451400] text-3xl md:text-5xl font-black uppercase tracking-wide text-center"
          style={{ fontFamily: "var(--font-anton)" }}
        >
          We&apos;re Passionate About Our Food
        </h3>
      </div>

      {/* Ingredients Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 mb-24">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-x-4 gap-y-12 place-items-center">
          {ingredients.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-col items-center justify-start group cursor-pointer w-full"
            >
              {item.src ? (
                <>
                  {/* Image Container with Hover Background */}
                  <div className="w-28 h-28 md:w-32 md:h-32 rounded-full flex items-center justify-center relative transition-colors duration-300 group-hover:bg-[#f4ede4]">
                    <Image 
                      src={item.src} 
                      alt={item.alt} 
                      fill 
                      className="object-contain p-4 group-hover:scale-110 transition-transform duration-300" 
                    />
                  </div>
                  {/* Text Below */}
                  <span className="mt-4 text-[#5c4a43] font-bold text-center text-sm md:text-base uppercase tracking-wide opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {item.alt}
                  </span>
                </>
              ) : (
                <div className="w-24 h-24 md:w-28 md:h-28 bg-gray-100 rounded-full flex flex-col items-center justify-center border border-gray-200">
                  <span className="text-gray-400 text-xs text-center font-bold px-2">{item.alt}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
