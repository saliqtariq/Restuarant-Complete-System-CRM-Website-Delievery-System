export type CatalogItem = {
  name: string;
  price: number;
  image: string;
};

const CATALOG: Record<string, CatalogItem> = {
  "outlaw zinger": { name: "Outlaw Zinger", price: 790, image: "/Outlaw zinger withnobg.png" },
  "zinger butcher": { name: "Zinger Butcher", price: 650, image: "/Zinger Butcher No bg.png" },
  "abraham's double stack": {
    name: "Abraham's Double Stack",
    price: 890,
    image: "/Abraham's Double Stack no bg.png",
  },
  "duo box": { name: "Duo Box", price: 1590, image: "/DuoboxPic.png" },
  "family meals": { name: "Family Meals", price: 2450, image: "/FamilyDeal.png" },
  "crispy chicken bucket": {
    name: "Crispy Chicken Bucket",
    price: 1750,
    image: "/ChickenBucket.png",
  },
  "7up regular": {
    name: "7Up Regular",
    price: 180,
    image: "/7upRegularWithoutBG.png",
  },
  "pepsi regular": {
    name: "Pepsi Regular",
    price: 180,
    image: "/PepsiRegularnoBg.png",
  },
  "creamy ranch": {
    name: "Creamy Ranch",
    price: 90,
    image: "/creamyranch.png",
  },
  "garlic sauce": {
    name: "Garlic Sauce",
    price: 90,
    image: "/GarliSauce.png",
  },
  "buffalo sauce": {
    name: "Buffalo Sauce",
    price: 90,
    image: "/BuffaloSauce.png",
  },
  "regular fries": {
    name: "Regular Fries",
    price: 250,
    image: "/RegularFries.png",
  },
  "burger n chicken combo": {
    name: "Burger n Chicken Combo",
    price: 550,
    image: "/Burger n Chicken Combo.png",
  },
  "chicken n chips": {
    name: "CHICKEN N CHIPS",
    price: 1420,
    image: "/BestSellersDeal.png",
  },
  "saucy chicken paratha": {
    name: "SAUCY CHICKEN PARATHA",
    price: 670,
    image: "/SaucyLachParatha.png",
  },
  "twister wrap combo": {
    name: "TWISTER WRAP COMBO",
    price: 760,
    image: "/TwisterCombo.png",
  },
};

export function normalizeItemName(name: string): string {
  return name.trim().toLowerCase();
}

export function getCatalogItem(name: string): CatalogItem | undefined {
  return CATALOG[normalizeItemName(name)];
}

export function parseDisplayPrice(priceStr: string): number {
  const num = priceStr.replace(/[^0-9.]/g, "");
  return parseFloat(num) || 0;
}
