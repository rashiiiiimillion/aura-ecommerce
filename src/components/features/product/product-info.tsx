"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useHydrated } from "@/store/useStore";
import { useUIStore } from "@/store/useUIStore";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Truck, ArrowLeftRight, Check, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { SerializedProduct } from "@/types/product";
import { StickyPurchasePanel } from "./sticky-purchase-panel";

interface ProductInfoProps {
  product: SerializedProduct;
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  
  const isHydrated = useHydrated();
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);
  const { items: wishlistItems, toggleItem } = useWishlistStore();
  
  const isWishlisted = isHydrated && wishlistItems.includes(product.id);

  const sizes = ["XS", "S", "M", "L", "XL"];

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setIsAdding(true);
    addItem({
      id: Math.random().toString(),
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0],
      quantity,
    });

    setTimeout(() => {
      setIsAdding(false);
      setCartOpen(true);
    }, 600);
  };

  const setDirectCheckoutItem = useCartStore((state) => state.setDirectCheckoutItem);
  const router = useRouter();

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    setDirectCheckoutItem({
      id: Math.random().toString(),
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0],
      quantity,
      variant: { size: selectedSize }
    });

    router.push("/checkout");
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-6">
          {product.category?.name}
        </div>

        <h1 className="text-2xl md:text-3xl lg:text-4xl font-heading font-light tracking-wide uppercase mb-4">
          {product.name}
        </h1>

        <div className="flex items-center gap-4 mb-8 border-b border-border/40 pb-6">
          <span className="text-2xl md:text-3xl font-sans font-light">₹{Number(product.price).toLocaleString("en-IN")}</span>
          {product.comparePrice && (
            <span className="text-base font-sans text-muted-foreground line-through decoration-muted-foreground/40">₹{Number(product.comparePrice).toLocaleString("en-IN")}</span>
          )}
          {product.comparePrice && (
            <span className="text-[10px] uppercase tracking-[0.2em] bg-foreground text-background px-3 py-1.5 font-medium">
              Save {Math.round((1 - Number(product.price) / Number(product.comparePrice)) * 100)}%
            </span>
          )}
        </div>

        <p className="text-muted-foreground font-light leading-relaxed mb-10 text-sm md:text-base">
          {product.description}
        </p>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-5">
            <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#D4AF37]">Select Size</span>
            <button className="text-[10px] text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors uppercase tracking-widest">
              Size Guide
            </button>
          </div>
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`min-w-[56px] h-12 px-4 flex items-center justify-center border transition-all duration-300 text-[11px] font-bold uppercase tracking-widest ${
                  selectedSize === size
                    ? "border-[#D4AF37] bg-[#D4AF37] text-background"
                    : "border-border/60 text-muted-foreground hover:border-[#D4AF37] hover:text-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <span className="text-[11px] uppercase tracking-[0.2em] font-medium text-[#D4AF37] mb-5 block">Quantity</span>
          <div className="inline-flex items-center border border-border/60 bg-background/50">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-12 h-12 flex items-center justify-center hover:bg-[#D4AF37] hover:text-background transition-colors text-lg"
            >
              −
            </button>
            <span className="w-14 h-12 flex items-center justify-center text-sm font-medium border-x border-border/60">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-12 h-12 flex items-center justify-center hover:bg-[#D4AF37] hover:text-background transition-colors text-lg"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3 mb-10">
          <div className="flex gap-3">
            <motion.button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="flex-1 bg-background border border-foreground text-foreground py-4 px-8 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-3 disabled:opacity-70 shadow-sm"
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isAdding ? (
                  <motion.span
                    key="adding"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    <Check className="w-4 h-4" />
                    Added
                  </motion.span>
                ) : (
                  <motion.span
                    key="cart"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex items-center gap-3"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
            <motion.button
              onClick={() => {
                if (!isHydrated) return;
                toggleItem(product.id);
                toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
              }}
              disabled={!isHydrated}
              className={`w-14 shrink-0 border flex items-center justify-center transition-all duration-300 ${
                isWishlisted
                  ? "border-[#D4AF37] bg-[#D4AF37] text-background"
                  : "border-foreground hover:bg-foreground hover:text-background"
              }`}
              whileTap={{ scale: 0.95 }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
            </motion.button>
          </div>
          
          <motion.button
            onClick={handleBuyNow}
            className="w-full bg-[#D4AF37] text-background py-4 px-8 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-[#c4a132] transition-colors flex items-center justify-center gap-3 shadow-lg shadow-[#D4AF37]/20"
            whileTap={{ scale: 0.98 }}
          >
            Buy Now
          </motion.button>
        </div>

        <div className="space-y-5 py-8 border-y border-border/50">
          <div className="flex items-start gap-4">
            <Truck className="w-5 h-5 mt-0.5 text-[#D4AF37]" />
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold mb-1 text-foreground">Complimentary Delivery</h4>
              <p className="text-xs text-muted-foreground font-light">Expected delivery within 3-5 business days across India.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ArrowLeftRight className="w-5 h-5 mt-0.5 text-[#D4AF37]" />
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold mb-1 text-foreground">Artisanal Guarantee</h4>
              <p className="text-xs text-muted-foreground font-light">Return within 14 days for pristine, unworn pieces.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <ShieldCheck className="w-5 h-5 mt-0.5 text-[#D4AF37]" />
            <div>
              <h4 className="text-[11px] uppercase tracking-widest font-bold mb-1 text-foreground">Secure Checkout</h4>
              <p className="text-xs text-muted-foreground font-light">100% secure payments via Razorpay.</p>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Accordion className="w-full border-none">
            <AccordionItem value="details" className="border-b border-border/50">
              <AccordionTrigger className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground hover:text-[#D4AF37] transition-colors py-5">Product Details</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-sm pb-6">
                {product.description}
                <ul className="list-disc pl-5 mt-6 space-y-2 text-[#D4AF37]">
                  <li><span className="text-muted-foreground">100% Premium Artisanal Materials</span></li>
                  <li><span className="text-muted-foreground">Handcrafted in India</span></li>
                  <li><span className="text-muted-foreground">Specialist dry clean only</span></li>
                  <li><span className="text-muted-foreground">SKU: {product.inventory?.sku || "N/A"}</span></li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="shipping" className="border-b border-border/50">
              <AccordionTrigger className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground hover:text-[#D4AF37] transition-colors py-5">Shipping & Returns</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-sm pb-6">
                <p>We offer complimentary standard shipping on all orders over ₹15,000. Express delivery options are available at checkout.</p>
                <p className="mt-4">If you are not completely satisfied with your purchase, you may return it within 14 days of receipt, provided the tags are intact and the garment is unworn.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="care" className="border-b border-border/50">
              <AccordionTrigger className="text-[11px] font-bold uppercase tracking-[0.2em] text-foreground hover:text-[#D4AF37] transition-colors py-5">Care Instructions</AccordionTrigger>
              <AccordionContent className="text-muted-foreground font-light leading-relaxed text-sm pb-6">
                <p>Professional dry clean only. Do not bleach. Cool iron if needed. Store on a hanger in a breathable garment bag to preserve the delicate embroidery.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
      <StickyPurchasePanel product={product} selectedSize={selectedSize} />
    </>
  );
}
