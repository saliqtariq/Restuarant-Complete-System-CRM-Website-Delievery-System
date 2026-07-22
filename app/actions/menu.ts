"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";

// ─── Types ─────────────────────────────────────────────────────────────────────

export type MenuCategory = {
  id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
};

export type MenuItem = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
};

// ─── Categories ───────────────────────────────────────────────────────────────

export async function getMenuCategories(): Promise<MenuCategory[]> {
  const { data, error } = await supabaseAdmin
    .from("menu_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("getMenuCategories error:", error);
    return [];
  }
  return data ?? [];
}

export async function createMenuCategory(
  input: Omit<MenuCategory, "id" | "created_at">
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin.from("menu_categories").insert([input]);

  if (error) {
    console.error("createMenuCategory error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function updateMenuCategory(
  id: string,
  input: Partial<Omit<MenuCategory, "id" | "created_at">>
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("menu_categories")
    .update(input)
    .eq("id", id);

  if (error) {
    console.error("updateMenuCategory error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function deleteMenuCategory(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("menu_categories")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteMenuCategory error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { success: true };
}

// ─── Items ────────────────────────────────────────────────────────────────────

export async function getMenuItems(categoryId?: string): Promise<MenuItem[]> {
  let query = supabaseAdmin
    .from("menu_items")
    .select("*")
    .order("created_at", { ascending: true });

  if (categoryId) {
    query = query.eq("category_id", categoryId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("getMenuItems error:", error);
    return [];
  }
  return data ?? [];
}

export async function createMenuItem(
  input: Omit<MenuItem, "id" | "created_at">
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin.from("menu_items").insert([input]);

  if (error) {
    console.error("createMenuItem error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function updateMenuItem(
  id: string,
  input: Partial<Omit<MenuItem, "id" | "created_at">>
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("menu_items")
    .update(input)
    .eq("id", id);

  if (error) {
    console.error("updateMenuItem error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function deleteMenuItem(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteMenuItem error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/menu");
  return { success: true };
}

export async function toggleItemAvailability(
  id: string,
  isAvailable: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  return updateMenuItem(id, { is_available: isAvailable });
}
