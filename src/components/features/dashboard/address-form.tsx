"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema } from "@/lib/validations";
import { createAddress, updateAddress } from "@/actions/address";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

type AddressValues = {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
};

interface AddressFormProps {
  mode: "create" | "edit";
  address?: {
    id: string;
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  };
}

export function AddressForm({ mode, address }: AddressFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema) as any,
    defaultValues: {
      street: address?.street || "",
      city: address?.city || "",
      state: address?.state || "",
      postalCode: address?.postalCode || "",
      country: address?.country || "",
      isDefault: address?.isDefault || false,
    },
  });

  const onSubmit = async (data: AddressValues) => {
    setIsLoading(true);
    try {
      if (mode === "create") {
        const result = await createAddress(data);
        if ("success" in result && result.success) {
          toast.success("Address added");
          setIsOpen(false);
          form.reset();
        } else {
          toast.error("error" in result ? result.error : "Failed to add address");
        }
      } else if (address) {
        const result = await updateAddress(address.id, data);
        if ("success" in result && result.success) {
          toast.success("Address updated");
          setIsOpen(false);
        } else {
          toast.error("error" in result ? result.error : "Failed to update address");
        }
      }
    } catch {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === "edit") {
    return (
      <>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
        >
          Edit
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="bg-background w-full max-w-md p-6 md:p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm uppercase tracking-[0.2em] font-medium">Edit Address</h3>
                  <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Street</Label>
                    <Input {...form.register("street")} className="rounded-none border-border/50" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">City</Label>
                      <Input {...form.register("city")} className="rounded-none border-border/50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">State</Label>
                      <Input {...form.register("state")} className="rounded-none border-border/50" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Postal Code</Label>
                      <Input {...form.register("postalCode")} className="rounded-none border-border/50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Country</Label>
                      <Input {...form.register("country")} className="rounded-none border-border/50" />
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.2em]">
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
                  </Button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="rounded-none h-10 px-4 text-[10px] uppercase tracking-[0.2em] gap-2"
      >
        <Plus className="w-3 h-3" />
        Add New
      </Button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-background w-full max-w-md p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm uppercase tracking-[0.2em] font-medium">New Address</h3>
                <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-muted transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Street</Label>
                  <Input {...form.register("street")} className="rounded-none border-border/50" />
                  {form.formState.errors.street && (
                    <p className="text-[10px] text-red-500">{form.formState.errors.street.message}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">City</Label>
                    <Input {...form.register("city")} className="rounded-none border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">State</Label>
                    <Input {...form.register("state")} className="rounded-none border-border/50" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Postal Code</Label>
                    <Input {...form.register("postalCode")} className="rounded-none border-border/50" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-[10px] uppercase tracking-widest text-muted-foreground">Country</Label>
                    <Input {...form.register("country")} className="rounded-none border-border/50" />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading} className="w-full h-12 rounded-none bg-foreground text-background hover:bg-foreground/90 text-xs uppercase tracking-[0.2em]">
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Address"}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
