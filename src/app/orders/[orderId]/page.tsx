import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import Link from "next/link";
import { CheckCircle2, ArrowRight, Package, MapPin, CreditCard, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default async function OrderSuccessPage(props: { params: Promise<{ orderId: string }> }) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.orderId },
    include: {
      address: true,
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const deliveryDate = new Date(order.createdAt);
  deliveryDate.setDate(deliveryDate.getDate() + 4); // ~4 days delivery

  return (
    <div className="min-h-screen pt-32 pb-16 bg-[#fcfcfc] dark:bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Column: Success Message & Status */}
          <div className="flex-1 space-y-10">
            <div className="space-y-6">
              <div className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" />
              </div>
              <h1 className="text-4xl font-heading font-light tracking-tight uppercase">Order Confirmed</h1>
              <p className="text-muted-foreground leading-relaxed">
                Thank you for your purchase. We&apos;ve received your order and are preparing it for shipment.
                A confirmation email has been sent to your inbox.
              </p>
              <div className="inline-block px-4 py-2 border border-border/50 bg-white dark:bg-[#111] text-sm font-medium tracking-widest uppercase">
                Order #{order.id.slice(-8).toUpperCase()}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 border border-border/50 bg-white dark:bg-[#111] space-y-4">
                <div className="flex items-center gap-3 text-[#D4AF37]">
                  <Calendar className="w-5 h-5" />
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-foreground">Estimated Delivery</h3>
                </div>
                <p className="text-sm font-light text-muted-foreground">
                  {deliveryDate.toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>

              <div className="p-6 border border-border/50 bg-white dark:bg-[#111] space-y-4">
                <div className="flex items-center gap-3 text-[#D4AF37]">
                  <CreditCard className="w-5 h-5" />
                  <h3 className="text-[11px] uppercase tracking-widest font-bold text-foreground">Payment Status</h3>
                </div>
                <p className="text-sm font-light text-muted-foreground flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  {order.paymentStatus === "COMPLETED" ? "Paid Successfully" : "Pending"}
                </p>
              </div>
            </div>

            <div className="p-6 border border-border/50 bg-white dark:bg-[#111] space-y-4">
              <div className="flex items-center gap-3 text-[#D4AF37]">
                <MapPin className="w-5 h-5" />
                <h3 className="text-[11px] uppercase tracking-widest font-bold text-foreground">Shipping Address</h3>
              </div>
              <div className="text-sm font-light text-muted-foreground leading-relaxed">
                <p>{order.address.street}</p>
                <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
                <p>{order.address.country}</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/dashboard/orders" className="flex-1">
                <Button className="w-full h-14 rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.2em] font-medium shadow-sm">
                  Track Order
                  <Package className="ml-3 w-4 h-4" />
                </Button>
              </Link>
              <Link href="/collections" className="flex-1">
                <Button variant="outline" className="w-full h-14 rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background transition-colors text-xs uppercase tracking-[0.2em] font-medium">
                  Continue Shopping
                  <ArrowRight className="ml-3 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-[400px]">
            <div className="sticky top-32 p-8 border border-border/50 bg-white dark:bg-[#111]">
              <h2 className="text-[11px] uppercase tracking-[0.2em] font-bold mb-6 pb-6 border-b border-border/50">Order Summary</h2>
              
              <div className="space-y-6 mb-6 pb-6 border-b border-border/50">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-16 h-20 bg-muted shrink-0">
                      <Image
                        src={item.product.images[0] || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                      <h4 className="text-xs font-medium uppercase tracking-wider mb-1 line-clamp-1">{item.product.name}</h4>
                      <p className="text-[11px] text-muted-foreground mb-2">Qty: {item.quantity}</p>
                      <p className="text-xs font-medium">₹{Number(item.price).toLocaleString("en-IN")}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 text-sm font-light">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>₹{(Number(order.total) / 1.08).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (8%)</span>
                  <span>₹{(Number(order.total) - (Number(order.total) / 1.08)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className="text-[#D4AF37]">Complimentary</span>
                </div>
                <div className="pt-4 mt-4 border-t border-border/50 flex justify-between items-center font-medium text-foreground text-base">
                  <span className="uppercase tracking-widest text-[11px] font-bold">Total</span>
                  <span>₹{Number(order.total).toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
