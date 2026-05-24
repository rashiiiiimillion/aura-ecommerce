import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Users, Package, ShoppingCart } from "lucide-react";

export const metadata = {
  title: "Admin Dashboard | AURA",
};

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  // Fetch overview stats
  const [
    totalRevenueResult,
    totalOrders,
    totalCustomers,
    inventoryData
  ] = await Promise.all([
    prisma.payment.aggregate({
      where: { status: "COMPLETED" },
      _sum: { amount: true }
    }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "USER" } }),
    prisma.inventory.aggregate({
      _sum: { quantity: true }
    })
  ]);

  const totalRevenue = Number(totalRevenueResult._sum.amount || 0);
  const totalItemsInStock = inventoryData._sum.quantity || 0;

  // Fetch recent orders
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: { name: true, email: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Overview</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
          Store performance metrics
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Revenue Card */}
        <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Total Revenue
            </CardTitle>
            <CreditCard className="w-4 h-4 text-[#d4af37]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light tracking-tight">₹{totalRevenue.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</div>
          </CardContent>
        </Card>

        {/* Orders Card */}
        <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Total Orders
            </CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light tracking-tight">{totalOrders}</div>
          </CardContent>
        </Card>

        {/* Customers Card */}
        <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Total Customers
            </CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light tracking-tight">{totalCustomers}</div>
          </CardContent>
        </Card>

        {/* Inventory Card */}
        <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-[10px] uppercase tracking-widest text-muted-foreground">
              Items in Stock
            </CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-light tracking-tight">{totalItemsInStock}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2">
        <Card className="rounded-none border-border/50 bg-white dark:bg-[#111] col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xs uppercase tracking-widest">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Order ID</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">{order.id.slice(-8).toUpperCase()}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span>{order.user.name || "Guest"}</span>
                          <span className="text-[10px] text-muted-foreground">{order.user.email}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
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
                      <td className="px-4 py-3 text-right font-medium">
                        ₹{Number(order.total).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                  {recentOrders.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-xs text-muted-foreground uppercase tracking-widest">
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
    </div>
  );
}
