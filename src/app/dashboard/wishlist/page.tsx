"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { useHydrated } from "@/store/useStore";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { getProductsByIds } from "@/actions/product";
import { toast } from "sonner";
import { useCartStore, CartItem } from "@/store/useCartStore";
import Image from "next/image";
import { SerializedProduct } from "@/types/product";

export default function DashboardWishlistPage() {
  const isHydrated = useHydrated();
  const { items: wishlistIds, removeItem } = useWishlistStore();
  const { addItem: addToCart } = useCartStore();
  const [products, setProducts] = useState<SerializedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlistIds.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      try {
        const result = await getProductsByIds(wishlistIds);
        if ("success" in result && result.success) {
          setProducts(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch wishlist products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isHydrated) {
      fetchProducts();
    }
  }, [isHydrated, wishlistIds]);

  const handleAddToCart = useCallback((product: SerializedProduct) => {
    const cartItem: CartItem = {
      id: crypto.randomUUID(),
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0] || "/placeholder.svg",
      quantity: 1,
    };
    addToCart(cartItem);
    toast.success("Added to cart");
  }, [addToCart]);

  if (!isHydrated || isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-muted" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-light uppercase tracking-wide">Wishlist</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
          {wishlistIds.length} items saved for later
        </p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {products.map((product) => (
            <div key={product.id} className="group relative flex gap-4 md:gap-6 p-4 md:p-6 border border-border/50 bg-white dark:bg-[#111] transition-all hover:border-foreground/30">
              <div className="relative w-20 h-28 md:w-24 md:h-32 bg-[#f5f5f7] dark:bg-[#111] shrink-0 overflow-hidden">
                <Image
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              </div>
              <div className="flex-1 flex flex-col justify-between py-1">
                <div>
                  {product.category?.name && (
                    <p className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-1">{product.category.name}</p>
                  )}
                  <h4 className="text-[10px] uppercase tracking-widest font-medium">{product.name}</h4>
                  <p className="text-xs font-light mt-1">${Number(product.price).toFixed(2)}</p>
                </div>
                <div className="flex items-center gap-4 relative z-10">
                  <button
                    onClick={() => handleAddToCart(product)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-semibold hover:text-muted-foreground transition-colors"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeItem(product.id)}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
              <Link href={`/product/${product.slug}`} className="absolute inset-0 z-0" aria-label="View product" />
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-border/50">
          <Heart className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Your wishlist is empty</p>
          <Link href="/collections" className="inline-block text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 hover:text-foreground transition-colors">
            Explore Collections
          </Link>
        </div>
      )}
    </div>
  );
}
