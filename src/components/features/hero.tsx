"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import Image from "next/image";

export function Hero({ imageUrl }: { imageUrl?: string | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  const defaultImage = "https://images.unsplash.com/photo-1617038220319-276d3cfab638?q=80&w=2070&auto=format&fit=crop";

  return (
    <div 
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden bg-[#1A1A1A]"
    >
      <motion.div 
        style={{ y, opacity }}
        className="absolute inset-0 w-full h-full"
      >
        <Image 
          src={imageUrl || defaultImage} 
          alt="Premium Indian Luxury Commerce" 
          fill
          priority
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#1A1A1A]/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/60 to-transparent mix-blend-multiply" />
      </motion.div>

      <div className="relative h-full flex flex-col justify-end container mx-auto px-6 pb-24 md:pb-32 z-10">
        <div className="max-w-3xl space-y-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] font-semibold"
          >
            The Festive Edit
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-heading text-[#FAFAF8] leading-[1.1] capitalize tracking-normal"
          >
            Heritage, <br />
            <span className="italic font-light">Reimagined.</span>
          </motion.h1>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
            className="pt-8 flex flex-col sm:flex-row gap-6"
          >
            <Link
              href="/collections?featured=true"
              className="inline-flex justify-center items-center bg-[#D4AF37] text-[#121212] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#F0EBE1] transition-all duration-500"
            >
              Discover Collection
            </Link>
            <Link
              href="/about"
              className="inline-flex justify-center items-center bg-transparent border border-[#F0EBE1]/30 text-[#F0EBE1] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#F0EBE1]/10 transition-all duration-500"
            >
              Explore Maison
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
