"use client";

import { useEffect, useState } from "react";
import { getProductsByIds } from "@/actions/product";
import { ProductCard } from "@/components/features/catalog/product-card";
import { Loader2 } from "lucide-react";
import { SerializedProduct } from "@/types/product";

interface WishlistGridProps {
  itemIds: string[];
}

export function WishlistGrid({ itemIds }: WishlistGridProps) {
  const [products, setProducts] = useState<SerializedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const response = await getProductsByIds(itemIds);
        if ('success' in response && response.success && response.data) {
          setProducts(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (itemIds.length > 0) {
      fetchProducts();
    } else {
      setProducts([]);
      setIsLoading(false);
    }
  }, [itemIds]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground space-y-4">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm uppercase tracking-widest">Loading your wishlist...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
