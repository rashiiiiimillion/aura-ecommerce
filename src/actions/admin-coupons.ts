"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import * as z from "zod";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

const couponSchema = z.object({
  code: z.string().min(3).toUpperCase(),
  discountType: z.enum(["PERCENTAGE", "FIXED"]),
  discountValue: z.number().min(0.01),
  minOrderValue: z.number().optional().nullable(),
  startDate: z.string(),
  endDate: z.string(),
  usageLimit: z.number().optional().nullable(),
  isActive: z.boolean().default(true),
});

export async function createCoupon(data: z.infer<typeof couponSchema>) {
  await checkAdmin();
  
  try {
    const validated = couponSchema.parse(data);

    // Check if code exists
    const existing = await prisma.coupon.findUnique({
      where: { code: validated.code }
    });

    if (existing) {
      return { success: false, error: "Coupon code already exists" };
    }

    await prisma.coupon.create({
      data: {
        ...validated,
        startDate: new Date(validated.startDate),
        endDate: new Date(validated.endDate),
      }
    });

    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to create coupon:", error);
    return { success: false, error: error.message || "Failed to create coupon" };
  }
}

export async function toggleCouponActive(couponId: string, isActive: boolean) {
  await checkAdmin();
  
  try {
    await prisma.coupon.update({
      where: { id: couponId },
      data: { isActive }
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Failed to update coupon:", error);
    return { success: false, error: "Failed to update coupon" };
  }
}

export async function deleteCoupon(couponId: string) {
  await checkAdmin();
  
  try {
    await prisma.coupon.delete({
      where: { id: couponId }
    });
    revalidatePath("/admin/coupons");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete coupon:", error);
    return { success: false, error: "Failed to delete coupon" };
  }
}
