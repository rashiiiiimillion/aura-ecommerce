"use client";

import { useCartStore } from "@/store/useCartStore";
import { useHydrated } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

const luxeEase = [0.16, 1, 0.3, 1] as const;

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const isHydrated = useHydrated();
  const { items, removeItem, updateQuantity, getCartTotal, clearCart } = useCartStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: luxeEase }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: luxeEase }}
            className="fixed right-0 top-0 z-[70] h-full w-full max-w-md bg-background border-l border-border/50 flex flex-col"
          >
            <div className="flex items-center justify-between px-6 h-16 border-b border-border/50">
              <h2 className="text-sm font-medium uppercase tracking-widest">Your Cart</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted transition-colors" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {!isHydrated ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6 opacity-50">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4 animate-pulse" />
                  <p className="text-sm text-muted-foreground">Loading cart...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground/30 mb-4" />
                  <p className="text-sm text-muted-foreground mb-6">Your cart is empty</p>
                  <Link href="/collections" onClick={onClose}>
                    <Button className="bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black text-xs uppercase tracking-widest transition-transform hover:scale-105">
                      Explore Collections
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  <AnimatePresence>
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, scale: 0.95 }}
                        transition={{ duration: 0.4, ease: luxeEase }}
                        className="flex gap-5 px-6 py-8 group"
                      >
                        <div className="relative w-20 h-28 bg-[#f5f5f7] dark:bg-[#111] shrink-0 overflow-hidden">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h3 className="text-xs font-semibold uppercase tracking-[0.15em] mb-1 leading-relaxed pr-4">{item.name}</h3>
                              <button
                                onClick={() => removeItem(item.id)}
                                className="text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1"
                                aria-label="Remove item"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                            {item.variant?.size && (
                              <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Size: {item.variant.size}</p>
                            )}
                            <p className="text-sm font-light mt-2">${item.price.toFixed(2)}</p>
                          </div>
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-border/60">
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                              <span className="w-8 h-8 flex items-center justify-center text-xs border-x border-border/60">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-8 h-8 flex items-center justify-center hover:bg-muted transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {isHydrated && items.length > 0 && (
              <div className="border-t border-border/50 px-6 py-8 bg-background/95 backdrop-blur-md space-y-5">
                <div className="flex justify-between text-sm items-center">
                  <span className="text-xs uppercase tracking-[0.2em] font-medium text-muted-foreground">Subtotal</span>
                  <span className="font-light text-lg">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="w-full bg-border/40 h-px" />
                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] text-center">Complimentary shipping on all orders</p>
                <div className="space-y-3 pt-2">
                  <Link href="/checkout" onClick={onClose} className="block">
                    <Button className="w-full h-14 bg-foreground text-background hover:bg-foreground/90 text-[10px] sm:text-xs uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:scale-[1.02]">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  <Link href="/cart" onClick={onClose} className="block w-full">
                    <Button variant="outline" className="w-full h-12 text-[10px] uppercase tracking-[0.2em] border-border/60 hover:bg-muted transition-all duration-300">
                      View Full Cart
                    </Button>
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
