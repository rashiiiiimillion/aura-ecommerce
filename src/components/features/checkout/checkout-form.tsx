"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, CreditCard, Truck, User, Loader2, Tag, Check, Shield } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createRazorpayOrder, verifyPaymentSignature } from "@/actions/order";
import { useCartStore } from "@/store/useCartStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const shippingSchema = z.object({
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  postalCode: z.string().min(5, "Postal code is required"),
  country: z.string().min(2, "Country is required"),
  phone: z.string().optional(),
});

type ShippingValues = z.infer<typeof shippingSchema>;

// Declare Razorpay on window for TypeScript
declare global {
  interface Window {
    Razorpay: any;
  }
}

/**
 * Dynamically loads the Razorpay checkout script if not already present.
 */
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== "undefined" && window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function CheckoutForm() {
  const [step, setStep] = useState<"shipping" | "payment">("shipping");
  const [isLoading, setIsLoading] = useState(false);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const { items, directCheckoutItem, clearCart, clearDirectCheckout } = useCartStore();
  const router = useRouter();

  // If there's a direct checkout item (Buy Now), use that. Otherwise use the cart.
  const checkoutItems = directCheckoutItem ? [directCheckoutItem] : items;
  
  const form = useForm<ShippingValues>({
    resolver: zodResolver(shippingSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      address: "",
      apartment: "",
      city: "",
      state: "",
      postalCode: "",
      country: "India",
      phone: "",
    },
  });

  const onShippingSubmit = (data: ShippingValues) => {
    setStep("payment");
  };

  const handleApplyCoupon = () => {
    if (couponCode.trim()) {
      toast.info("Coupon support coming soon");
    }
  };

  const handleCompleteOrder = useCallback(async () => {
    setIsLoading(true);
    try {
      // 1. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        toast.error("Failed to load payment gateway. Please refresh and try again.");
        setIsLoading(false);
        return;
      }

      // 2. Create Razorpay order via server action
      const shippingData = form.getValues();
      const result = await createRazorpayOrder(checkoutItems, shippingData);

      if ("error" in result) {
        toast.error(result.error);
        setIsLoading(false);
        return;
      }

      if (!("success" in result) || !result.success) {
        toast.error("Failed to create order. Please try again.");
        setIsLoading(false);
        return;
      }

      // 3. Open Razorpay checkout popup
      const options = {
        key: result.razorpayKeyId,
        amount: result.amount,
        currency: result.currency,
        name: "AURA",
        description: "Premium Luxury Purchase",
        order_id: result.razorpayOrderId,
        prefill: result.prefill,
        theme: {
          color: "#111111",
          backdrop_color: "rgba(0, 0, 0, 0.7)",
        },
        modal: {
          ondismiss: () => {
            setIsLoading(false);
            toast.info("Payment was cancelled");
          },
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 4. Verify payment signature on the server
          try {
            const verifyResult = await verifyPaymentSignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            if ("success" in verifyResult && verifyResult.success) {
              if (directCheckoutItem) {
                clearDirectCheckout();
              } else {
                clearCart();
              }
              router.push(`/orders/${verifyResult.orderId}`);
            } else {
              toast.error("error" in verifyResult ? verifyResult.error : "Payment verification failed");
              setIsLoading(false);
            }
          } catch {
            toast.error("Payment verification failed. Please contact support.");
            setIsLoading(false);
          }
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        toast.error(response.error?.description || "Payment failed. Please try again.");
        setIsLoading(false);
      });

      rzp.open();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("An unexpected error occurred");
      setIsLoading(false);
    }
  }, [checkoutItems, directCheckoutItem, form, clearCart, clearDirectCheckout, router]);

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-6 mb-10">
        <div className={`flex items-center gap-3 ${step === "shipping" ? "text-foreground" : "text-muted-foreground"}`}>
          <div className={`w-8 h-8 flex items-center justify-center text-xs border ${step === "shipping" ? "border-foreground bg-foreground text-background" : step === "payment" ? "border-foreground bg-foreground text-background" : "border-muted-foreground"}`}>
            {step === "payment" ? <Check className="w-4 h-4" /> : "1"}
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium hidden sm:inline">Shipping</span>
        </div>
        <Separator className="flex-1 bg-border/50" />
        <div className={`flex items-center gap-3 ${step === "payment" ? "text-foreground" : "text-muted-foreground"}`}>
          <div className={`w-8 h-8 flex items-center justify-center text-xs border ${step === "payment" ? "border-foreground bg-foreground text-background" : "border-muted-foreground"}`}>
            2
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium hidden sm:inline">Payment</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === "shipping" ? (
          <motion.div
            key="shipping"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <form onSubmit={form.handleSubmit(onShippingSubmit)} className="space-y-8">
              <section className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold">Contact Information</h2>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[10px] uppercase tracking-widest text-muted-foreground">Email Address</Label>
                  <Input 
                    id="email" 
                    {...form.register("email")} 
                    className="rounded-none border-border/50 focus-visible:ring-0 focus-visible:border-foreground transition-colors" 
                    placeholder="alex@example.com"
                  />
                  {form.formState.errors.email && (
                    <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.email.message}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-[10px] uppercase tracking-widest text-muted-foreground">Phone (Optional)</Label>
                  <Input id="phone" {...form.register("phone")} className="rounded-none border-border/50" placeholder="+91 98765 43210" />
                </div>
              </section>

              <section className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold">Shipping Address</h2>
                </div>
                <div className="grid gap-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-[10px] uppercase tracking-widest text-muted-foreground">First Name</Label>
                      <Input id="firstName" {...form.register("firstName")} className="rounded-none border-border/50" />
                      {form.formState.errors.firstName && (
                        <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.firstName.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-[10px] uppercase tracking-widest text-muted-foreground">Last Name</Label>
                      <Input id="lastName" {...form.register("lastName")} className="rounded-none border-border/50" />
                      {form.formState.errors.lastName && (
                        <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.lastName.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-[10px] uppercase tracking-widest text-muted-foreground">Address</Label>
                    <Input id="address" {...form.register("address")} className="rounded-none border-border/50" />
                    {form.formState.errors.address && (
                      <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.address.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apartment" className="text-[10px] uppercase tracking-widest text-muted-foreground">Apartment, suite, etc. (Optional)</Label>
                    <Input id="apartment" {...form.register("apartment")} className="rounded-none border-border/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city" className="text-[10px] uppercase tracking-widest text-muted-foreground">City</Label>
                      <Input id="city" {...form.register("city")} className="rounded-none border-border/50" />
                      {form.formState.errors.city && (
                        <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state" className="text-[10px] uppercase tracking-widest text-muted-foreground">State / Province</Label>
                      <Input id="state" {...form.register("state")} className="rounded-none border-border/50" />
                      {form.formState.errors.state && (
                        <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.state.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="postalCode" className="text-[10px] uppercase tracking-widest text-muted-foreground">Postal Code</Label>
                      <Input id="postalCode" {...form.register("postalCode")} className="rounded-none border-border/50" />
                      {form.formState.errors.postalCode && (
                        <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.postalCode.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="country" className="text-[10px] uppercase tracking-widest text-muted-foreground">Country</Label>
                      <Input id="country" {...form.register("country")} className="rounded-none border-border/50" />
                      {form.formState.errors.country && (
                        <p className="text-[10px] text-red-500 uppercase tracking-wide">{form.formState.errors.country.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.25em] font-medium"
              >
                Continue to Payment
              </Button>
            </form>
          </motion.div>
        ) : (
          <motion.div
            key="payment"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="space-y-8">
              <section className="space-y-5">
                <div className="flex items-center gap-3 mb-2">
                  <CreditCard className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold">Payment Method</h2>
                </div>
                
                <div className="p-8 border border-border/50 bg-white dark:bg-[#111] space-y-5">
                  <div className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                    <div className="relative">
                      <Shield className="w-10 h-10 text-muted-foreground/30" />
                    </div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest">Secure Razorpay Payment Gateway</p>
                    <p className="text-[10px] text-muted-foreground/60 max-w-[260px] leading-relaxed">
                      All transactions are secure and encrypted. Supports UPI, Cards, Net Banking &amp; Wallets.
                    </p>
                  </div>
                </div>
              </section>

              <section className="space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  <h2 className="text-[10px] uppercase tracking-[0.2em] font-semibold">Discount Code</h2>
                </div>
                <div className="flex gap-2">
                  <Input
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="rounded-none border-border/50 uppercase tracking-widest text-xs"
                    disabled={couponApplied}
                  />
                  <Button
                    onClick={handleApplyCoupon}
                    variant="outline"
                    className="rounded-none h-10 px-6 text-[10px] uppercase tracking-widest"
                    disabled={couponApplied || !couponCode.trim()}
                  >
                    {couponApplied ? "Applied" : "Apply"}
                  </Button>
                </div>
              </section>

              <div className="flex flex-col gap-4 pt-4">
                <Button 
                  onClick={handleCompleteOrder}
                  disabled={isLoading}
                  className="w-full h-14 rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.25em] font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    `Pay ₹${(checkoutItems.reduce((acc, item) => acc + (item.price * item.quantity), 0) * 1.08).toFixed(2)}`
                  )}
                </Button>
                <button 
                  onClick={() => setStep("shipping")}
                  disabled={isLoading}
                  className="text-[10px] uppercase tracking-widest text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
                >
                  Back to shipping
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
