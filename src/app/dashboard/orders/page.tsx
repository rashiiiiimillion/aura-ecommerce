import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import Link from "next/link";
import Image from "next/image";
import { Package, ChevronRight, Search } from "lucide-react";

export default async function OrdersPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      payment: true,
    },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Your Orders</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">View and track your purchases</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search orders..." 
            className="pl-10 pr-4 py-2 bg-white dark:bg-[#111] border border-border/50 text-[10px] uppercase tracking-widest outline-none focus:border-black transition-colors w-full md:w-64"
          />
        </div>
      </div>

      {orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order) => {
            const isINR = order.payment?.currency?.toUpperCase() === "INR" || !!order.razorpayOrderId;
            const currencySymbol = isINR ? "₹" : "$";
            return (
              <div key={order.id} className="border border-border/50 bg-white dark:bg-[#111] overflow-hidden group">
                <div className="p-6 border-b border-border/50 bg-muted/20 flex flex-wrap items-center justify-between gap-6">
                  <div className="flex flex-wrap gap-8 md:gap-12">
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Order Number</p>
                      <p className="text-xs font-medium">#{order.id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Date Placed</p>
                      <p className="text-xs font-medium">{format(order.createdAt, "MMM dd, yyyy")}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total Amount</p>
                      <p className="text-xs font-medium">{currencySymbol}{Number(order.total).toFixed(2)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Status</p>
                      <p className={`text-[10px] font-semibold uppercase tracking-widest ${
                        order.status === 'DELIVERED' ? 'text-green-600' : 'text-foreground'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                  <Link 
                    href={`/dashboard/orders/${order.id}`}
                    className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] font-medium hover:text-muted-foreground transition-colors"
                  >
                    Order Details
                    <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>

                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative w-16 h-20 bg-muted shrink-0 overflow-hidden">
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                        <div className="flex flex-col justify-between py-1">
                          <div>
                            <h4 className="text-[10px] uppercase tracking-widest font-medium line-clamp-1">{item.product.name}</h4>
                            <p className="text-[10px] text-muted-foreground mt-1">Qty: {item.quantity}</p>
                          </div>
                          <p className="text-xs font-medium">{currencySymbol}{Number(item.price).toFixed(2)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-4 bg-muted/10 border-t border-border/50 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-[10px] uppercase tracking-widest text-muted-foreground">Tracking available soon</span>
                  </div>
                  <button className="text-[10px] uppercase tracking-widest text-muted-foreground underline underline-offset-4 hover:text-foreground">
                    Need help?
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center border border-dashed border-border/50 bg-white dark:bg-[#111]">
          <Package className="w-12 h-12 text-muted-foreground/20 mx-auto mb-4" />
          <h2 className="text-xl font-light mb-2 uppercase tracking-widest">No orders found</h2>
          <p className="text-xs text-muted-foreground mb-8">You haven&apos;t placed any orders yet.</p>
          <Link href="/collections" className="inline-block bg-black text-white px-8 py-4 text-[10px] uppercase tracking-[0.2em] hover:bg-black/90 transition-colors">
            Start Shopping
          </Link>
        </div>
      )}
    </div>
  );
}
