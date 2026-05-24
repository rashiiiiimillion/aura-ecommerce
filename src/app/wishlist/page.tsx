"use client";

import { useWishlistStore } from "@/store/useWishlistStore";
import { useHydrated } from "@/store/useStore";
import Link from "next/link";
import { Heart, ArrowRight } from "lucide-react";
import { WishlistGrid } from "@/components/features/catalog/wishlist-grid";
import { FadeIn } from "@/components/ui/fade-in";

export default function WishlistPage() {
  const isHydrated = useHydrated();
  const { items, clearWishlist } = useWishlistStore();

  if (!isHydrated) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16 border-b border-border/50 pb-8">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Your Selection</p>
            <h1 className="text-4xl md:text-6xl font-heading font-light uppercase tracking-[0.02em]">Wishlist</h1>
          </div>
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-[3/4] bg-muted/50 rounded-sm" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <FadeIn delay={0.1} direction="up">
            <div className="mb-16 border-b border-border/50 pb-8">
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Your Selection</p>
              <h1 className="text-4xl md:text-6xl font-heading font-light uppercase tracking-[0.02em]">Wishlist</h1>
            </div>
          </FadeIn>
          
          <FadeIn delay={0.2} direction="up" className="flex flex-col items-center justify-center py-20 md:py-32 text-center">
            <Heart className="w-12 h-12 text-muted-foreground/30 mb-8 stroke-[1]" />
            <h2 className="text-2xl md:text-3xl font-heading font-light uppercase tracking-wide mb-4">Your wishlist is empty</h2>
            <p className="text-muted-foreground font-light mb-10 max-w-md text-sm md:text-base">
              Save pieces you love for later. Tap the heart icon on any product to add it here.
            </p>
            <Link
              href="/collections"
              className="bg-foreground text-background px-10 py-4 text-[10px] uppercase tracking-[0.25em] hover:bg-foreground/90 transition-all duration-300 inline-flex items-center gap-3 hover:scale-[1.02]"
            >
              Explore Collections
              <ArrowRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <FadeIn delay={0.1} direction="up">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 border-b border-border/50 pb-8 gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Your Selection</p>
              <h1 className="text-4xl md:text-6xl font-heading font-light uppercase tracking-[0.02em]">Wishlist</h1>
              <p className="text-muted-foreground font-light mt-4 text-sm">{items.length} saved {items.length === 1 ? "item" : "items"}</p>
            </div>
            <button
              onClick={clearWishlist}
              className="text-[10px] text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors uppercase tracking-[0.2em]"
            >
              Clear All
            </button>
          </div>
        </FadeIn>
        
        <FadeIn delay={0.2} direction="up">
          <WishlistGrid itemIds={items} />
        </FadeIn>
      </div>
    </div>
  );
}
