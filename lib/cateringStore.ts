"use client";

import { create } from "zustand";

export interface CateringBuilderItem {
  id: string;
  name: string;
  pricePerUnit: number;
  image: string;
  category: "burgers" | "fries" | "sauces" | "drinks" | "preset";
}

/** All builder items + preset box items */
export const BUILDER_ITEMS: CateringBuilderItem[] = [
  // Burgers (bulk per piece)
  { id: "b1", name: "Abraham's Double Smash Burger", pricePerUnit: 590, image: "/Abraham's Double Stack no bg.png", category: "burgers" },
  { id: "b2", name: "Outlaw Spicy Beef Burger", pricePerUnit: 640, image: "/Outlaw zinger withnobg.png", category: "burgers" },
  { id: "b3", name: "Zinger Butcher Crispy Chicken", pricePerUnit: 520, image: "/Zinger Butcher No bg.png", category: "burgers" },

  // Fries Buckets
  { id: "f3", name: "XL Regular Fries Bucket", pricePerUnit: 450, image: "/RegularFries.png", category: "fries" },

  // Bulk Dip Pots
  { id: "s1", name: "Garlic Mayo Dip Tub (250ml)", pricePerUnit: 180, image: "/GarliSauce.png", category: "sauces" },
  { id: "s2", name: "Creamy Ranch Dip Tub (250ml)", pricePerUnit: 180, image: "/creamyranch.png", category: "sauces" },
  { id: "s3", name: "Buffalo Dip Tub (250ml)", pricePerUnit: 190, image: "/BuffaloSauce.png", category: "sauces" },

  // Drinks
  { id: "d2", name: "7Up Can Pack (6 Cans)", pricePerUnit: 550, image: "/7upRegularWithoutBG.png", category: "drinks" },
  { id: "d3", name: "Pepsi Can Pack (6 Cans)", pricePerUnit: 550, image: "/PepsiRegularnoBg.png", category: "drinks" },
];

/** Preset box definitions used by PresetBoxes component */
export interface PresetBoxDef {
  id: string;
  storeItemId: string;      // ID used in the quantities map
  name: string;
  tagline: string;
  serves: string;
  price: number;
  image: string;
  includes: string[];
}

export const PRESET_BOXES: PresetBoxDef[] = [
  {
    id: "party-fries-box",
    storeItemId: "preset-fries",
    name: "Party Fries Box",
    tagline: "Crispy, golden fries for the whole crew",
    serves: "Serves 8 - 10 Persons",
    price: 3490,
    image: "/FriesBox.png",
    includes: ["12x Seasoned Fries (Salted, Masala & Peri Peri Mix)"],
  },
  {
    id: "catering-burger-box",
    storeItemId: "preset-burgers",
    name: "Catering Burger Box",
    tagline: "Premium smash burgers packed & ready to serve",
    serves: "Serves 10 - 12 Persons",
    price: 8490,
    image: "/CateringBox.png",
    includes: ["12x Signature Gourmet Burgers (Beef & Chicken Mix)"],
  },
  {
    id: "drinks-box",
    storeItemId: "preset-drinks",
    name: "Party Drinks Box",
    tagline: "Ice-cold refreshments for every guest",
    serves: "Serves 15 - 20 Persons",
    price: 4990,
    image: "/DrinksBox.png",
    includes: ["20x Chilled Soft Drinks (345ml Cans, Assorted Flavors)"],
  },
];

/** Items representing preset boxes inside the quantities map */
export const PRESET_STORE_ITEMS: CateringBuilderItem[] = PRESET_BOXES.map((b) => ({
  id: b.storeItemId,
  name: b.name,
  pricePerUnit: b.price,
  image: b.image,
  category: "preset" as const,
}));

/** Combined items list for price calculations */
export const ALL_CATERING_ITEMS: CateringBuilderItem[] = [
  ...BUILDER_ITEMS,
  ...PRESET_STORE_ITEMS,
];

interface CateringState {
  quantities: Record<string, number>;
  boxName: string;
  setBoxName: (name: string) => void;
  changeQuantity: (id: string, delta: number) => void;
  setQuantity: (id: string, qty: number) => void;
  totalCount: () => number;
  totalPrice: () => number;
  reset: () => void;
}

export const useCateringStore = create<CateringState>((set, get) => ({
  quantities: {},
  boxName: "Custom Family Party Box",
  setBoxName: (name) => set({ boxName: name }),

  changeQuantity: (id, delta) =>
    set((s) => {
      const current = s.quantities[id] || 0;
      const next = Math.max(0, current + delta);
      return { quantities: { ...s.quantities, [id]: next } };
    }),

  setQuantity: (id, qty) =>
    set((s) => ({ quantities: { ...s.quantities, [id]: Math.max(0, qty) } })),

  totalCount: () =>
    Object.values(get().quantities).reduce((a, b) => a + b, 0),

  totalPrice: () =>
    ALL_CATERING_ITEMS.reduce((sum, item) => {
      const q = get().quantities[item.id] || 0;
      return sum + q * item.pricePerUnit;
    }, 0),

  reset: () => set({ quantities: {}, boxName: "Custom Family Party Box" }),
}));
