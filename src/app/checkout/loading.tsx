import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-12">
          <Skeleton className="h-4 w-24" />
          <div className="text-center">
            <Skeleton className="h-8 w-32 mx-auto mb-2" />
            <Skeleton className="h-3 w-40 mx-auto" />
          </div>
          <Skeleton className="h-4 w-20 hidden md:block" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
          <div className="lg:col-span-7 space-y-8">
            <div className="flex items-center gap-8 mb-12">
              <Skeleton className="h-8 w-24" />
              <Skeleton className="h-[1px] flex-1" />
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="space-y-6">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-12 w-full" />
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
              <Skeleton className="h-14 w-full mt-8" />
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="sticky top-24 space-y-6">
              <Skeleton className="h-6 w-40 mb-6" />
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="w-16 h-20 shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/4" />
                    <Skeleton className="h-3 w-1/3 mt-2" />
                  </div>
                </div>
              ))}
              <div className="border-t pt-4 space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-6 w-full mt-4" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
