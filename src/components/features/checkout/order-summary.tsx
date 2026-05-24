"use client";

import Image from "next/image";
import { CartItem } from "@/store/useCartStore";
import { Separator } from "@/components/ui/separator";

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
}

export function OrderSummary({ items, total }: OrderSummaryProps) {
  const shipping = 0; // Complimentary
  const tax = total * 0.08; // Example 8% tax
  const finalTotal = total + shipping + tax;

  return (
    <div className="bg-white dark:bg-[#111] border border-border/50 p-8 space-y-8">
      <h2 className="text-sm font-medium uppercase tracking-widest border-b pb-4">Order Summary</h2>
      
      <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative w-16 h-20 bg-[#f5f5f7] shrink-0 overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between py-1">
              <div>
                <h3 className="text-[11px] font-medium uppercase tracking-wider line-clamp-1">{item.name}</h3>
                {item.variant?.size && (
                  <p className="text-[10px] text-muted-foreground uppercase tracking-tight mt-0.5">Size: {item.variant.size}</p>
                )}
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[10px] text-muted-foreground">Qty: {item.quantity}</span>
                <span className="text-xs">₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4 pt-4">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-wider">Subtotal</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-wider">Shipping</span>
          <span className="text-muted-foreground italic">Complimentary</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground uppercase tracking-wider">Estimated Tax</span>
          <span>₹{tax.toFixed(2)}</span>
        </div>
        <Separator className="bg-border/50" />
        <div className="flex justify-between text-sm font-medium">
          <span className="uppercase tracking-[0.2em]">Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>

      <div className="pt-4">
        <div className="bg-[#f9f9fb] dark:bg-muted/30 p-4 rounded-sm">
          <p className="text-[10px] text-muted-foreground leading-relaxed uppercase tracking-wide">
            Shipping and taxes are calculated based on your location. Premium delivery included with every order.
          </p>
        </div>
      </div>
    </div>
  );
}
