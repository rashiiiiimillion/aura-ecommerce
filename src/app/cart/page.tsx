"use client";

import { useCartStore } from "@/store/useCartStore";
import { useHydrated } from "@/store/useStore";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const isHydrated = useHydrated();
  const { items, removeItem, updateQuantity, getCartTotal } = useCartStore();

  if (!isHydrated) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-outfit font-light tracking-tight mb-12">Your Cart</h1>
          <div className="animate-pulse space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-muted" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <h1 className="text-4xl md:text-5xl font-outfit font-light tracking-tight mb-12">Your Cart</h1>
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mb-6" />
            <h2 className="text-2xl font-light mb-2">Your cart is empty</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              Discover our curated collections and add something extraordinary.
            </p>
            <Link
              href="/collections"
              className="bg-black text-white px-8 py-4 text-xs uppercase tracking-widest hover:bg-black/90 transition-colors inline-flex items-center gap-2"
            >
              Continue Shopping
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <h1 className="text-4xl md:text-5xl font-outfit font-light tracking-tight mb-12">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-0 divide-y">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="flex gap-6 py-8"
                >
                  <div className="relative w-24 h-32 md:w-32 md:h-40 bg-[#f5f5f7] shrink-0 overflow-hidden">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-sm font-medium uppercase tracking-wider mb-1">{item.name}</h3>
                      {item.variant?.size && (
                        <p className="text-xs text-muted-foreground">Size: {item.variant.size}</p>
                      )}
                      <p className="text-sm mt-2">${item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center border">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-10 h-10 flex items-center justify-center text-sm border-x">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-10 h-10 flex items-center justify-center hover:bg-muted transition-colors"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 border p-8 space-y-6">
              <h2 className="text-sm font-medium uppercase tracking-wider">Order Summary</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="text-muted-foreground">Complimentary</span>
                </div>
              </div>
              <div className="border-t pt-4 flex justify-between font-medium">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <Link href="/checkout" className="w-full bg-black text-white py-4 text-xs uppercase tracking-widest hover:bg-black/90 transition-colors text-center block">
                Proceed to Checkout
              </Link>
              <Link
                href="/collections"
                className="block text-center text-xs text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
