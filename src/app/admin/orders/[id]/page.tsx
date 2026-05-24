import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, MapPin } from "lucide-react";
import { OrderStatusControls } from "@/components/features/admin/order-status-controls";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";

import { serializeOrder } from "@/lib/serializers";

export const metadata = {
  title: "Order Details | Admin | AURA",
};

export const dynamic = "force-dynamic";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  
  const orderRaw = await prisma.order.findUnique({
    where: { id: resolvedParams.id },
    include: {
      user: { select: { name: true, email: true } },
      items: { include: { product: { select: { name: true, images: true } } } },
      payment: true,
      address: true,
    }
  });

  if (!orderRaw) {
    notFound();
  }

  const order = serializeOrder(orderRaw);

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <Link 
          href="/admin/orders" 
          className="group flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
          Back to Orders
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Order Details</h1>
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2 font-mono">
              ID: {order.id}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-light tracking-tight">₹{Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
            <div className="text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
              {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Items */}
          <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                <Package className="w-4 h-4" />
                Line Items ({order.items.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border/50">
                {order.items.map((item: any) => (
                  <div key={item.id} className="p-6 flex items-start gap-4">
                    <div className="w-16 h-20 relative bg-black/5 dark:bg-white/5 shrink-0">
                      {item.product.images?.[0] && (
                        <Image 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{item.product.name}</div>
                      <div className="text-[10px] text-muted-foreground mt-1 font-mono">QTY: {item.quantity}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-medium text-sm">₹{Number(item.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
                      <div className="text-[10px] text-muted-foreground mt-1">
                        Total: ₹{(Number(item.price) * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Controls */}
          <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-xs uppercase tracking-widest">Controls</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <OrderStatusControls 
                orderId={order.id} 
                currentOrderStatus={order.status} 
                currentPaymentStatus={order.paymentStatus} 
              />
            </CardContent>
          </Card>

          {/* Customer Info */}
          <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm space-y-4">
              <div>
                <div className="font-medium">{order.user.name || "Guest"}</div>
                <div className="text-muted-foreground mt-1">{order.user.email}</div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
            <CardHeader className="border-b border-border/50">
              <CardTitle className="text-xs uppercase tracking-widest flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Shipping Details
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-sm">
              {order.address ? (
                <div className="space-y-1 text-muted-foreground">
                  <div className="text-foreground font-medium">{order.address.street}</div>
                  <div>{order.address.city}, {order.address.state}</div>
                  <div>{order.address.postalCode}</div>
                  <div>{order.address.country}</div>
                </div>
              ) : (
                <div className="text-muted-foreground italic text-[10px] uppercase tracking-widest">No address provided</div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
