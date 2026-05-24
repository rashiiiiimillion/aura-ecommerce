"use client";

import { useCartStore } from "@/store/useCartStore";
import { useHydrated } from "@/store/useStore";
import { CheckoutForm } from "@/components/features/checkout/checkout-form";
import { OrderSummary } from "@/components/features/checkout/order-summary";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const isHydrated = useHydrated();
  const { items, getCartTotal, directCheckoutItem } = useCartStore();
  const router = useRouter();

  const checkoutItems = directCheckoutItem ? [directCheckoutItem] : items;
  const checkoutTotal = directCheckoutItem 
    ? directCheckoutItem.price * directCheckoutItem.quantity 
    : getCartTotal();

  useEffect(() => {
    if (isHydrated && checkoutItems.length === 0) {
      router.push("/cart");
    }
  }, [isHydrated, checkoutItems.length, router]);

  if (!isHydrated || checkoutItems.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#fcfcfc] dark:bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-12">
          <Link 
            href="/cart" 
            className="group flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Back to Cart
          </Link>
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-heading font-light tracking-tight uppercase">Checkout</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">Secure Payment Gateway</p>
          </div>
          <div className="w-20 hidden md:block" /> {/* Spacer */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
          <div className="lg:col-span-7">
            <CheckoutForm />
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-24">
              <OrderSummary items={checkoutItems} total={checkoutTotal} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
