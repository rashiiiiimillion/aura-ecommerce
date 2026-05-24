import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { InventoryQuickEdit } from "@/components/features/admin/inventory-client";
import Image from "next/image";

export const metadata = {
  title: "Inventory | Admin | AURA",
};

export const dynamic = "force-dynamic";

export default async function AdminInventoryPage() {
  const inventoryItems = await prisma.inventory.findMany({
    include: {
      product: {
        select: { name: true, images: true, isActive: true }
      }
    },
    orderBy: {
      quantity: 'asc' // Show low stock first
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Inventory</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
          Track and update stock levels
        </p>
      </div>

      <Card className="rounded-none border-border/50 bg-white dark:bg-[#111]">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50 bg-black/5 dark:bg-white/5">
                <tr>
                  <th className="px-6 py-4 font-medium">Product</th>
                  <th className="px-6 py-4 font-medium">SKU</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Quantity In Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-12 relative bg-black/5 dark:bg-white/5 shrink-0">
                          {item.product.images?.[0] && (
                            <Image 
                              src={item.product.images[0]} 
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div className="font-medium">{item.product.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs uppercase text-muted-foreground">
                      {item.sku}
                    </td>
                    <td className="px-6 py-4">
                      {item.quantity === 0 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400">
                          Out of Stock
                        </span>
                      ) : item.quantity <= 10 ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          In Stock
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <InventoryQuickEdit inventoryId={item.id} initialQuantity={item.quantity} />
                      </div>
                    </td>
                  </tr>
                ))}
                {inventoryItems.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-xs text-muted-foreground uppercase tracking-widest">
                      No inventory records found
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
