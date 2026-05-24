"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { useInView } from "framer-motion";

const stats = [
  { value: "40+", label: "Quality Checks" },
  { value: "12", label: "Countries" },
  { value: "100%", label: "Ethical" },
  { value: "2018", label: "Established" },
];

const values = [
  {
    title: "Material Integrity",
    description: "We source only the finest fabrics and materials, ensuring each piece meets our uncompromising standards.",
  },
  {
    title: "Artisan Craftsmanship",
    description: "Every garment is crafted by skilled artisans using techniques passed down through generations.",
  },
  {
    title: "Sustainable Practice",
    description: "Our commitment to ethical production ensures minimal environmental impact without sacrificing quality.",
  },
];

export function BrandPhilosophy() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-4">Our Philosophy</p>
          <h2 className="text-3xl md:text-5xl font-heading font-light uppercase tracking-wide leading-[0.95]">
            Crafted with intention, designed for permanence.
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 mb-24 md:mb-32">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-center"
            >
              <p className="text-3xl md:text-5xl font-heading font-light tracking-wide mb-2">{stat.value}</p>
              <p className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.3 + i * 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <div className="w-8 h-[1px] bg-foreground/20" />
              <h3 className="text-sm uppercase tracking-[0.2em] font-medium">{value.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed font-light">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
