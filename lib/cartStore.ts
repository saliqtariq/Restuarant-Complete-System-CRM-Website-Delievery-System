import { create } from "zustand";

export interface CartItem {
  name: string;
  price: string;
  image: string;
  quantity: number;
}

interface CartState {
  orderType: "delivery" | "pickup" | null;
  locationDetails: string | null;
  setLocation: (type: "delivery" | "pickup" | null, details: string | null) => void;
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (name: string) => void;
  updateQuantity: (name: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

/** Extract the numeric price from strings like "RS 550" */
function parsePrice(priceStr: string): number {
  const num = priceStr.replace(/[^0-9]/g, "");
  return parseInt(num, 10) || 0;
}

export const useCartStore = create<CartState>((set, get) => ({
  orderType: null,
  locationDetails: null,
  setLocation: (type, details) => set({ orderType: type, locationDetails: details }),
  items: [],

  addItem: (item) =>
    set((state) => {
      const existing = state.items.find((i) => i.name === item.name);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.name === item.name ? { ...i, quantity: i.quantity + 1 } : i
          ),
        };
      }
      return { items: [...state.items, { ...item, quantity: 1 }] };
    }),

  removeItem: (name) =>
    set((state) => ({
      items: state.items.filter((i) => i.name !== name),
    })),

  updateQuantity: (name, quantity) =>
    set((state) => {
      if (quantity <= 0) {
        return { items: state.items.filter((i) => i.name !== name) };
      }
      return {
        items: state.items.map((i) =>
          i.name === name ? { ...i, quantity } : i
        ),
      };
    }),

  clearCart: () => set({ items: [] }),

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  totalPrice: () =>
    get().items.reduce((sum, i) => sum + parsePrice(i.price) * i.quantity, 0),
}));
