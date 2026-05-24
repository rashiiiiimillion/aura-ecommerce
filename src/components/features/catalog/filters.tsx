"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const CATEGORIES = [
  { id: "mens", name: "Men" },
  { id: "womens", name: "Women" },
  { id: "accessories", name: "Accessories" },
  { id: "footwear", name: "Footwear" },
  { id: "essentials", name: "Luxury Essentials" },
];

export function Filters({ onSelect }: { onSelect?: () => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentCategory = searchParams.get("category");
  const isFeatured = searchParams.get("featured") === "true";

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col space-y-10 sticky top-24">
      {/* Category Filter */}
      <div>
        <h3 className="text-[11px] font-heading font-bold uppercase tracking-widest mb-4 border-b border-border/50 pb-2 text-[#D4AF37]">Categories</h3>
        <ul className="space-y-3">
          <li>
            <button
              onClick={() => { router.push(`/collections`); onSelect?.(); }}
              className={`text-[11px] uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${!currentCategory ? "text-[#D4AF37] font-bold" : "text-muted-foreground"}`}
            >
              All Products
            </button>
          </li>
          {CATEGORIES.map((category) => (
            <li key={category.id}>
              <button
                onClick={() => { router.push(`/collections?${createQueryString("category", category.id)}`); onSelect?.(); }}
                className={`text-[11px] uppercase tracking-widest hover:text-[#D4AF37] transition-colors ${currentCategory === category.id ? "text-[#D4AF37] font-bold" : "text-muted-foreground"}`}
              >
                {category.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Featured Filter */}
      <div>
        <h3 className="text-[11px] font-heading font-bold uppercase tracking-widest mb-4 border-b border-border/50 pb-2 text-[#D4AF37]">Collections</h3>
        <ul className="space-y-3">
          <li>
            <label className="flex items-center space-x-3 cursor-pointer group">
              <input
                type="checkbox"
                checked={isFeatured}
                onChange={(e) => {
                  router.push(`/collections?${createQueryString("featured", e.target.checked ? "true" : "")}`);
                  onSelect?.();
                }}
                className="w-4 h-4 rounded-none border-border/50 text-[#D4AF37] focus:ring-[#D4AF37] accent-[#D4AF37]"
              />
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground group-hover:text-[#D4AF37] transition-colors">Featured Edits</span>
            </label>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="text-[11px] font-heading font-bold uppercase tracking-widest mb-4 border-b border-border/50 pb-2 text-[#D4AF37]">Materials</h3>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground leading-relaxed">
          Zari silk, raw cotton, fine cashmere, and artisanal embellishments.
        </p>
      </div>
    </div>
  );
}
