import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { serializeOrder } from "@/lib/serializers";

export const metadata = {
  title: "Orders | Admin | AURA",
};

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const ordersRaw = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true }
      },
      payment: true,
      items: true
    }
  });

  const orders = ordersRaw.map(serializeOrder);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Orders</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
          Manage fulfillment and transactions
        </p>
      </div>

      <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50 bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Items</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{order.id.slice(-8).toUpperCase()}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span>{order.user.name || "Guest"}</span>
                        <span className="text-[10px] text-muted-foreground">{order.user.email}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {order.items?.length || 0}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₹{Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium ${
                        order.status === "DELIVERED" 
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : order.status === "PROCESSING"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        <Link href={`/admin/orders/${order.id}`} className="inline-flex items-center justify-center h-8 w-8 rounded-none text-muted-foreground hover:text-foreground hover:bg-muted dark:hover:bg-muted/50 transition-colors">
                          <Eye className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-xs text-muted-foreground uppercase tracking-widest">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
