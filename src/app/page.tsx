import { getHomepageSections } from "@/actions/content";
import { Hero } from "@/components/features/hero";
import { CategoryShowcase } from "@/components/features/catalog/category-showcase";
import { TrendingProducts } from "@/components/features/trending-products";
import { FeaturedCollections } from "@/components/features/featured-collections";
import { FadeIn } from "@/components/ui/fade-in";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const result = await getHomepageSections();
  const sections = 'success' in result && result.data ? result.data : [];
  
  // Map CMS images to the predefined slots
  const heroSection = sections.find((s) => s.type === "HERO" && s.isActive)?.image;
  const editorialImageLeft = sections.find((s) => s.type === "EDITORIAL" && s.isActive)?.image;
  const editorialImageRight = sections.find((s) => s.type === "NEWSLETTER" && s.isActive)?.image;
  const immersiveBanner = sections.find((s) => s.type === "FEATURED_CAMPAIGN" && s.isActive)?.image;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Pass the uploaded CMS image down to the Hero */}
      <Hero imageUrl={heroSection} />
      
      {/* Editorial Section */}
      <section className="bg-background py-24 md:py-40">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <FadeIn delay={0.2} direction="up">
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-heading text-foreground capitalize leading-[1.2] tracking-normal">
                Curating the finest expression of <span className="italic text-muted-foreground font-light">modern Indian luxury</span>.
              </h2>
            </FadeIn>
            <FadeIn delay={0.4} direction="up">
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto font-light">
                Discover a world where artisanal heritage meets contemporary design. Every piece in our collection is a testament to uncompromising quality and timeless elegance.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Cinematic Image Grid */}
      <section className="py-12 md:py-24 bg-secondary/30">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center">
            <div className="md:col-span-5 space-y-8 order-2 md:order-1">
              <FadeIn delay={0.2} direction="right">
                <span className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-semibold">The Heritage Collection</span>
              </FadeIn>
              <FadeIn delay={0.3} direction="right">
                <h3 className="text-4xl md:text-5xl font-heading text-foreground leading-[1.1]">
                  A Return to <br/><span className="italic font-light">Craftsmanship</span>.
                </h3>
              </FadeIn>
              <FadeIn delay={0.4} direction="right">
                <p className="text-sm text-muted-foreground font-light leading-relaxed">
                  Explore our signature collection featuring hand-embroidered silks, intricate beadwork, and silhouettes that celebrate the grandeur of Indian festivities.
                </p>
              </FadeIn>
              <FadeIn delay={0.5} direction="right">
                <Link href="/collections?category=festive" className="inline-block mt-4 border-b border-foreground pb-1 text-xs uppercase tracking-widest hover:text-[#D4AF37] hover:border-[#D4AF37] transition-colors">
                  Explore Collection
                </Link>
              </FadeIn>
            </div>
            <div className="md:col-span-7 grid grid-cols-2 gap-6 order-1 md:order-2">
              <FadeIn delay={0.4} direction="up" className="mt-12 md:mt-24">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                  <Image src={editorialImageLeft || "https://images.unsplash.com/photo-1583391733958-650fac5ebf69?q=80&w=1974&auto=format&fit=crop"} alt="Craftsmanship" fill className="object-cover hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
              </FadeIn>
              <FadeIn delay={0.2} direction="up">
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-muted">
                  <Image src={editorialImageRight || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop"} alt="Elegance" fill className="object-cover hover:scale-105 transition-transform duration-700 ease-out" />
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>

      <TrendingProducts />
      
      {/* Immersive Banner */}
      <section className="relative h-[80svh] w-full overflow-hidden bg-[#1A1A1A]">
        <Image src={immersiveBanner || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=2000&auto=format&fit=crop"} alt="Premium Collection" fill className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <FadeIn delay={0.2} direction="up">
            <h2 className="text-5xl md:text-7xl font-heading text-[#FAFAF8] mb-8 capitalize italic font-light">
              Elevate Your Everyday
            </h2>
          </FadeIn>
          <FadeIn delay={0.4} direction="up">
            <Link href="/collections" className="inline-flex bg-[#FAFAF8] text-[#121212] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-colors">
              Shop The Edit
            </Link>
          </FadeIn>
        </div>
      </section>

      <CategoryShowcase />
      <FeaturedCollections />

      {/* Newsletter Section */}
      <section className="bg-secondary/50 border-t border-border/50">
        <div className="container mx-auto px-6 py-24 md:py-32 text-center">
          <FadeIn delay={0.1} direction="up">
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] mb-6 font-semibold">
              The Inner Circle
            </p>
          </FadeIn>
          <FadeIn delay={0.3} direction="up">
            <h2 className="text-3xl md:text-5xl font-heading text-foreground mb-8 max-w-2xl mx-auto leading-tight">
              Unlock exclusive access to new launches and private sales.
            </h2>
          </FadeIn>
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
                Join
              </button>
            </form>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
