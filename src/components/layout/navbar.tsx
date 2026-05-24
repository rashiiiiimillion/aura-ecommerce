"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { ShoppingBag, Search, Menu, User, Moon, Sun, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useUIStore } from "@/store/useUIStore";
import { useHydrated } from "@/store/useStore";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet";
import { CartDrawer } from "@/components/features/cart/cart-drawer";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

const SearchModal = dynamic(
  () => import("@/components/features/search/search-modal").then((mod) => mod.SearchModal),
  { loading: () => null }
);

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const isHydrated = useHydrated();
  const cartCount = useCartStore((state) => state.getCartCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const setCartOpen = useUIStore((state) => state.setCartOpen);
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 50);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-700 ease-out ${
          isScrolled ? "bg-background/95 backdrop-blur-2xl border-b border-border/40 shadow-sm py-2" : "bg-gradient-to-b from-black/5 to-transparent dark:from-white/5 py-6"
        }`}
      >
        <div className="container mx-auto px-6 grid grid-cols-3 items-center">
          <div className="flex items-center gap-4">
            <div className="lg:hidden">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors hover:text-[#D4AF37] h-9 w-9" aria-label="Menu">
                  <Menu className="w-6 h-6 stroke-[1.5]" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] sm:w-[350px] border-r-0 shadow-2xl p-0">
                  <div className="bg-background h-full flex flex-col">
                    <SheetHeader className="p-6 border-b border-border/50 bg-muted/30">
                      <SheetTitle className="text-left text-3xl font-heading tracking-widest uppercase">
                        Aura
                      </SheetTitle>
                    </SheetHeader>
                    <nav className="flex-1 overflow-y-auto px-6 py-8 flex flex-col gap-8 text-sm uppercase tracking-[0.15em] font-medium">
                      <div className="space-y-6">
                        <h4 className="text-[10px] text-muted-foreground tracking-widest font-bold mb-4">Discover</h4>
                        <Link href="/collections" prefetch className="block hover:text-[#D4AF37] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          All Collections
                        </Link>
                        <Link href="/collections?featured=true" prefetch className="block hover:text-[#D4AF37] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          The Festive Edit
                        </Link>
                        <Link href="/collections?category=wedding" prefetch className="block hover:text-[#D4AF37] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Wedding Trousseau
                        </Link>
                      </div>
                      
                      <div className="h-px w-full bg-border/50" />
                      
                      <div className="space-y-6">
                        <Link href="/about" prefetch className="block hover:text-[#D4AF37] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Maison AURA
                        </Link>
                        <Link href="/contact" prefetch className="block hover:text-[#D4AF37] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          Client Services
                        </Link>
                      </div>
                    </nav>
                    <div className="p-6 border-t border-border/50 bg-muted/20 space-y-4">
                      {session ? (
                        <>
                          <Link href="/dashboard" prefetch className="flex items-center gap-3 text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                            <User className="w-4 h-4" /> My Account
                          </Link>
                          <button onClick={() => { signOut({ callbackUrl: "/" }); setMobileMenuOpen(false); }} className="text-left text-[10px] text-muted-foreground uppercase tracking-widest hover:text-foreground transition-colors w-full">
                            Sign Out
                          </button>
                        </>
                      ) : (
                        <Link href="/login" prefetch className="flex items-center gap-3 text-sm uppercase tracking-widest hover:text-[#D4AF37] transition-colors" onClick={() => setMobileMenuOpen(false)}>
                          <User className="w-4 h-4" /> Sign In / Register
                        </Link>
                      )}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
            <nav className="hidden lg:flex items-center gap-10 text-[11px] font-semibold tracking-[0.15em] uppercase">
              <div className="group relative py-4">
                <Link href="/collections" prefetch className="hover:text-[#D4AF37] transition-colors">
                  Collections
                </Link>
                {/* Luxury Mega Menu */}
                <div className="absolute top-[100%] left-0 w-[600px] bg-background/98 backdrop-blur-2xl border border-border/50 shadow-2xl opacity-0 -translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ease-out grid grid-cols-2 p-10 gap-10 rounded-sm">
                  <div className="space-y-5">
                    <h4 className="font-heading text-lg text-muted-foreground capitalize tracking-normal">Curated Edits</h4>
                    <ul className="space-y-4 text-[10px] tracking-widest">
                      <li><Link href="/collections?featured=true" className="hover:text-[#D4AF37] hover:translate-x-1 inline-block transition-transform">The Festive Edit</Link></li>
                      <li><Link href="/collections?category=wedding" className="hover:text-[#D4AF37] hover:translate-x-1 inline-block transition-transform">Wedding Trousseau</Link></li>
                      <li><Link href="/collections" className="hover:text-[#D4AF37] hover:translate-x-1 inline-block transition-transform">New Arrivals</Link></li>
                    </ul>
                  </div>
                  <div className="space-y-5 border-l border-border/50 pl-10">
                    <h4 className="font-heading text-lg text-muted-foreground capitalize tracking-normal">Categories</h4>
                    <ul className="space-y-4 text-[10px] tracking-widest">
                      <li><Link href="/collections?category=mens" className="hover:text-[#D4AF37] hover:translate-x-1 inline-block transition-transform">Men's Pret</Link></li>
                      <li><Link href="/collections?category=womens" className="hover:text-[#D4AF37] hover:translate-x-1 inline-block transition-transform">Women's Couture</Link></li>
                      <li><Link href="/collections?category=accessories" className="hover:text-[#D4AF37] hover:translate-x-1 inline-block transition-transform">Fine Accessories</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
              <Link href="/about" prefetch className="hover:text-[#D4AF37] transition-colors py-4">
                Maison
              </Link>
            </nav>
          </div>

          <Link
            href="/"
            className="text-3xl md:text-4xl font-heading tracking-[0.2em] uppercase justify-self-center hover:scale-[1.02] transition-transform duration-500 ease-out"
          >
            Aura
          </Link>

          <div className="flex items-center gap-2 md:gap-4 justify-self-end">
            <button 
              className="hover:text-[#D4AF37] transition-colors p-2" 
              aria-label="Search" 
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="w-5 h-5 stroke-[1.5]" />
            </button>
            {session ? (
              <Link href="/dashboard" className="hidden md:block hover:text-[#D4AF37] transition-colors p-2">
                <User className="w-5 h-5 stroke-[1.5]" />
              </Link>
            ) : (
              <Link href="/login" className="hidden md:block hover:text-[#D4AF37] transition-colors p-2">
                <User className="w-5 h-5 stroke-[1.5]" />
              </Link>
            )}
            <Link href="/wishlist" prefetch className="hover:text-[#D4AF37] transition-colors p-2 relative">
              <Heart className="w-5 h-5 stroke-[1.5]" />
              <AnimatePresence>
                {isHydrated && wishlistCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#D4AF37] text-background text-[9px] font-bold flex items-center justify-center rounded-full"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            <button 
              onClick={() => setCartOpen(true)} 
              className="hover:text-[#D4AF37] transition-colors p-2 relative" 
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <AnimatePresence>
                {isHydrated && cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="absolute top-1 right-1 w-3.5 h-3.5 bg-[#D4AF37] text-background text-[9px] font-bold flex items-center justify-center rounded-full"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle Theme"
                className="hidden md:block hover:text-[#D4AF37] transition-colors p-2 ml-2 border-l border-border/50"
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4 stroke-[1.5]" />
                ) : (
                  <Moon className="w-4 h-4 stroke-[1.5]" />
                )}
              </button>
            )}
          </div>
        </div>
      </header>
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}
