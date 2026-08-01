import { menuData } from "@/lib/menu/data";

export type CatalogItem = {
  name: string;
  price: number;
  image: string;
};

export function parseDisplayPrice(priceStr: string): number {
  const num = priceStr.replace(/[^0-9.]/g, "");
  return parseFloat(num) || 0;
}

const CATALOG: Record<string, CatalogItem> = {};

menuData.forEach((category) => {
  category.items.forEach((item) => {
    const key = item.name.trim().toLowerCase();
    CATALOG[key] = {
      name: item.name,
      price: parseDisplayPrice(item.price),
      image: item.image,
    };
  });
});

export function normalizeItemName(name: string): string {
  return name.trim().toLowerCase();
}

export function getCatalogItem(name: string): CatalogItem | undefined {
  return CATALOG[normalizeItemName(name)];
}
