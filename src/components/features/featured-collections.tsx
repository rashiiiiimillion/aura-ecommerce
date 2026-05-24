"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";
import { useInView } from "framer-motion";

const collections = [
  {
    id: "essentials",
    title: "The Essentials",
    subtitle: "Timeless foundations",
    image: "https://images.unsplash.com/photo-1588099768531-a72d4a198538?q=80&w=1974&auto=format&fit=crop",
  },
  {
    id: "womens",
    title: "Evening Wear",
    subtitle: "After dark",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?q=80&w=2071&auto=format&fit=crop",
  },
];

export function FeaturedCollections() {
  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Editorials</p>
            <h2 className="text-3xl md:text-5xl font-heading font-light tracking-wide uppercase">Curated Stories</h2>
          </div>
          <Link href="/collections" className="text-[10px] uppercase tracking-[0.2em] flex items-center gap-2 hover:text-muted-foreground transition-colors pb-2 border-b border-foreground group">
            View All <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {collections.map((collection, index) => (
            <CollectionCard key={collection.id} collection={collection} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CollectionCard({ collection, index }: { collection: typeof collections[0]; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <Link href={`/collections?category=${collection.id}`}>
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 60 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
        transition={{ duration: 1, delay: index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        className="group relative aspect-[3/4] overflow-hidden cursor-pointer bg-[#f5f5f7] dark:bg-[#111]"
      >
        <Image
          src={collection.image}
          alt={collection.title}
          fill
          className="object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        <div className="absolute inset-0 bg-black/10 group-hover:bg-black/35 transition-colors duration-700" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12">
          <p className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-2">{collection.subtitle}</p>
          <h3 className="text-white text-2xl md:text-4xl font-heading font-light uppercase tracking-wide mb-4">{collection.title}</h3>
          <div className="flex items-center text-white/80 text-[10px] uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 ease-[0.16,1,0.3,1]">
            Discover
            <ArrowRight className="ml-2 w-4 h-4" />
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
