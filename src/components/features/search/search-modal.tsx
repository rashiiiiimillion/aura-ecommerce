"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import type { Variants } from "framer-motion";
import { Search, X, Loader2 } from "lucide-react";
import { searchProducts } from "@/actions/product";
import { SerializedProduct } from "@/types/product";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const luxeEase = [0.16, 1, 0.3, 1] as const;

const overlayVariants: Variants = {
  hidden: { opacity: 0, backdropFilter: "blur(0px)" },
  visible: { 
    opacity: 1, 
    backdropFilter: "blur(12px)",
    transition: { duration: 0.5, ease: luxeEase } 
  },
  exit: { 
    opacity: 0, 
    backdropFilter: "blur(0px)",
    transition: { duration: 0.4, ease: luxeEase } 
  }
};

const contentVariants: Variants = {
  hidden: { y: -40, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.7, delay: 0.1, ease: luxeEase } 
  },
  exit: { 
    y: -20, 
    opacity: 0,
    transition: { duration: 0.3, ease: luxeEase } 
  }
};

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
      setResults([]);
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setIsSearching(false);
        return;
      }

      setIsSearching(true);
      try {
        const response = await searchProducts(debouncedQuery);
        if ('success' in response && response.success && response.data) {
          setResults(response.data);
          setSelectedIndex(0);
        }
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleResultClick = useCallback((slug: string) => {
    onClose();
    router.push(`/product/${slug}`);
  }, [onClose, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        onClose();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((current) => results.length ? (current + 1) % results.length : 0);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((current) => results.length ? (current - 1 + results.length) % results.length : 0);
      }
      if (e.key === "Enter" && results[selectedIndex]) {
        e.preventDefault();
        handleResultClick(results[selectedIndex].slug);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex, handleResultClick]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-[100] bg-background/75 backdrop-blur-2xl flex flex-col"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.34),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.08),transparent_45%)] dark:bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.12),transparent_34%),linear-gradient(180deg,rgba(0,0,0,0.45),transparent_45%)]" />
          <motion.div variants={contentVariants} className="relative flex-1 flex flex-col">
            <div className="container mx-auto px-4 md:px-6 h-28 md:h-36 flex items-center justify-between border-b border-border/30">
              <div className="flex-1 flex items-center gap-6">
                <Search className="w-6 h-6 md:w-8 md:h-8 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products, categories..."
                  className="w-full bg-transparent text-3xl md:text-6xl font-light font-heading tracking-wide outline-none placeholder:text-muted-foreground/30 text-foreground"
                />
              </div>
              <button
                onClick={onClose}
                className="group p-3 md:p-4 hover:bg-muted/50 rounded-full transition-all duration-300 flex items-center gap-3"
                aria-label="Close search"
              >
                <span className="text-xs uppercase tracking-[0.2em] hidden md:inline-block font-medium group-hover:text-foreground/70">Close</span>
                <X className="w-6 h-6 md:w-8 md:h-8" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto container mx-auto px-4 md:px-6 py-12">
              {isSearching ? (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-6">
                  <Loader2 className="w-10 h-10 animate-spin" />
                  <p className="text-xs uppercase tracking-[0.2em]">Searching...</p>
                </div>
              ) : query.trim() === "" ? (
                <div className="flex flex-col h-full space-y-12">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.8, ease: luxeEase }}
                  >
                    <div className="flex items-center justify-between gap-6 mb-8">
                      <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium">Popular Searches</h3>
                      <p className="hidden md:block text-[10px] uppercase tracking-[0.22em] text-muted-foreground/70">Esc to close / Enter to open</p>
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {["Wool Overcoat", "Silk Dress", "Leather Tote", "Cashmere", "Oxford", "Slingback"].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-8 py-4 border border-border/40 rounded-none text-xs tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-all duration-300"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                </div>
              ) : results.length > 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-10 font-medium">
                    Results for &quot;{query}&quot; ({results.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-x-6 gap-y-12">
                    {results.map((product, idx) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.05, duration: 0.8, ease: luxeEase }}
                        onClick={() => handleResultClick(product.slug)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`group cursor-pointer flex flex-col transition-opacity ${selectedIndex === idx ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
                      >
                        <div className={`relative aspect-[3/4] bg-[#f5f5f7] dark:bg-[#111] mb-6 overflow-hidden transition-all duration-500 ${selectedIndex === idx ? "ring-1 ring-foreground/70" : "ring-1 ring-transparent"}`}>
                          <Image
                            src={product.images[0] || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-[1.2s] ease-[0.16,1,0.3,1] group-hover:scale-105"
                            sizes="(max-width: 768px) 50vw, 20vw"
                          />
                        </div>
                        <p className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground mb-2">{product.category?.name}</p>
                        <h4 className="text-xs font-semibold uppercase tracking-[0.15em] group-hover:text-muted-foreground transition-colors line-clamp-1">{product.name}</h4>
                        <p className="text-sm font-light text-foreground mt-2">${Number(product.price).toFixed(2)}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center h-64 text-center space-y-4"
                >
                  <p className="text-4xl font-light font-heading">No results found</p>
                  <p className="text-muted-foreground text-sm uppercase tracking-widest">We couldn&apos;t find anything matching &quot;{query}&quot;</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
