import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/features/admin/product-form";

export const metadata = {
  title: "New Product | Admin | AURA",
};

export default async function NewProductPage() {
  const categories = await prisma.category.findMany();

  return (
    <ProductForm categories={categories} />
  );
}
