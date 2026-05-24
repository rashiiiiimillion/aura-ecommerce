"use server";

import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";
import { handleActionError, AppError } from "@/lib/utils/errors";
import { revalidatePath, revalidateTag, unstable_cache } from "next/cache";
import { auth } from "@/auth";

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  if (value && typeof value === "object" && "toNumber" in value) {
    return (value as { toNumber: () => number }).toNumber();
  }
  return 0;
};

import { Product, Category, Inventory, Review, User } from "@prisma/client";

type ProductWithRelations = Product & {
  category?: Category | null;
  inventory?: Inventory | null;
  reviews?: (Review & { user: Pick<User, "name" | "image"> })[];
};

const serializeProduct = (product: ProductWithRelations) => ({
  ...product,
  price: toNumber(product.price),
  comparePrice: product.comparePrice ? toNumber(product.comparePrice) : null,
});

const getCachedProducts = unstable_cache(
  async (
    categoryId?: string,
    categorySlug?: string,
    isFeatured?: boolean,
    take?: number
  ) => {
    return prisma.product.findMany({
      where: {
        isActive: true,
        ...(categoryId && { categoryId }),
        ...(categorySlug && { category: { slug: categorySlug } }),
        ...(isFeatured !== undefined && { isFeatured }),
      },
      take,
      include: {
        category: true,
      },
      orderBy: {
        name: "asc",
      },
    });
  },
  ["catalog-products"],
  { revalidate: 300, tags: ["products"] }
);

const getCachedProductBySlug = unstable_cache(
  async (slug: string) => {
    return prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        category: true,
        inventory: true,
        reviews: {
          where: { isApproved: true },
          include: { user: { select: { name: true, image: true } } },
        },
      },
    });
  },
  ["catalog-product-by-slug"],
  { revalidate: 300, tags: ["products"] }
);

const getCachedProductSlugs = unstable_cache(
  async () => {
    return prisma.product.findMany({
      where: { isActive: true },
      select: { slug: true },
      orderBy: { name: "asc" },
    });
  },
  ["catalog-product-slugs"],
  { revalidate: 300, tags: ["products"] }
);

export async function createProduct(data: unknown) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      throw new AppError("Unauthorized access", 401);
    }

    const validatedData = productSchema.parse(data);
    
    const product = await prisma.product.create({
      data: {
        name: validatedData.name,
        slug: validatedData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        description: validatedData.description,
        price: validatedData.price,
        comparePrice: validatedData.comparePrice,
        categoryId: validatedData.categoryId,
        images: validatedData.images,
        isFeatured: validatedData.isFeatured,
        isActive: validatedData.isActive,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/collections");
    revalidateTag("products", "max");
    
    const serializedProduct = {
      ...product,
      price: product.price.toNumber(),
      comparePrice: product.comparePrice ? product.comparePrice.toNumber() : null,
    };
    
    return { success: true, data: serializedProduct };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getProducts(options?: {
  categoryId?: string;
  categorySlug?: string;
  isFeatured?: boolean;
  take?: number;
}) {
  try {
    const products = await getCachedProducts(
      options?.categoryId,
      options?.categorySlug,
      options?.isFeatured,
      options?.take
    );

    return { success: true, data: products.map(serializeProduct) };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await getCachedProductBySlug(slug);

    if (!product) throw new AppError("Product not found", 404);

    return { success: true, data: serializeProduct(product) };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getProductSlugs() {
  try {
    const products = await getCachedProductSlugs();
    return { success: true, data: products };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getProductsByIds(ids: string[]) {
  try {
    if (!ids.length) return { success: true, data: [] };
    
    const products = await prisma.product.findMany({
      where: {
        id: { in: ids },
        isActive: true,
      },
      include: {
        category: true,
      },
    });

    const serializedProducts = products.map(serializeProduct);

    // Ensure the returned array maintains the order of the ids passed in (for consistent wishlist ordering)
    const orderedProducts = ids
      .map(id => serializedProducts.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => p !== undefined);

    return { success: true, data: orderedProducts };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function searchProducts(query: string) {
  try {
    if (!query.trim()) return { success: true, data: [] };
    
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { name: { contains: query, mode: 'insensitive' } } },
        ],
      },
      take: 10,
      include: {
        category: true,
      },
      orderBy: [
        { isFeatured: "desc" },
        { name: "asc" },
      ],
    });

    const serializedProducts = products.map(serializeProduct);

    return { success: true, data: serializedProducts };
  } catch (error) {
    return handleActionError(error);
  }
}
