import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";

const statusIcons: Record<string, typeof Package> = {
  PENDING: Clock,
  PROCESSING: Package,
  SHIPPED: Truck,
  DELIVERED: CheckCircle,
  CANCELLED: XCircle,
  REFUNDED: XCircle,
};

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  PROCESSING: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  SHIPPED: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
  DELIVERED: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  REFUNDED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
};

export default async function OrderDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      address: true,
      payment: true,
    },
  });

  if (!order || order.userId !== session.user.id) {
    notFound();
  }

  const StatusIcon = statusIcons[order.status] || Package;
  const isINR = order.payment?.currency?.toUpperCase() === "INR" || !!order.razorpayOrderId;
  const currencySymbol = isINR ? "₹" : "$";

  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6 max-w-4xl">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-light uppercase tracking-wide">Order {order.id.slice(-8).toUpperCase()}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Placed on {format(new Date(order.createdAt), "MMMM d, yyyy")}
            </p>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 text-[10px] uppercase tracking-widest font-medium ${statusColors[order.status]}`}>
            <StatusIcon className="w-4 h-4" />
            {order.status.toLowerCase()}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="border border-border/50 p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Total</p>
            <p className="text-2xl font-light">{currencySymbol}{Number(order.total).toFixed(2)}</p>
          </div>
          <div className="border border-border/50 p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Payment</p>
            <p className="text-sm font-medium uppercase tracking-wider">{order.paymentStatus.toLowerCase()}</p>
          </div>
          <div className="border border-border/50 p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Items</p>
            <p className="text-sm font-medium">{order.items.length} {order.items.length === 1 ? "item" : "items"}</p>
          </div>
        </div>

        <div className="border border-border/50 mb-6">
          <div className="p-6 border-b border-border/50">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium">Items</h2>
          </div>
          <div className="divide-y divide-border/50">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4 p-6">
                <div className="relative w-20 h-24 bg-[#f5f5f7] dark:bg-[#111] shrink-0 overflow-hidden">
                  <Image
                    src={item.product.images[0] || "/placeholder.svg"}
                    alt={item.product.name}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs uppercase tracking-wider font-medium mb-1">{item.product.name}</h3>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Qty: {item.quantity}</p>
                  <p className="text-sm mt-1">{currencySymbol}{Number(item.price).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-border/50 p-6">
            <h2 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">Shipping Address</h2>
            <div className="text-sm text-muted-foreground leading-relaxed">
              <p>{order.address.street}</p>
              {order.address.street && <p>{order.address.street}</p>}
              <p>{order.address.city}, {order.address.state} {order.address.postalCode}</p>
              <p>{order.address.country}</p>
            </div>
          </div>
          {order.payment && (
            <div className="border border-border/50 p-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-medium mb-4">Payment</h2>
              <div className="text-sm text-muted-foreground leading-relaxed space-y-1">
                <p>Provider: {order.payment.provider}</p>
                <p>Transaction: {order.payment.transactionId.slice(-12)}</p>
                <p>Amount: {currencySymbol}{Number(order.payment.amount).toFixed(2)} {order.payment.currency}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
