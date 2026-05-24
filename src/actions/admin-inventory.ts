"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "../auth";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function updateInventoryQuantity(inventoryId: string, quantity: number) {
  await checkAdmin();
  
  try {
    await prisma.inventory.update({
      where: { id: inventoryId },
      data: { quantity }
    });
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/admin/products");
    revalidatePath("/admin/inventory");
    revalidatePath("/product/[slug]", "page");
    return { success: true };
  } catch (error) {
    console.error("Failed to update inventory:", error);
    return { success: false, error: "Failed to update inventory" };
  }
}
