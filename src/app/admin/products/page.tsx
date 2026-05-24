import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Edit, Trash2 } from "lucide-react";
import AddProductButton from "@/components/features/admin/add-product-button";
import { Card, CardContent } from "@/components/ui/card";
import { deleteProduct } from "@/actions/admin-products";
import { ProductListClient } from "@/components/features/admin/product-list-client";

import { serializeProduct } from "@/lib/serializers";

export const metadata = {
  title: "Products | Admin | AURA",
};

export default async function AdminProductsPage() {
  const productsRaw = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: true,
      inventory: true,
      _count: {
        select: { orderItems: true }
      }
    }
  });

  const products = productsRaw.map(serializeProduct);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end relative z-40">
        <div>
          <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Products</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
            Manage your catalog
          </p>
        </div>
        <div className="relative z-50 pointer-events-auto">
          <AddProductButton />
        </div>
      </div>

      <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
        <CardContent className="p-0">
          <ProductListClient products={products} />
        </CardContent>
      </Card>
    </div>
  );
}
