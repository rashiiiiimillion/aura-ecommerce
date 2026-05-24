"use client";

import { useState, useEffect, useRef } from "react";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { useHydrated } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

interface RecentlyViewedProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    slug: string;
  };
}

export function RecentlyViewed({ product }: RecentlyViewedProps) {
  const isHydrated = useHydrated();
  const { addProduct, products } = useRecentlyViewedStore();
  const hasTrackedRef = useRef(false);

  useEffect(() => {
    if (isHydrated && !hasTrackedRef.current) {
      addProduct({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
      });
      hasTrackedRef.current = true;
    }
  }, [product, isHydrated, addProduct]);

  if (!isHydrated || products.length <= 1) return null;

  const otherProducts = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <section className="mt-16 md:mt-24">
      <h3 className="text-xs uppercase tracking-[0.2em] font-medium mb-8">Recently Viewed</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {otherProducts.map((p, idx) => (
          <RecentlyViewedCard key={p.id} product={p} index={idx} />
        ))}
      </div>
    </section>
  );
}

function RecentlyViewedCard({ product: p, index }: { product: { id: string; name: string; price: number; image: string; slug: string }; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
    >
      <Link href={`/product/${p.slug}`} className="group">
        <div className="relative aspect-[3/4] bg-[#f5f5f7] dark:bg-[#111] overflow-hidden mb-3">
          <Image
            src={p.image || "/placeholder.svg"}
            alt={p.name}
            fill
            className="object-cover transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        </div>
        <h4 className="text-xs uppercase tracking-wider font-medium line-clamp-1 group-hover:text-muted-foreground transition-colors">{p.name}</h4>
        <p className="text-sm font-light mt-1">${p.price.toFixed(2)}</p>
      </Link>
    </motion.div>
  );
}
