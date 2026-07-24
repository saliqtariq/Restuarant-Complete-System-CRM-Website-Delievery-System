import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/backend/supabaseServer";
import { getClientIp, rateLimit } from "@/lib/security/rateLimit";
import { readJsonBody } from "@/lib/security/request";
import { z } from "zod";

const validateCouponSchema = z.object({
  code: z.string().trim().min(1).max(50),
  subtotal: z.number().min(0),
});

export async function POST(req: Request) {
  try {
    const ip = getClientIp(req.headers);
    const limited = await rateLimit(`coupon:${ip}`, 20, 10 * 60 * 1000);
    if (limited.limited) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later." },
        { status: 429, headers: { "Retry-After": String(limited.retryAfter) } }
      );
    }

    const body = await readJsonBody<unknown>(req, 10_000);
    const parsed = validateCouponSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const { code, subtotal } = parsed.data;

    const { data: coupon, error } = await supabaseAdmin
      .from("coupons")
      .select("*")
      .eq("code", code)
      .eq("is_active", true)
      .single();

    if (error || !coupon) {
      return NextResponse.json({ error: "Invalid or expired coupon" }, { status: 404 });
    }

    if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) {
      return NextResponse.json({ error: "Coupon has expired" }, { status: 400 });
    }

    if (subtotal < coupon.min_order_amount) {
      return NextResponse.json(
        { error: `Minimum order amount for this coupon is RS ${coupon.min_order_amount}` },
        { status: 400 }
      );
    }

    let discountAmount = 0;
    if (coupon.discount_type === "percentage") {
      discountAmount = subtotal * (coupon.discount_amount / 100);
    } else {
      discountAmount = coupon.discount_amount;
    }

    // Ensure discount doesn't exceed subtotal
    discountAmount = Math.min(discountAmount, subtotal);

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discount_amount: discountAmount,
        original_discount: coupon.discount_amount,
        type: coupon.discount_type
      }
    });
  } catch (error) {
    console.error("Coupon Validate API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
