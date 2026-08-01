"use client";

import { useState, useRef, useCallback } from "react";
import { useCartStore } from "@/lib/cartStore";
import { useToastStore } from "@/components/Toast";

export type CartMenuItem = {
  name: string;
  price: string;
  image: string;
};

export function useCartItemActions(toastDescription?: string) {
  const { items, addItem, updateQuantity, removeItem } = useCartStore();
  const addToast = useToastStore((s) => s.addToast);
  const [addedItem, setAddedItem] = useState<string | null>(null);
  const [blockedItems, setBlockedItems] = useState<Record<string, boolean>>({});
  const clickCountsRef = useRef<Record<string, number>>({});

  const handleIncrease = useCallback(
    (item: CartMenuItem, cartItem?: { quantity: number }) => {
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
        addToast({
          name: item.name,
          image: item.image,
          price: item.price,
          ...(toastDescription ? { description: toastDescription } : {}),
        });
        setAddedItem(item.name);
        setTimeout(() => setAddedItem(null), 1200);
      }
    },
    [addItem, addToast, toastDescription, updateQuantity]
  );

  return {
    items,
    addItem,
    updateQuantity,
    removeItem,
    addedItem,
    blockedItems,
    handleIncrease,
  };
}
