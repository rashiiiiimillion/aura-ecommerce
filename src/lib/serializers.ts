import { Prisma } from "@prisma/client";

/**
 * Safely converts any Prisma Decimal to a standard JavaScript Number.
 */
export function serializeDecimal(val: Prisma.Decimal | number | string | null | undefined): number {
  if (val === null || val === undefined) return 0;
  return Number(val);
}

/**
 * Safely converts an optional Prisma Decimal to a number or null.
 */
export function serializeOptionalDecimal(val: Prisma.Decimal | number | string | null | undefined): number | null {
  if (val === null || val === undefined) return null;
  return Number(val);
}

/**
 * Serializes a Product object, ensuring Decimal fields (price, comparePrice)
 * are standard numbers for safe passing to Client Components.
 */
export function serializeProduct(product: any) {
  if (!product) return product;
  return {
    ...product,
    price: serializeDecimal(product.price),
    comparePrice: serializeOptionalDecimal(product.comparePrice),
  };
}

/**
 * Serializes an Order object, ensuring Decimal fields are standard numbers.
 */
export function serializeOrder(order: any) {
  if (!order) return order;
  return {
    ...order,
    total: serializeDecimal(order.total),
    items: order.items?.map((item: any) => ({
      ...item,
      price: serializeDecimal(item.price),
      product: item.product ? serializeProduct(item.product) : undefined
    })),
    payment: order.payment ? {
      ...order.payment,
      amount: serializeDecimal(order.payment.amount)
    } : undefined
  };
}

/**
 * Serializes a Coupon object, ensuring Decimal fields are standard numbers.
 */
export function serializeCoupon(coupon: any) {
  if (!coupon) return coupon;
  return {
    ...coupon,
    discountValue: serializeDecimal(coupon.discountValue),
    minOrderValue: serializeOptionalDecimal(coupon.minOrderValue),
  };
}
