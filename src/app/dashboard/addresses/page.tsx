import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { MapPin, Star, Trash2 } from "lucide-react";
import { AddressForm } from "@/components/features/dashboard/address-form";

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-8">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-light uppercase tracking-wide">Addresses</h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">Manage your shipping addresses</p>
        </div>
        <AddressForm mode="create" />
      </div>

      {addresses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div key={address.id} className="relative p-6 border border-border/50 bg-white dark:bg-[#111] group">
              {address.isDefault && (
                <div className="absolute top-4 right-4 flex items-center gap-1 text-[9px] uppercase tracking-widest text-muted-foreground">
                  <Star className="w-3 h-3 fill-current" />
                  Default
                </div>
              )}
              <div className="space-y-1 text-sm text-muted-foreground leading-relaxed">
                <p className="text-xs font-medium text-foreground uppercase tracking-wider mb-3">{address.street}</p>
                <p>{address.city}, {address.state} {address.postalCode}</p>
                <p>{address.country}</p>
              </div>
              <div className="flex gap-2 mt-4 pt-4 border-t border-border/30">
                <AddressForm mode="edit" address={address} />
                {!address.isDefault && (
                  <button className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors">
                    <Trash2 className="w-3 h-3" />
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border border-dashed border-border/50">
          <MapPin className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-4">No addresses saved</p>
          <AddressForm mode="create" />
        </div>
      )}
    </div>
  );
}
