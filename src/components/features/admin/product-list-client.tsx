"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit, Trash2, Star, Loader2, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteProduct, toggleFeaturedProduct } from "@/actions/admin-products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function ProductListClient({ products }: { products: any[] }) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [isToggling, setIsToggling] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string, hasOrders: boolean) => {
    const confirmMessage = hasOrders 
      ? "This product exists in past orders and will be archived instead of permanently deleted. Continue?"
      : "Are you sure you want to permanently delete this product?";
      
    if (!confirm(confirmMessage)) return;
    
    setIsDeleting(id);
    const result = await deleteProduct(id);
    
    if (result.success) {
      toast.success(result.message || "Product deleted successfully");
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete product");
    }
    setIsDeleting(null);
  };

  const handleToggleFeatured = async (id: string, currentStatus: boolean) => {
    setIsToggling(id);
    const result = await toggleFeaturedProduct(id, !currentStatus);
    
    if (result.success) {
      toast.success(`Product ${!currentStatus ? 'featured' : 'unfeatured'}`);
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update product");
    }
    setIsToggling(null);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50 bg-black/5 dark:bg-white/5">
          <tr>
            <th className="px-6 py-4 font-medium">Product</th>
            <th className="px-6 py-4 font-medium">Category</th>
            <th className="px-6 py-4 font-medium">Price</th>
            <th className="px-6 py-4 font-medium">Inventory</th>
            <th className="px-6 py-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-12 relative bg-black/5 dark:bg-white/5 overflow-hidden">
                    {product.images?.[0] ? (
                      <Image 
                        src={product.images[0]} 
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                  <div>
                    <div className="font-medium">{product.name}</div>
                    <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                      {product.inventory?.sku || "NO-SKU"}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {product.category?.name || "Uncategorized"}
              </td>
              <td className="px-6 py-4 font-medium">
                ₹{Number(product.price).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${
                    (product.inventory?.quantity || 0) > 10 ? 'bg-green-500' :
                    (product.inventory?.quantity || 0) > 0 ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <span>{product.inventory?.quantity || 0} in stock</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center justify-end gap-2">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none"
                    onClick={() => handleToggleFeatured(product.id, product.isFeatured)}
                    disabled={isToggling === product.id}
                  >
                    {isToggling === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Star className={`w-4 h-4 ${product.isFeatured ? 'fill-[#d4af37] text-[#d4af37]' : 'text-muted-foreground'}`} />
                    )}
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground"
                    onClick={() => router.push(`/admin/products/${product.id}/edit`)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(product.id, (product._count?.orderItems || 0) > 0)}
                    disabled={isDeleting === product.id}
                    title={(product._count?.orderItems || 0) > 0 ? "Archive Product" : "Delete Product"}
                  >
                    {isDeleting === product.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (product._count?.orderItems || 0) > 0 ? (
                      <Archive className="w-4 h-4" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
          {products.length === 0 && (
            <tr>
              <td colSpan={5} className="px-6 py-12 text-center text-xs text-muted-foreground uppercase tracking-widest">
                No products found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
