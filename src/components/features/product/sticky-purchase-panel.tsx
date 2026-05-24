"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/store/useCartStore";
import { useUIStore } from "@/store/useUIStore";
import { ShoppingBag, Check } from "lucide-react";
import { SerializedProduct } from "@/types/product";
import { useRouter } from "next/navigation";

interface StickyPurchasePanelProps {
  product: SerializedProduct;
  selectedSize: string | null;
}

export function StickyPurchasePanel({ product, selectedSize }: StickyPurchasePanelProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  
  const addItem = useCartStore((state) => state.addItem);
  const setCartOpen = useUIStore((state) => state.setCartOpen);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolled past the main add to cart button
      const scrollPosition = window.scrollY;
      setIsVisible(scrollPosition > 600);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAddToCart = () => {
    if (!selectedSize) {
      // Could show toast here, but relying on main ProductInfo for size selection
      return;
    }

    setIsAdding(true);
    addItem({
      id: Math.random().toString(),
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0],
      quantity: 1,
      variant: { size: selectedSize }
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
      return;
    }

    setDirectCheckoutItem({
      id: Math.random().toString(),
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      image: product.images[0],
      quantity: 1,
      variant: { size: selectedSize }
    });

    router.push("/checkout");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-xl border-t border-border/50 py-4 px-4 md:px-6 shadow-2xl"
        >
          <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="hidden sm:flex items-center gap-4">
              <div className="w-12 h-16 relative bg-muted shrink-0">
                <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-[0.1em]">{product.name}</h4>
                <p className="text-sm font-light">₹{Number(product.price).toLocaleString("en-IN")}</p>
              </div>
            </div>
            
            <div className="flex w-full sm:w-auto items-center gap-2">
              <div className="hidden md:block text-[10px] uppercase tracking-[0.2em] font-medium text-muted-foreground mr-4">
                {selectedSize ? `Size: ${selectedSize}` : "Select Size"}
              </div>
              
              <div className="flex flex-1 sm:flex-none gap-2">
                <motion.button
                  onClick={handleAddToCart}
                  disabled={isAdding || !selectedSize}
                  className="flex-1 sm:w-48 bg-background border border-foreground text-foreground py-3 md:py-4 px-2 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-foreground hover:text-background transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {isAdding ? (
                      <motion.span
                        key="adding"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <Check className="w-4 h-4 md:w-5 md:h-5" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="cart"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        Cart
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>

                <motion.button
                  onClick={handleBuyNow}
                  disabled={!selectedSize}
                  className="flex-1 sm:w-48 bg-[#D4AF37] text-background py-3 md:py-4 px-2 font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-[#c4a132] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-[#D4AF37]/20"
                  whileTap={{ scale: 0.98 }}
                >
                  Buy Now
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
