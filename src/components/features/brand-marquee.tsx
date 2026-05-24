"use client";

import { motion } from "framer-motion";

const marques = [
  "Complimentary Shipping",
  "Ethically Crafted",
  "Premium Materials",
  "Timeless Design",
  "Worldwide Delivery",
  "Artisan Quality",
];

export function BrandMarquee() {
  return (
    <div className="border-y border-border/50 bg-background overflow-hidden py-4">
      <motion.div
        className="flex whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        {[...marques, ...marques].map((text, i) => (
          <div key={i} className="flex items-center mx-8 md:mx-16">
            <span className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground font-medium">{text}</span>
            <span className="ml-8 md:ml-16 w-1.5 h-1.5 rounded-full bg-muted-foreground/30" />
          </div>
        ))}
      </motion.div>
    </div>
  );
}
