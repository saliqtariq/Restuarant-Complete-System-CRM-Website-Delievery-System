"use client";

import Image from "next/image";
import { useCartStore } from "@/lib/cartStore";
import { useToastStore } from "@/components/Toast";
import { useState, useRef, useEffect } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import CartSidebar from "./CartSidebar";

type MenuItem = {
  name: string;
  price: string;
  image: string;
  serves: string;
};

// Dummy Data
export const menuData = [
  {
    id: "la-carta-combos",
    title: "LA Carta & Combos",
    items: [
      { name: "Outlaw Zinger", price: "RS 790", image: "/Outlaw zinger withnobg.png", serves: "Premium crispy chicken fillet, cheese, spicy mayo" },
      { name: "Zinger Butcher", price: "RS 650", image: "/Zinger Butcher No bg.png", serves: "Crispy chicken fillet with fresh lettuce and mayo" },
      { name: "Abraham's Double Stack", price: "RS 890", image: "/Abraham's Double Stack no bg.png", serves: "Two crispy fillets with double cheese" },
    ]
  },
  {
    id: "signature-boxes",
    title: "Signature Boxes",
    items: [
      { name: "Duo Box", price: "RS 1590", image: "/DuoBoxnoBG.png", serves: "Serves 2 persons" },
      { name: "Family Meals", price: "RS 2450", image: "/FamilyDealNobg.png", serves: "Serves 4-6 people" },
    ]
  },
  {
    id: "snacks-beverages",
    title: "Snacks & Beverages",
    items: [
      { name: "Crispy Chicken Bucket", price: "RS 1750", image: "/Crispy Wings Bucket.png", serves: "Serves 2-3 persons" },
      { name: "7Up Regular", price: "RS 180", image: "/7upRegularWithoutBG.png", serves: "Refreshing 345ml drink" },
      { name: "Pepsi Regular", price: "RS 180", image: "/PepsiRegularnoBg.png", serves: "Chilled 345ml drink" },
      { name: "Regular Fries", price: "RS 250", image: "/RegularFries.png", serves: "Crispy golden salted fries" },
    ]
  },
  {
    id: "condiments",
    title: "Condiments",
    items: [
      { name: "Creamy Ranch", price: "RS 90", image: "/creamyranch.png", serves: "Rich & creamy dip sauce" },
      { name: "Garlic Sauce", price: "RS 90", image: "/GarliSauce.png", serves: "Signature garlic dip" },
      { name: "Buffalo Sauce", price: "RS 90", image: "/BuffaloSauce.png", serves: "Tangy & spicy buffalo dip" },
    ]
  },
  {
    id: "everyday-value",
    title: "Everyday Value",
    items: [
      { name: "Burger n Chicken Combo", price: "RS 550", image: "/Burger n Chicken ComboNobg.png", serves: "1 burger and 1 piece of crispy chicken" },
    ]
  }
];

export default function MenuCategoryList() {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const addToast = useToastStore((s) => s.addToast);

  const [activeCategory, setActiveCategory] = useState(menuData[0].id);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [blockedItems, setBlockedItems] = useState<Record<string, boolean>>({});
  const clickCountsRef = useRef<Record<string, number>>({});

  // Setup intersection observer to update the active tab while scrolling
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      { rootMargin: "-20% 0px -80% 0px" } // Adjust these values to trigger when section is near top
    );

    menuData.forEach((cat) => {
      const el = document.getElementById(cat.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollTo = (id: string) => {
    setActiveCategory(id);
    const element = document.getElementById(id);
    if (element) {
      // Offset by approx header height + sticky nav height
      const y = element.getBoundingClientRect().top + window.scrollY - 150;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleIncrease = (item: MenuItem, cartItem?: { quantity: number }) => {
    const currentCount = clickCountsRef.current[item.name] || 0;
    if (currentCount >= 2) return;

    clickCountsRef.current[item.name] = currentCount + 1;

    if (currentCount + 1 >= 2) {
      setBlockedItems((prev) => ({ ...prev, [item.name]: true }));
      setTimeout(() => {
        setBlockedItems((prev) => ({ ...prev, [item.name]: false }));
        clickCountsRef.current[item.name] = 0;
      }, 1500);
    } else {
      setTimeout(() => {
        if (clickCountsRef.current[item.name] === 1) {
          clickCountsRef.current[item.name] = 0;
        }
      }, 2000);
    }

    if (cartItem) {
      updateQuantity(item.name, cartItem.quantity + 1);
    } else {
      addItem({ name: item.name, price: item.price, image: item.image });
      addToast({ name: item.name, image: item.image, price: item.price, description: "Added to bucket" });
      setAddedItem(item.name);
      setTimeout(() => setAddedItem(null), 1200);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="sticky top-[16px] z-40 bg-white/80 backdrop-blur-md shadow-sm border border-gray-100 rounded-full px-2 py-2 mb-6 md:mt-0 transition-all">
        <div className="flex overflow-x-auto no-scrollbar gap-2 items-center">
          {menuData.map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleScrollTo(cat.id)}
              className={`flex-shrink-0 px-6 py-2 rounded-full font-bold text-sm transition-all duration-300 uppercase tracking-widest ${activeCategory === cat.id
                  ? "bg-[#e5002a] text-white shadow-md scale-105"
                  : "bg-transparent text-gray-500 hover:text-black hover:bg-gray-100"
                }`}
              style={{ fontFamily: "var(--font-bebas)" }}
            >
              {cat.title}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Sections and Cart Layout */}
      <div className="flex flex-col md:flex-row gap-8 relative items-start mt-6">
        {/* Left Side: Items */}
        <div className="flex-1 w-full flex flex-col gap-16 px-2 md:px-0 pb-20">
          {menuData.map((category) => (
            <div key={category.id} id={category.id} className="scroll-mt-[150px]">
              <h2
                className="text-[#2b2b36] text-4xl uppercase tracking-wider mb-6 border-b-2 border-[#e5002a] pb-2 inline-block"
                style={{ fontFamily: "var(--font-bebas)" }}
              >
                {category.title}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {category.items.map((item) => (
                  <div
                    key={item.name}
                    className="bg-white rounded-2xl p-5 flex flex-col items-center text-center shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] hover:shadow-lg transition-all duration-300 border border-gray-100 group"
                  >
                    <div className="relative w-full h-44 mb-4 flex items-center justify-center">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 45vw, (max-width: 1280px) 30vw, 22vw"
                        className="object-contain transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
                        loading="lazy"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between w-full text-left">
                      <div>
                        <h3 className="text-[#2b2b36] font-bold text-xl mb-1 leading-tight tracking-wide" style={{ fontFamily: "var(--font-bebas)" }}>
                          {item.name}
                        </h3>
                        {item.serves && (
                          <p className="text-gray-500 text-xs mb-4 line-clamp-2 leading-relaxed">
                            {item.serves}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100/60">
                        <p className="text-[#2b2b36] font-bold text-xl mb-0" style={{ fontFamily: "var(--font-bebas)" }}>
                          {item.price}
                        </p>

                        <div>
                          {items.find(i => i.name === item.name) ? (() => {
                            const cartItem = items.find(i => i.name === item.name)!;
                            return (
                              <div className="flex items-center gap-2 bg-[#e5002a] px-2 py-1 rounded-full shadow-sm">
                                <button
                                  onClick={() => cartItem.quantity > 1 ? updateQuantity(item.name, cartItem.quantity - 1) : removeItem(item.name)}
                                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#e5002a] hover:bg-gray-100 transition-colors"
                                >
                                  {cartItem.quantity > 1 ? <Minus size={12} strokeWidth={3} /> : <Trash2 size={12} strokeWidth={2.5} />}
                                </button>
                                <span className="text-white text-sm font-bold min-w-[1.2rem] text-center">
                                  {cartItem.quantity}
                                </span>
                                <button
                                  disabled={blockedItems[item.name]}
                                  onClick={() => handleIncrease(item, cartItem)}
                                  className={`w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#e5002a] transition-colors ${blockedItems[item.name] ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                                >
                                  <Plus size={12} strokeWidth={3} />
                                </button>
                              </div>
                            );
                          })() : (
                            <button
                              disabled={blockedItems[item.name]}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleIncrease(item);
                              }}
                              className={`bg-[#e5002a] text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 rounded-full transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-1 ${blockedItems[item.name] ? 'opacity-60 cursor-not-allowed' : 'hover:bg-[#c40024] hover:-translate-y-0.5'}`}
                            >
                              {blockedItems[item.name] ? "WAIT" : addedItem === item.name ? "ADDED ✓" : "+ ADD TO BUCKET"}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side: Sticky Cart Sidebar */}
        <div className="w-full md:w-[320px] xl:w-[380px] shrink-0 relative z-30">
          <CartSidebar />
        </div>
      </div>
    </div>
  );
}
