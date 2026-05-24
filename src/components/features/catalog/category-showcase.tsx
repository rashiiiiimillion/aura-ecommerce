"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/ui/fade-in";

export function CategoryShowcase() {
  return (
    <section className="py-32 md:py-40 bg-background overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
          <div>
            <FadeIn delay={0.1} direction="up">
              <h2 className="text-4xl md:text-7xl font-heading font-light tracking-[0.02em] mb-6 uppercase">Curated Worlds</h2>
            </FadeIn>
            <FadeIn delay={0.2} direction="up">
              <p className="text-muted-foreground font-light max-w-md text-lg leading-relaxed">
                Explore our collections, defined by meticulous craftsmanship and timeless design.
              </p>
            </FadeIn>
          </div>
          <FadeIn delay={0.3} direction="left">
            <Link href="/collections" className="text-xs uppercase tracking-[0.3em] flex items-center gap-3 hover:text-muted-foreground transition-colors pb-3 border-b border-foreground/30 hover:border-foreground group">
              View All Collections <ArrowRight className="w-4 h-4 transform group-hover:translate-x-2 transition-transform duration-500" />
            </Link>
          </FadeIn>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 md:h-[800px]">
          {/* Large Left Item - Women */}
          <Link href="/collections?category=womens" className="group relative col-span-1 md:col-span-7 h-[500px] md:h-full overflow-hidden bg-[#f5f5f7] dark:bg-[#111]">
            <Image
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop"
              alt="Women's Collection"
              fill
              className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 58vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-[1.5s] ease-[0.16,1,0.3,1]" />
            <div className="absolute bottom-12 left-10 text-white overflow-hidden">
              <h3 className="text-5xl font-heading font-light mb-4 tracking-wider uppercase transform translate-y-0 transition-transform duration-[1.2s] ease-[0.16,1,0.3,1]">Womenswear</h3>
              <span className="text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[1s] ease-[0.16,1,0.3,1] delay-100">
                Shop Collection <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Right Column Stack */}
          <div className="col-span-1 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6 h-[800px] md:h-full">
            {/* Top Right Item - Men */}
            <Link href="/collections?category=mens" className="group relative h-full overflow-hidden bg-[#f5f5f7] dark:bg-[#111]">
              <Image
              src="https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=1974&auto=format&fit=crop"
              alt="Men's Collection"
              fill
              className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 42vw"
            />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-[1.5s] ease-[0.16,1,0.3,1]" />
              <div className="absolute bottom-10 left-8 text-white overflow-hidden">
                <h3 className="text-4xl font-heading font-light mb-3 tracking-wider uppercase transform translate-y-0 transition-transform duration-[1.2s] ease-[0.16,1,0.3,1]">Menswear</h3>
                <span className="text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-[1s] ease-[0.16,1,0.3,1] delay-100">
                  Shop Collection <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </Link>

            {/* Bottom Right Grid - Accessories & Footwear */}
            <div className="grid grid-cols-2 gap-4 md:gap-6 h-full">
              <Link href="/collections?category=accessories" className="group relative h-full overflow-hidden bg-[#f5f5f7] dark:bg-[#111]">
                <Image
                  src="https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=2038&auto=format&fit=crop"
                  alt="Accessories"
                  fill
                  className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 21vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-[1.5s] ease-[0.16,1,0.3,1]" />
                <div className="absolute bottom-8 left-6 text-white overflow-hidden">
                  <h3 className="text-2xl font-heading font-light mb-2 tracking-wider uppercase">Accessories</h3>
                  <span className="text-[9px] uppercase tracking-[0.3em] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[1s] ease-[0.16,1,0.3,1]">
                    Explore
                  </span>
                </div>
              </Link>
              
              <Link href="/collections?category=footwear" className="group relative h-full overflow-hidden bg-[#f5f5f7] dark:bg-[#111]">
                <Image
                  src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop"
                  alt="Footwear"
                  fill
                  className="object-cover transition-transform duration-[2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                  sizes="(max-width: 768px) 50vw, 21vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-[1.5s] ease-[0.16,1,0.3,1]" />
                <div className="absolute bottom-8 left-6 text-white overflow-hidden">
                  <h3 className="text-2xl font-heading font-light mb-2 tracking-wider uppercase">Footwear</h3>
                  <span className="text-[9px] uppercase tracking-[0.3em] opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-[1s] ease-[0.16,1,0.3,1]">
                    Explore
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
