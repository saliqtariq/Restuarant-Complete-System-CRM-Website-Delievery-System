export type CouponRecord = {
  code: string;
  discount_type: "percentage" | "fixed";
  discount_amount: number;
  min_order_amount: number;
  expiry_date?: string | null;
  is_active?: boolean;
};

export function calculateCouponDiscount(
  coupon: Pick<CouponRecord, "discount_type" | "discount_amount">,
  subtotal: number
): number {
  let discount =
    coupon.discount_type === "percentage"
      ? subtotal * (coupon.discount_amount / 100)
      : coupon.discount_amount;

  return Math.min(discount, subtotal);
}

export function isCouponValid(
  coupon: CouponRecord,
  subtotal: number
): boolean {
  if (coupon.is_active === false) return false;
  if (coupon.expiry_date && new Date(coupon.expiry_date) < new Date()) return false;
  if (subtotal < coupon.min_order_amount) return false;
  return true;
}
