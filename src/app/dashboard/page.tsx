import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Package, Heart, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import Image from "next/image";

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const userId = session.user.id;

  const [user, orderCount, wishlistCount, recentOrders] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.order.count({ where: { userId } }),
    prisma.wishlistProduct.count({ where: { wishlist: { userId } } }),
    prisma.order.findMany({
      where: { userId },
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        payment: true,
      },
    }),
  ]);

  return (
    <div className="space-y-12">
      <section>
        <div className="mb-10">
          <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-2">Welcome back</p>
          <h2 className="text-3xl md:text-4xl font-heading font-light uppercase tracking-wide">{session.user.name || "Valued Client"}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          <Link href="/dashboard/orders" className="group p-6 md:p-8 border border-border/50 bg-white dark:bg-[#111] space-y-4 hover:border-foreground/30 transition-colors">
            <Package className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-2xl md:text-3xl font-light">{orderCount}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Total Orders</p>
            </div>
          </Link>
          <Link href="/dashboard/wishlist" className="group p-6 md:p-8 border border-border/50 bg-white dark:bg-[#111] space-y-4 hover:border-foreground/30 transition-colors">
            <Heart className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-2xl md:text-3xl font-light">{wishlistCount}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Wishlist Items</p>
            </div>
          </Link>
          <div className="p-6 md:p-8 border border-border/50 bg-white dark:bg-[#111] space-y-4">
            <Clock className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-light mt-1">{user?.createdAt ? format(new Date(user.createdAt), "MMMM yyyy") : "N/A"}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-1">Member Since</p>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-xs uppercase tracking-[0.2em] font-medium">Recent Orders</h2>
          <Link href="/dashboard/orders" className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground underline underline-offset-4 hover:text-foreground">
            View All
          </Link>
        </div>

        {recentOrders.length > 0 ? (
          <div className="space-y-4">
            {recentOrders.map((order) => {
              const isINR = order.payment?.currency?.toUpperCase() === "INR" || !!order.razorpayOrderId;
              const currencySymbol = isINR ? "₹" : "$";
              return (
                <Link href={`/dashboard/orders/${order.id}`} key={order.id} className="block p-6 border border-border/50 bg-white dark:bg-[#111] flex flex-col md:flex-row justify-between gap-6 hover:border-foreground/30 transition-colors">
                  <div className="flex gap-4 md:gap-6">
                    <div className="flex -space-x-3">
                      {order.items.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="w-10 h-14 bg-muted relative border-2 border-background overflow-hidden">
                          <Image
                            src={item.product.images[0] || "/placeholder.svg"}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                      ))}
                      {order.items.length > 3 && (
                        <div className="w-10 h-14 bg-muted flex items-center justify-center text-[10px] border-2 border-background">
                          +{order.items.length - 3}
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Order #{order.id.slice(-8).toUpperCase()}</p>
                      <p className="text-xs text-muted-foreground">{format(order.createdAt, "MMM dd, yyyy")}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-8 md:gap-12">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Total</p>
                      <p className="text-sm font-medium">{currencySymbol}{Number(order.total).toFixed(2)}</p>
                    </div>
                    <div className={`px-3 py-1.5 text-[9px] uppercase tracking-widest font-medium ${statusColors[order.status] || "bg-muted text-muted-foreground"}`}>
                      {order.status}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-border/50">
            <Package className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-xs uppercase tracking-widest text-muted-foreground">No orders yet</p>
            <Link href="/collections" className="inline-block mt-4 text-[10px] uppercase tracking-[0.2em] underline underline-offset-4 hover:text-foreground transition-colors">
              Explore Collections
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
