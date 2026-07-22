"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";
import { revalidatePath } from "next/cache";

export type CouponRow = {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  min_order_amount: number;
  is_active: boolean;
  expiry_date: string | null;
  created_at: string;
};

export async function getCoupons(): Promise<CouponRow[]> {
  await requireAdmin();
  const { data, error } = await supabaseAdmin
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getCoupons error:", error);
    return [];
  }
  return data ?? [];
}

export async function createCoupon(
  couponData: Omit<CouponRow, "id" | "created_at">
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin.from("coupons").insert([couponData]);

  if (error) {
    console.error("createCoupon error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/coupons");
  return { success: true };
}

export async function toggleCouponStatus(
  id: string,
  isActive: boolean
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("coupons")
    .update({ is_active: isActive })
    .eq("id", id);

  if (error) {
    console.error("toggleCouponStatus error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/coupons");
  return { success: true };
}

export async function deleteCoupon(
  id: string
): Promise<{ success: boolean; error?: string }> {
  await requireAdmin();
  const { error } = await supabaseAdmin
    .from("coupons")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteCoupon error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/coupons");
  return { success: true };
}
