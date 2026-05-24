import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/features/admin/product-form";
import { notFound } from "next/navigation";

import { serializeProduct } from "@/lib/serializers";

export const metadata = {
  title: "Edit Product | Admin | AURA",
};

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const [productRaw, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: resolvedParams.id },
      include: { inventory: true },
    }),
    prisma.category.findMany()
  ]);

  if (!productRaw) {
    notFound();
  }

  const product = serializeProduct(productRaw);

  return (
    <ProductForm initialData={product} categories={categories} />
  );
}
