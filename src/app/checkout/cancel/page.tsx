import Link from "next/link";
import { XCircle, ArrowLeft, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CancelPage() {
  return (
    <div className="min-h-screen pt-32 pb-16 flex flex-col items-center justify-center bg-[#fcfcfc] dark:bg-background px-6 text-center">
      <div className="max-w-md w-full space-y-8">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-20 h-20 bg-red-50 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-4xl font-heading font-light tracking-tight uppercase">Payment Cancelled</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Your payment process was cancelled. No charges were made to your account. 
            If you encountered any issues, please contact our concierge service.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <Link href="/checkout">
            <Button className="w-full h-14 rounded-none bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90 text-xs uppercase tracking-[0.2em]">
              Return to Checkout
              <ShoppingBag className="ml-3 w-4 h-4" />
            </Button>
          </Link>
          <Link href="/cart">
            <Button variant="ghost" className="w-full h-14 rounded-none text-xs uppercase tracking-[0.2em]">
              <ArrowLeft className="mr-3 w-4 h-4" />
              Back to Cart
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
