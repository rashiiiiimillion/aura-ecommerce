"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";
import { Prisma } from "@prisma/client";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function updateOrderStatus(orderId: string, status: "PENDING" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED") {
  await checkAdmin();
  
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status }
    });
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update order status:", error);
    return { success: false, error: "Failed to update order status" };
  }
}

export async function updatePaymentStatus(orderId: string, status: "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED") {
  await checkAdmin();
  
  try {
    // Update order level paymentStatus and the Payment record if it exists
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      await tx.order.update({
        where: { id: orderId },
        data: { paymentStatus: status }
      });
      
      const payment = await tx.payment.findUnique({ where: { orderId } });
      if (payment) {
        await tx.payment.update({
          where: { orderId },
          data: { status }
        });
      }
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    return { success: true };
  } catch (error) {
    console.error("Failed to update payment status:", error);
    return { success: false, error: "Failed to update payment status" };
  }
}
