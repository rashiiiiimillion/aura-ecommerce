"use client";

import { useState } from "react";
import { createCoupon, deleteCoupon, toggleCouponActive } from "@/actions/admin-coupons";
import { toast } from "sonner";
import { Loader2, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CouponListClient({ coupons }: { coupons: any[] }) {
  const [isCreating, setIsCreating] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"PERCENTAGE" | "FIXED">("PERCENTAGE");
  const [discountValue, setDiscountValue] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);

    const result = await createCoupon({
      code,
      discountType,
      discountValue: parseFloat(discountValue),
      startDate: new Date().toISOString(),
      endDate: new Date(endDate).toISOString(),
      isActive: true,
    });

    if (result.success) {
      toast.success("Coupon created");
      setCode("");
      setDiscountValue("");
      setEndDate("");
    } else {
      toast.error(result.error || "Failed to create");
    }
    setIsCreating(false);
  };

  const handleToggle = async (id: string, current: boolean) => {
    setLoadingId(id);
    const result = await toggleCouponActive(id, !current);
    if (!result.success) toast.error("Failed to update status");
    setLoadingId(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    setLoadingId(id);
    const result = await deleteCoupon(id);
    if (!result.success) toast.error("Failed to delete");
    setLoadingId(null);
  };

  return (
    <div className="space-y-8">
      {/* Create Form */}
      <form onSubmit={handleCreate} className="p-6 border border-border/50 bg-black/5 dark:bg-white/5 space-y-4">
        <h3 className="text-xs uppercase tracking-widest font-medium mb-4">Create New Coupon</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div className="space-y-2 md:col-span-1">
            <Label className="text-[10px] uppercase">Code</Label>
            <Input required value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="SUMMER24" className="rounded-none bg-background uppercase" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label className="text-[10px] uppercase">Type</Label>
            <select 
              value={discountType} 
              onChange={e => setDiscountType(e.target.value as any)}
              className="w-full h-10 rounded-none border border-border/50 bg-background px-3 text-sm focus:outline-none focus:border-foreground"
            >
              <option value="PERCENTAGE">Percentage (%)</option>
              <option value="FIXED">Fixed Amount (₹)</option>
            </select>
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label className="text-[10px] uppercase">Value</Label>
            <Input required type="number" step="0.01" value={discountValue} onChange={e => setDiscountValue(e.target.value)} placeholder={discountType === 'PERCENTAGE' ? "20" : "500"} className="rounded-none bg-background" />
          </div>
          <div className="space-y-2 md:col-span-1">
            <Label className="text-[10px] uppercase">Valid Until</Label>
            <Input required type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className="rounded-none bg-background" />
          </div>
          <div className="md:col-span-1">
            <Button disabled={isCreating} type="submit" className="w-full h-10 rounded-none bg-foreground text-background hover:bg-foreground/90 text-[10px] uppercase tracking-widest">
              {isCreating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : (
                <><Plus className="w-3 h-3 mr-2" /> Add</>
              )}
            </Button>
          </div>
        </div>
      </form>

      {/* List */}
      <div className="overflow-x-auto border border-border/50 bg-white dark:bg-[#111]">
        <table className="w-full text-sm text-left">
          <thead className="text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50 bg-black/5 dark:bg-white/5">
            <tr>
              <th className="px-6 py-4 font-medium">Code</th>
              <th className="px-6 py-4 font-medium">Discount</th>
              <th className="px-6 py-4 font-medium">Valid Until</th>
              <th className="px-6 py-4 font-medium">Usage</th>
              <th className="px-6 py-4 font-medium">Status</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-black/5 dark:hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-mono font-bold tracking-wider">{coupon.code}</td>
                <td className="px-6 py-4">
                  {coupon.discountType === "PERCENTAGE" 
                    ? `${coupon.discountValue}%` 
                    : `₹${Number(coupon.discountValue).toFixed(2)}`
                  }
                </td>
                <td className="px-6 py-4 text-muted-foreground text-xs">
                  {new Date(coupon.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 font-mono text-xs text-muted-foreground">
                  {coupon.usedCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'uses'}
                </td>
                <td className="px-6 py-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={coupon.isActive} 
                      onChange={() => handleToggle(coupon.id, coupon.isActive)}
                      disabled={loadingId === coupon.id}
                      className="rounded-none border-border/50 text-foreground focus:ring-foreground accent-black dark:accent-white disabled:opacity-50" 
                    />
                    <span className="text-[10px] uppercase">{coupon.isActive ? 'Active' : 'Disabled'}</span>
                  </label>
                </td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 rounded-none text-muted-foreground hover:text-red-500"
                    onClick={() => handleDelete(coupon.id)}
                    disabled={loadingId === coupon.id}
                  >
                    {loadingId === coupon.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                  </Button>
                </td>
              </tr>
            ))}
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-xs text-muted-foreground uppercase tracking-widest">
                  No coupons found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
