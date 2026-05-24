"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { FaInstagram, FaFacebookF, FaXTwitter } from "react-icons/fa6";

export function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#121212] text-[#F0EBE1] pt-24 pb-12 border-t border-border/50">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-8 mb-24">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 space-y-8">
            <h2 className="text-4xl font-heading tracking-[0.25em] uppercase text-[#D4AF37]">Aura</h2>
            <p className="text-sm text-[#F0EBE1]/70 max-w-sm leading-relaxed font-light">
              Redefining Indian luxury through minimalist design, artisanal heritage, and unparalleled craftsmanship. Welcome to the new era of premium commerce.
            </p>
            <div className="flex gap-6 pt-4">
              <a href="#" className="text-[#F0EBE1]/50 hover:text-[#D4AF37] transition-colors">
                <FaInstagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#F0EBE1]/50 hover:text-[#D4AF37] transition-colors">
                <FaXTwitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-[#F0EBE1]/50 hover:text-[#D4AF37] transition-colors">
                <FaFacebookF className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#D4AF37]">
              The Edit
            </h3>
            <ul className="space-y-5 text-[13px] tracking-wide font-light">
              <li>
                <Link href="/collections?featured=true" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">New Arrivals</span>
                </Link>
              </li>
              <li>
                <Link href="/collections" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">All Collections</span>
                </Link>
              </li>
              <li>
                <Link href="/collections?category=accessories" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Fine Gifting</span>
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <h3 className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#D4AF37]">
              Concierge
            </h3>
            <ul className="space-y-5 text-[13px] tracking-wide font-light">
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Client Services</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Shipping & Returns</span>
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-[#D4AF37] transition-colors flex items-center group">
                  <span className="group-hover:translate-x-1 transition-transform">Our Heritage</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-4 space-y-8">
            <h3 className="text-[10px] font-sans tracking-[0.2em] uppercase text-[#D4AF37]">
              Join the Society
            </h3>
            <p className="text-[13px] text-[#F0EBE1]/70 font-light leading-relaxed">
              Subscribe to receive exclusive access to preview collections, private events, and editorial content.
            </p>
            <form className="flex border-b border-[#F0EBE1]/20 pb-3 group focus-within:border-[#D4AF37] transition-colors">
              <input
                type="email"
                placeholder="Email address"
                className="bg-transparent flex-1 outline-none text-sm placeholder:text-[#F0EBE1]/30 font-light"
                required
              />
              <button type="submit" className="text-[#F0EBE1]/50 hover:text-[#D4AF37] transition-colors group-hover:translate-x-1 duration-300">
                <ArrowRight className="w-5 h-5 stroke-[1]" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F0EBE1]/10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] text-[#F0EBE1]/40 uppercase tracking-[0.15em]">
          <p>&copy; {new Date().getFullYear()} MAISON AURA. All rights reserved.</p>
          <div className="flex gap-8">
            <Link href="/about" className="hover:text-[#D4AF37] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-[#D4AF37] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
