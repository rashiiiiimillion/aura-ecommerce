"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  User, 
  Package, 
  MapPin, 
  Heart, 
  Settings, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { signOut } from "next-auth/react";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: User },
  { href: "/dashboard/orders", label: "Orders", icon: Package },
  { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
  { href: "/dashboard/addresses", label: "Addresses", icon: MapPin },
  { href: "/dashboard/profile", label: "Settings", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen pt-20 md:pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="mb-8 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-heading font-light uppercase tracking-wide">My Account</h1>
        </div>
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <aside className="w-full lg:w-56 shrink-0">
            <div className="lg:sticky lg:top-24">
              <nav className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
                {sidebarLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group flex items-center justify-between px-3 py-3 text-[10px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                        isActive 
                          ? "bg-foreground text-background font-semibold" 
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <link.icon className="w-4 h-4" />
                        <span className="hidden lg:inline">{link.label}</span>
                      </div>
                      <ChevronRight className={`w-3 h-3 hidden lg:block transition-transform ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}`} />
                    </Link>
                  );
                })}
              </nav>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="hidden lg:flex items-center gap-3 px-3 py-3 text-[10px] uppercase tracking-[0.2em] text-muted-foreground hover:text-red-500 transition-colors mt-4 w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          </aside>

          <main className="flex-1 min-w-0">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
