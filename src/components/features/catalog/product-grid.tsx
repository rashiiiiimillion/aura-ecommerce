"use client";

import { ProductCard } from "./product-card";
import { SerializedProduct } from "@/types/product";

interface ProductGridProps {
  products: SerializedProduct[];
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
