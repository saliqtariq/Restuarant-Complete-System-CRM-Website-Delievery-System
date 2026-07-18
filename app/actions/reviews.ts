"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { revalidatePath } from "next/cache";

export type ReviewRow = {
  id: string;
  customer_name: string;
  email: string | null;
  message: string;
  rating: number | null;
  status: "new" | "read";
  created_at: string;
};

export async function submitReview(
  data: Omit<ReviewRow, "id" | "status" | "created_at">
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin.from("reviews").insert([
    { ...data, status: "new" }
  ]);

  if (error) {
    console.error("submitReview error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/reviews");
  return { success: true };
}

export async function getReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getReviews error:", error);
    return [];
  }
  return data ?? [];
}

export async function markReviewAsRead(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from("reviews")
    .update({ status: "read" })
    .eq("id", id);

  if (error) {
    console.error("markReviewAsRead error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/reviews");
  return { success: true };
}

export async function deleteReview(
  id: string
): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabaseAdmin
    .from("reviews")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("deleteReview error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/reviews");
  return { success: true };
}
