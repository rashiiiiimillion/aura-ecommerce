"use client";

import { Plus, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

export default function AddProductButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isPending) return;
    startTransition(() => {
      router.push("/admin/products/new");
    });
  };

  return (
    <button 
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        buttonVariants({ variant: "default" }),
        "relative z-[100] pointer-events-auto cursor-pointer rounded-none bg-foreground text-background hover:bg-foreground/90 text-[10px] uppercase tracking-widest px-6 h-10 transition-all duration-200 active:scale-[0.98]",
        isPending && "opacity-80 pointer-events-none"
      )}
    >
      {isPending ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Plus className="w-3 h-3 mr-2" />}
      {isPending ? "Loading..." : "Add Product"}
    </button>
  );
}
