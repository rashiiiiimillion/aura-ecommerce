import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { serializeDecimal } from "@/lib/serializers";

export const metadata = {
  title: "Customers | Admin | AURA",
};

export const dynamic = "force-dynamic";

export default async function AdminCustomersPage() {
  const users = await prisma.user.findMany({
    where: { role: "USER" },
    include: {
      orders: {
        select: { id: true, total: true, createdAt: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });

  const customers = users.map(user => {
    const totalSpent = user.orders.reduce((sum, order) => sum + serializeDecimal(order.total), 0);
    return {
      ...user,
      totalOrders: user.orders.length,
      totalSpent,
      lastOrderDate: user.orders[0]?.createdAt
    };
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Customers</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
          View and manage user accounts
        </p>
      </div>

      <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50 bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Email</th>
                  <th className="px-6 py-4 font-medium">Joined</th>
                  <th className="px-6 py-4 font-medium">Orders</th>
                  <th className="px-6 py-4 font-medium">Total Spent</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{customer.name || "Guest User"}</td>
                    <td className="px-6 py-4 text-muted-foreground">{customer.email}</td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(customer.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center justify-center px-2 py-1 rounded bg-black/5 dark:bg-white/5 text-[10px] font-mono">
                        {customer.totalOrders}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ₹{customer.totalSpent.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))}
                {customers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-xs text-muted-foreground uppercase tracking-widest">
                      No customers found
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
