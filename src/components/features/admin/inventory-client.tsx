"use client";

import { useState } from "react";
import { updateInventoryQuantity } from "@/actions/admin-inventory";
import { toast } from "sonner";
import { Loader2, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function InventoryQuickEdit({ inventoryId, initialQuantity }: { inventoryId: string, initialQuantity: number }) {
  const [quantity, setQuantity] = useState(initialQuantity.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdate = async () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty < 0) {
      toast.error("Invalid quantity");
      return;
    }

    setIsUpdating(true);
    const result = await updateInventoryQuantity(inventoryId, qty);
    if (result.success) {
      toast.success("Inventory updated");
    } else {
      toast.error(result.error || "Update failed");
      setQuantity(initialQuantity.toString()); // Revert
    }
    setIsUpdating(false);
  };

  return (
    <div className="flex items-center gap-2">
      <Input 
        type="number" 
        value={quantity} 
        onChange={(e) => setQuantity(e.target.value)}
        className="w-20 h-8 rounded-none border-border/50 text-right font-mono"
        disabled={isUpdating}
      />
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 rounded-none text-muted-foreground hover:text-foreground"
        onClick={handleUpdate}
        disabled={isUpdating || parseInt(quantity, 10) === initialQuantity}
      >
        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
      </Button>
    </div>
  );
}
