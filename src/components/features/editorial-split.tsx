"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function EditorialSplit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="bg-[#080808] text-white">
      <div className="container mx-auto px-4 md:px-6 py-20 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          <motion.div
            className="lg:col-span-5 space-y-8"
            initial={{ opacity: 0, y: 40 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-[10px] uppercase tracking-[0.3em] text-white/50">Luxury Essentials</p>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-heading font-light uppercase leading-[0.9] tracking-wide">
              The quiet pieces worn the most.
            </h2>
            <p className="max-w-md text-sm md:text-base leading-7 text-white/60 font-light">
              Dense cotton, fine cashmere, polished leather, and tailoring that carries the day without announcing itself.
            </p>
            <Link
              href="/collections?category=essentials"
              className="inline-flex items-center gap-2 border-b border-white/60 pb-2 text-[10px] uppercase tracking-[0.25em] text-white transition-all duration-300 hover:border-white hover:gap-3"
            >
              Shop Essentials
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          <div className="lg:col-span-7 grid grid-cols-2 gap-4 md:gap-6">
            <motion.div
              className="relative aspect-[3/4] overflow-hidden"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop"
                alt="Luxury cotton tee editorial"
                fill
                className="object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 30vw"
              />
            </motion.div>
            <motion.div
              className="relative aspect-[3/4] overflow-hidden mt-12 md:mt-16"
              initial={{ opacity: 0, y: 60 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
              transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=1974&auto=format&fit=crop"
                alt="Oxford shirt editorial"
                fill
                className="object-cover transition-transform duration-[1.5s] ease-[0.16,1,0.3,1] hover:scale-105"
                sizes="(max-width: 1024px) 50vw, 30vw"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
