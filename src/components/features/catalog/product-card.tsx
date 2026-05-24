"use client";

import Link from "next/link";
import Image from "next/image";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useHydrated } from "@/store/useStore";
import { Heart, ShoppingBag } from "lucide-react";
import { memo, useState } from "react";
import { SerializedProduct } from "@/types/product";

interface ProductCardProps {
  product: SerializedProduct;
}

function ProductCardComponent({ product }: ProductCardProps) {
  const isHydrated = useHydrated();
  const addItem = useCartStore((state) => state.addItem);
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  
  const isWishlisted = isHydrated && wishlistItems.includes(product.id);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = product.images?.length ? product.images : ["/placeholder.svg"];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: Math.random().toString(),
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: images[0],
      quantity: 1,
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isHydrated) return;
    toggleItem(product.id);
  };

  return (
    <div className="group relative flex flex-col cursor-pointer transform-gpu premium-hover">
      <Link
        href={`/product/${product.slug}`}
        prefetch
        aria-label={`View ${product.name}`}
        className="absolute inset-0 z-0"
      />

      <div className="relative overflow-hidden bg-secondary/30 aspect-[3/4] pointer-events-auto rounded-[1px]">
        {/* Swipeable Gallery Container for Mobile, Cross-fade for Desktop */}
        <div className="flex w-full h-full snap-x snap-mandatory overflow-x-auto hide-scrollbar md:block">
          {images.map((img, idx) => (
            <div 
              key={idx} 
              className={`min-w-full h-full snap-center relative flex-shrink-0 md:absolute md:inset-0 transition-opacity duration-[900ms] ease-out ${
                idx === 0 ? 'opacity-100' : 'opacity-100 md:opacity-0 md:group-hover:opacity-100'
              }`}
            >
              <Image
                src={img}
                alt={`${product.name} - view ${idx + 1}`}
                fill
                className={`object-cover transition-transform duration-[1200ms] ease-out ${
                  idx === 0 ? 'group-hover:scale-105' : 'scale-95 group-hover:scale-100'
                }`}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
        
        {/* Hover overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none hidden md:block" />
        
        <div className="absolute inset-x-0 bottom-0 z-20 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out hidden md:flex justify-between items-center">
          <button 
            onClick={handleAddToCart}
            className="pointer-events-auto flex-1 bg-[#D4AF37] text-background py-3 text-[10px] uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 hover:bg-[#F0EBE1] hover:text-foreground transition-colors duration-300 shadow-xl"
          >
            <ShoppingBag className="w-4 h-4" />
            Add to Cart
          </button>
        </div>
      </div>
      
      <button 
        onClick={handleWishlist}
        disabled={!isHydrated}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-background/50 backdrop-blur-md hover:bg-background transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 shadow-sm border border-border/10"
        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
      >
        <Heart className={`w-4 h-4 transition-colors ${isWishlisted ? "fill-[#D4AF37] text-[#D4AF37]" : "text-foreground"}`} strokeWidth={isWishlisted ? 2 : 1.5} />
      </button>

      {/* Mobile Add to Cart Button */}
      <button 
        onClick={handleAddToCart}
        className="md:hidden absolute bottom-[100px] right-4 z-20 p-3 rounded-full bg-background/80 backdrop-blur-md shadow-lg border border-border/20 text-foreground active:scale-95 transition-transform"
      >
        <ShoppingBag className="w-4 h-4" />
      </button>

      <div className="relative z-10 mt-5 flex flex-col space-y-2 pointer-events-none bg-background py-1">
        {product.category?.name && (
          <p className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">{product.category.name}</p>
        )}
        <h3 className="text-sm font-heading font-medium tracking-wide text-foreground leading-tight">{product.name}</h3>
        <div className="flex items-center gap-3 pt-1">
          <p className="text-sm font-sans font-medium text-foreground">₹{Number(product.price).toLocaleString("en-IN")}</p>
          {product.comparePrice && (
            <p className="text-xs font-sans text-muted-foreground line-through decoration-muted-foreground/40">
              ₹{Number(product.comparePrice).toLocaleString("en-IN")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export const ProductCard = memo(ProductCardComponent);
