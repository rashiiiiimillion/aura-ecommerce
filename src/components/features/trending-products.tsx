import { getProducts } from "@/actions/product";
import { ProductCard } from "@/components/features/catalog/product-card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export async function TrendingProducts() {
  const result = await getProducts({ isFeatured: true, take: 8 });
  const products = 'success' in result && result.data ? result.data : [];

  if (!products.length) return null;

  return (
    <section className="py-24 bg-background border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-outfit font-light tracking-tight mb-4">Trending Now</h2>
            <p className="text-muted-foreground font-light max-w-lg">The most coveted pieces this season.</p>
          </div>
          <Link href="/collections?featured=true" className="text-xs uppercase tracking-widest flex items-center gap-2 hover:text-muted-foreground transition-colors pb-1 border-b border-foreground">
            Shop All <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 md:-ml-6">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 md:pl-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-end gap-4 mt-12">
            <CarouselPrevious className="static translate-y-0 translate-x-0 bg-transparent border-border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none w-12 h-12 transition-colors" />
            <CarouselNext className="static translate-y-0 translate-x-0 bg-transparent border-border hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black rounded-none w-12 h-12 transition-colors" />
          </div>
        </Carousel>
      </div>
    </section>
  );
}
