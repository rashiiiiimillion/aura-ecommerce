import Link from "next/link";
import Image from "next/image";

export const metadata = {
  title: "About | Aura Luxury",
  description: "The Aura story — uncompromising quality meets minimalist design.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <h1 className="text-4xl md:text-6xl font-outfit font-light tracking-tight">Our Story</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto font-light text-lg">Redefining luxury through minimalist design and unparalleled craftsmanship since 2024.</p>
        </div>

        <div className="relative aspect-[16/7] w-full mb-16 overflow-hidden bg-[#f5f5f7]">
          <Image 
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop" 
            alt="Aura Atelier" 
            fill
            className="object-cover" 
            sizes="(max-width: 1024px) 100vw, 896px"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16">
          <div>
            <h2 className="text-2xl font-outfit font-light tracking-tight mb-4">The Philosophy</h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-4">
              At Aura, we believe that true luxury lies in restraint. Every piece in our collection is designed to transcend trends, crafted from the finest materials sourced from artisans across Italy, Japan, and Portugal.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed">
              Our design ethos is rooted in the belief that fewer, better things create more meaningful wardrobes. We reject fast fashion in favor of enduring quality.
            </p>
          </div>
          <div>
            <h2 className="text-2xl font-outfit font-light tracking-tight mb-4">The Craft</h2>
            <p className="text-muted-foreground font-light leading-relaxed mb-4">
              Each garment undergoes over 40 quality checkpoints before reaching you. Our fabrics are selected for their hand-feel, durability, and environmental footprint.
            </p>
            <p className="text-muted-foreground font-light leading-relaxed">
              We partner with family-owned mills and workshops that share our commitment to ethical production and exceptional craft.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-8 mb-16 text-center">
          <div className="py-8 border-t">
            <p className="text-3xl font-outfit font-light mb-1">40+</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Quality Checks</p>
          </div>
          <div className="py-8 border-t">
            <p className="text-3xl font-outfit font-light mb-1">12</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Countries Sourced</p>
          </div>
          <div className="py-8 border-t">
            <p className="text-3xl font-outfit font-light mb-1">100%</p>
            <p className="text-xs text-muted-foreground uppercase tracking-wider">Ethical Production</p>
          </div>
        </div>

        <div className="text-center border-t pt-12">
          <h2 className="text-2xl font-outfit font-light tracking-tight mb-4">Experience Aura</h2>
          <Link href="/collections" className="bg-black text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-black/90 transition-colors inline-block">
            Shop the Collection
          </Link>
        </div>
      </div>
    </div>
  );
}
