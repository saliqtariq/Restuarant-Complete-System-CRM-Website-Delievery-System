"use server";

import { supabaseAdmin } from "@/backend/supabaseServer";
import { requireAdmin } from "@/lib/auth/admin";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { isValidEmail, normalizeEmail, normalizeText } from "@/lib/security/validation";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";

export type ReviewRow = {
  id: string;
  customer_name: string;
  email: string | null;
  message: string;
  rating: number | null;
  status: "new" | "read";
  created_at: string;
};

const reviewSchema = z.object({
  customer_name: z.string().trim().min(2).max(80),
  email: z.string().trim().max(254).optional().nullable(),
  message: z.string().trim().min(5).max(1000),
  rating: z.number().int().min(1).max(5).nullable().optional(),
});

export async function submitReview(
  data: Omit<ReviewRow, "id" | "status" | "created_at">
): Promise<{ success: boolean; error?: string }> {
  const headerStore = await headers();
  const ip = getClientIp(headerStore);
  const limited = await rateLimit(`review:${ip}`, 5, 60 * 60 * 1000);
  if (limited.limited) {
    return { success: false, error: "Too many submissions. Please try again later." };
  }

  const parsed = reviewSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "Invalid feedback details." };
  }

  const email = parsed.data.email?.trim() || null;
  if (email && !isValidEmail(email)) {
    return { success: false, error: "Invalid email address." };
  }

  const { error } = await supabaseAdmin.from("reviews").insert([
    {
      customer_name: normalizeText(parsed.data.customer_name, 80),
      email: email ? normalizeEmail(email) : null,
      message: normalizeText(parsed.data.message, 1000),
      rating: parsed.data.rating ?? null,
      status: "new",
    },
  ]);

  if (error) {
    console.error("submitReview error:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard/reviews");
  return { success: true };
}

export async function getReviews(): Promise<ReviewRow[]> {
  await requireAdmin();
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
  await requireAdmin();
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
  await requireAdmin();
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
