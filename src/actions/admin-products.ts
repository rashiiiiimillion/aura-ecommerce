"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { productSchema } from "@/lib/validations";
import { auth } from "../auth";

async function checkAdmin() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
}

export async function deleteProduct(productId: string) {
  await checkAdmin();
  
  try {
    const orderItemsCount = await prisma.orderItem.count({
      where: { productId }
    });

    if (orderItemsCount > 0) {
      // Soft archive if product has been ordered
      await prisma.product.update({
        where: { id: productId },
        data: { isActive: false }
      });
    } else {
      // Hard delete if product has never been ordered
      await prisma.product.delete({
        where: { id: productId }
      });
    }

    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/admin/products");
    revalidatePath("/product/[slug]", "page");
    revalidateTag("products");

    return { 
      success: true, 
      action: orderItemsCount > 0 ? "archived" : "deleted",
      message: orderItemsCount > 0 
        ? "Product archived successfully. It has been hidden from the storefront because it is part of past orders."
        : "Product deleted successfully." 
    };
  } catch (error) {
    console.error("Failed to delete product:", error);
    return { success: false, error: "Failed to delete product" };
  }
}

export async function toggleFeaturedProduct(productId: string, isFeatured: boolean) {
  await checkAdmin();
  
  try {
    await prisma.product.update({
      where: { id: productId },
      data: { isFeatured }
    });
    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/admin/products");
    revalidatePath("/product/[slug]", "page");
    revalidateTag("products");
    return { success: true };
  } catch (error) {
    console.error("Failed to toggle featured status:", error);
    return { success: false, error: "Failed to update product" };
  }
}

export async function checkSlugAvailability(slug: string, currentProductId?: string) {
  await checkAdmin();
  
  try {
    // Generate base slug
    const baseSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    if (!baseSlug) return { available: false, suggestedSlug: "" };

    let currentSlug = baseSlug;
    let counter = 2;
    let isAvailable = false;

    // Keep checking until we find an available slug
    while (!isAvailable) {
      const existing = await prisma.product.findUnique({
        where: { slug: currentSlug }
      });

      // If it doesn't exist, or it belongs to the current product, it's available
      if (!existing || existing.id === currentProductId) {
        isAvailable = true;
      } else {
        // If taken, append counter and try again
        currentSlug = `${baseSlug}-${counter}`;
        counter++;
      }
    }

    return { 
      available: currentSlug === slug, 
      suggestedSlug: currentSlug 
    };
  } catch (error) {
    console.error("Failed to check slug availability:", error);
    return { available: false, suggestedSlug: "" };
  }
}

export async function saveProduct(data: any) {
  await checkAdmin();

  try {
    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      console.error("Validation failed:", parsed.error.flatten());
      return { success: false, error: "Invalid product data provided." };
    }

    const { id, inventory, sku, categoryId, ...productData } = parsed.data;

    // Pre-save slug validation
    const existingSlug = await prisma.product.findUnique({
      where: { slug: productData.slug }
    });

    if (existingSlug && existingSlug.id !== id) {
      return { success: false, error: "This product URL slug already exists. Please choose a unique slug." };
    }

    if (id) {
      // Update
      await prisma.product.update({
        where: { id },
        data: {
          ...productData,
          category: { connect: { id: categoryId } },
          inventory: {
            upsert: {
              create: {
                quantity: inventory,
                sku: sku,
              },
              update: {
                quantity: inventory,
                sku: sku,
              }
            }
          }
        }
      });
    } else {
      // Create
      await prisma.product.create({
        data: {
          ...productData,
          category: { connect: { id: categoryId } },
          inventory: {
            create: {
              quantity: inventory,
              sku: sku,
            }
          }
        }
      });
    }

    revalidatePath("/");
    revalidatePath("/collections");
    revalidatePath("/admin/products");
    revalidatePath("/product/[slug]", "page");
    revalidateTag("products");
    return { success: true };
  } catch (error: any) {
    console.error("Failed to save product:", error);
    if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
      return { success: false, error: "A product with this URL slug already exists." };
    }
    return { success: false, error: error.message || "Failed to save product due to an unexpected error." };
  }
}
