"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FadeIn } from "@/components/ui/fade-in";

export function DynamicSection({ section }: { section: any }) {
  if (!section.isActive) return null;

  switch (section.type) {
    case "HERO":
      return <HeroSection section={section} />;
    case "EDITORIAL":
      return <EditorialSection section={section} />;
    case "FEATURED_CAMPAIGN":
      return <CampaignSection section={section} />;
    case "NEWSLETTER":
      return <NewsletterSection section={section} />;
    default:
      return null;
  }
}

function HeroSection({ section }: { section: any }) {
  const overlayOpacity = section.overlayOpacity !== null ? section.overlayOpacity / 100 : 0.3;
  const overlayColor = `rgba(18, 18, 18, ${overlayOpacity})`;

  return (
    <div className="relative h-[100svh] w-full overflow-hidden bg-[#1A1A1A]">
      <motion.div className="absolute inset-0 w-full h-full">
        {section.image && (
          <Image 
            src={section.image} 
            alt={section.title || "Hero"} 
            fill
            priority
            className="object-cover object-center scale-105"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-transparent to-transparent" />
        <div className="absolute inset-0 mix-blend-multiply" style={{ backgroundColor: overlayColor }} />
      </motion.div>

      <div className="relative h-full flex flex-col justify-end container mx-auto px-6 pb-24 md:pb-32 z-10">
        <div className="max-w-3xl space-y-6">
          {section.subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
              className="text-[10px] uppercase tracking-[0.4em] font-semibold"
              style={{ color: section.textColor || "#D4AF37" }}
            >
              {section.subtitle}
            </motion.p>
          )}
          {section.title && (
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.4 }}
              className="text-5xl md:text-7xl lg:text-8xl font-heading leading-[1.1] capitalize tracking-normal"
              style={{ color: section.textColor || "#FAFAF8" }}
              dangerouslySetInnerHTML={{ __html: section.title.replace(/\n/g, "<br/>") }}
            />
          )}
          {section.description && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
              className="text-sm font-light max-w-xl"
              style={{ color: section.textColor ? `${section.textColor}cc` : "#FAFAF8cc" }}
            >
              {section.description}
            </motion.p>
          )}
          
          {section.linkUrl && section.linkText && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="pt-8 flex flex-col sm:flex-row gap-6"
            >
              <Link
                href={section.linkUrl}
                className={`inline-flex justify-center items-center px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                  section.buttonVariant === 'outline' 
                    ? 'bg-transparent border border-[#F0EBE1]/30 text-[#F0EBE1] hover:bg-[#F0EBE1]/10' 
                    : 'bg-[#D4AF37] text-[#121212] hover:bg-[#F0EBE1]'
                }`}
              >
                {section.linkText}
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function EditorialSection({ section }: { section: any }) {
  return (
    <section className="py-24 md:py-40" style={{ backgroundColor: section.backgroundColor || "var(--background)" }}>
      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {section.title && (
            <FadeIn delay={0.2} direction="up">
              <h2 
                className="text-3xl md:text-5xl lg:text-6xl font-heading capitalize leading-[1.2] tracking-normal"
                style={{ color: section.textColor || "var(--foreground)" }}
                dangerouslySetInnerHTML={{ __html: section.title.replace(/\n/g, "<br/>") }}
              />
            </FadeIn>
          )}
          {section.description && (
            <FadeIn delay={0.4} direction="up">
              <p 
                className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto font-light"
                style={{ color: section.textColor ? `${section.textColor}b3` : "var(--muted-foreground)" }}
              >
                {section.description}
              </p>
            </FadeIn>
          )}
          {section.linkUrl && section.linkText && (
            <FadeIn delay={0.6} direction="up">
              <Link 
                href={section.linkUrl} 
                className="inline-block mt-8 border-b pb-1 text-xs uppercase tracking-widest transition-colors"
                style={{ color: section.textColor || "var(--foreground)", borderColor: section.textColor || "var(--foreground)" }}
              >
                {section.linkText}
              </Link>
            </FadeIn>
          )}
        </div>
      </div>
    </section>
  );
}

function CampaignSection({ section }: { section: any }) {
  return (
    <section className="py-12 md:py-24" style={{ backgroundColor: section.backgroundColor || "var(--secondary)" }}>
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8 order-2 md:order-1">
            {section.subtitle && (
              <FadeIn delay={0.2} direction="right">
                <span className="text-[10px] uppercase tracking-[0.3em] font-semibold" style={{ color: section.textColor || "#D4AF37" }}>
                  {section.subtitle}
                </span>
              </FadeIn>
            )}
            {section.title && (
              <FadeIn delay={0.3} direction="right">
                <h3 
                  className="text-4xl md:text-5xl font-heading leading-[1.1]"
                  style={{ color: section.textColor || "var(--foreground)" }}
                  dangerouslySetInnerHTML={{ __html: section.title.replace(/\n/g, "<br/>") }}
                />
              </FadeIn>
            )}
            {section.description && (
              <FadeIn delay={0.4} direction="right">
                <p 
                  className="text-sm font-light leading-relaxed"
                  style={{ color: section.textColor ? `${section.textColor}b3` : "var(--muted-foreground)" }}
                >
                  {section.description}
                </p>
              </FadeIn>
            )}
            {section.linkUrl && section.linkText && (
              <FadeIn delay={0.5} direction="right">
                <Link 
                  href={section.linkUrl} 
                  className="inline-block mt-4 border-b pb-1 text-xs uppercase tracking-widest hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors"
                  style={{ color: section.textColor || "var(--foreground)", borderColor: section.textColor || "var(--foreground)" }}
                >
                  {section.linkText}
                </Link>
              </FadeIn>
            )}
          </div>
          <div className="order-1 md:order-2">
            <FadeIn delay={0.4} direction="up">
              <div className="relative aspect-[3/4] w-full max-w-md mx-auto overflow-hidden">
                {section.image && (
                  <Image 
                    src={section.image} 
                    alt={section.title || "Campaign"} 
                    fill 
                    className="object-cover hover:scale-105 transition-transform duration-700 ease-out" 
                  />
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsletterSection({ section }: { section: any }) {
  return (
    <section className="border-t border-border/50" style={{ backgroundColor: section.backgroundColor || "var(--secondary)" }}>
      <div className="container mx-auto px-6 py-24 md:py-32 text-center">
        {section.subtitle && (
          <FadeIn delay={0.1} direction="up">
            <p className="text-[10px] uppercase tracking-[0.3em] mb-6 font-semibold" style={{ color: section.textColor || "#D4AF37" }}>
              {section.subtitle}
            </p>
          </FadeIn>
        )}
        {section.title && (
          <FadeIn delay={0.3} direction="up">
            <h2 
              className="text-3xl md:text-5xl font-heading mb-8 max-w-2xl mx-auto leading-tight"
              style={{ color: section.textColor || "var(--foreground)" }}
            >
              {section.title}
            </h2>
          </FadeIn>
        )}
        <FadeIn delay={0.5} direction="up">
          <form className="max-w-md mx-auto flex gap-4 mt-12">
            <input 
              type="email" 
              placeholder="Enter your email address" 
              className="flex-1 bg-background border border-border/60 px-6 py-4 text-sm outline-none focus:border-[#D4AF37] transition-colors"
              required
            />
            <button 
              type="submit"
              className="bg-primary text-primary-foreground px-8 py-4 text-[11px] font-bold uppercase tracking-[0.1em] hover:bg-primary/90 transition-colors"
            >
              {section.linkText || "Join"}
            </button>
          </form>
        </FadeIn>
      </div>
    </section>
  );
}
