"use client";

import { Suspense, useState } from "react";
import { Filters } from "@/components/features/catalog/filters";
import { ProductGrid } from "@/components/features/catalog/product-grid";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { SerializedProduct } from "@/types/product";

interface CollectionsClientProps {
  products: SerializedProduct[];
  categorySlug?: string;
  isFeatured?: boolean;
}

export function CollectionsClient({ products, categorySlug, isFeatured }: CollectionsClientProps) {
  const title = categorySlug 
    ? categorySlug.replace(/-/g, " ") 
    : isFeatured 
      ? "Featured Collection" 
      : "Our Collections";

  return (
    <CollectionsShell
      products={products}
      title={title}
    />
  );
}

function CollectionsShell({
  products,
  title = "Our Collections",
}: CollectionsClientProps & { title?: string }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center mb-16 text-center space-y-6 max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-foreground capitalize tracking-normal leading-[1.1]">
          {title}
        </h1>
        <p className="text-sm md:text-base text-muted-foreground font-light leading-relaxed">
          Discover our curated selection of luxury pieces, crafted with uncompromising quality and timeless Indian aesthetics.
        </p>
      </div>

      {/* Mobile Filter Trigger */}
      <div className="lg:hidden flex justify-between items-center mb-8 pb-4 border-b border-border/50">
        <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">{products.length} products</p>
        <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
          <SheetTrigger className="flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase bg-background border border-border/60 px-4 py-2 hover:bg-muted/50 transition-colors">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Filters
          </SheetTrigger>
          <SheetContent side="bottom" className="h-[80vh] rounded-t-3xl px-6 py-8">
            <SheetHeader className="mb-8">
              <SheetTitle className="text-left font-heading text-2xl uppercase tracking-widest text-[#D4AF37]">Filters</SheetTitle>
            </SheetHeader>
            <Suspense fallback={<FiltersSkeleton />}>
              <Filters onSelect={() => setMobileFiltersOpen(false)} />
            </Suspense>
          </SheetContent>
        </Sheet>
      </div>

      <div className="flex flex-col lg:flex-row gap-12">
        <aside className="hidden lg:block w-full lg:w-64 flex-shrink-0">
          <div className="sticky top-32">
            <h3 className="text-sm font-heading tracking-[0.2em] uppercase text-[#D4AF37] mb-8">Refine</h3>
            <Suspense fallback={<FiltersSkeleton />}>
              <Filters />
            </Suspense>
          </div>
        </aside>

        <main className="flex-1">
          <div className="hidden lg:flex justify-between items-center mb-8">
            <p className="text-[11px] font-medium tracking-[0.2em] uppercase text-muted-foreground">{products.length} results</p>
          </div>
          {products.length > 0 ? (
            <ProductGrid products={products} />
          ) : (
            <div className="py-32 text-center bg-secondary/20 border border-border/50">
              <h3 className="text-3xl font-heading font-light text-foreground mb-4">No pieces found</h3>
              <p className="text-sm text-muted-foreground font-light max-w-md mx-auto">
                We couldn't find any products matching your current selection. Please try adjusting your filters.
              </p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}

function FiltersSkeleton() {
  return (
    <div className="flex flex-col space-y-10">
      <div>
        <Skeleton className="h-4 w-24 mb-6 rounded-none bg-border/40" />
        <div className="space-y-4">
          <Skeleton className="h-3 w-32 rounded-none bg-border/40" />
          <Skeleton className="h-3 w-28 rounded-none bg-border/40" />
          <Skeleton className="h-3 w-36 rounded-none bg-border/40" />
        </div>
      </div>
    </div>
  );
}
