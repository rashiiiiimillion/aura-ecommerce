import { prisma } from "@/lib/prisma";
import { CouponListClient } from "@/components/features/admin/coupon-list-client";

import { serializeCoupon } from "@/lib/serializers";

export const metadata = {
  title: "Coupons | Admin | AURA",
};

export default async function AdminCouponsPage() {
  const couponsRaw = await prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });

  const coupons = couponsRaw.map(serializeCoupon);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-heading font-light tracking-tight uppercase">Coupons & Discounts</h1>
        <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mt-2">
          Manage promotional codes
        </p>
      </div>

      <CouponListClient coupons={coupons} />
    </div>
  );
}
