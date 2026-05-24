"use client";

import { useState } from "react";
import { updateOrderStatus, updatePaymentStatus } from "@/actions/admin-orders";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ORDER_STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"] as const;
const PAYMENT_STATUSES = ["PENDING", "COMPLETED", "FAILED", "REFUNDED"] as const;

export function OrderStatusControls({ 
  orderId, 
  currentOrderStatus, 
  currentPaymentStatus 
}: { 
  orderId: string, 
  currentOrderStatus: string,
  currentPaymentStatus: string 
}) {
  const [isUpdatingOrder, setIsUpdatingOrder] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);

  const handleOrderStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdatingOrder(true);
    const newStatus = e.target.value as any;
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      toast.success("Order status updated");
    } else {
      toast.error(result.error || "Failed to update status");
    }
    setIsUpdatingOrder(false);
  };

  const handlePaymentStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setIsUpdatingPayment(true);
    const newStatus = e.target.value as any;
    const result = await updatePaymentStatus(orderId, newStatus);
    if (result.success) {
      toast.success("Payment status updated");
    } else {
      toast.error(result.error || "Failed to update status");
    }
    setIsUpdatingPayment(false);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Fulfillment Status
          {isUpdatingOrder && <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />}
        </label>
        <select 
          value={currentOrderStatus}
          onChange={handleOrderStatusChange}
          disabled={isUpdatingOrder}
          className="w-full h-10 rounded-none border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        >
          {ORDER_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
          Payment Status
          {isUpdatingPayment && <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />}
        </label>
        <select 
          value={currentPaymentStatus}
          onChange={handlePaymentStatusChange}
          disabled={isUpdatingPayment}
          className="w-full h-10 rounded-none border border-border/50 bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
        >
          {PAYMENT_STATUSES.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
