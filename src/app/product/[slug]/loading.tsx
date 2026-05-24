import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24 mb-24">
          {/* Image Gallery Skeleton */}
          <div className="flex flex-col-reverse lg:flex-row gap-4">
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible lg:w-24 shrink-0">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="aspect-[3/4] w-20 lg:w-full rounded-none" />
              ))}
            </div>
            <div className="relative aspect-[3/4] w-full">
              <Skeleton className="absolute inset-0 rounded-none" />
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="flex flex-col h-full sticky top-24">
            <Skeleton className="h-4 w-32 mb-4 rounded-none" />
            <Skeleton className="h-12 w-3/4 mb-4 rounded-none" />
            <Skeleton className="h-8 w-24 mb-6 rounded-none" />
            <div className="space-y-2 mb-8">
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-full rounded-none" />
              <Skeleton className="h-4 w-2/3 rounded-none" />
            </div>
            
            <Skeleton className="h-4 w-24 mb-3 rounded-none" />
            <div className="flex flex-wrap gap-3 mb-8">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="w-12 h-12 rounded-none" />
              ))}
            </div>

            <div className="flex gap-4 mb-8">
              <Skeleton className="h-14 flex-1 rounded-none" />
              <Skeleton className="h-14 w-14 rounded-none" />
            </div>
            
            <div className="space-y-4 py-6 border-t border-b">
              <Skeleton className="h-12 w-full rounded-none" />
              <Skeleton className="h-12 w-full rounded-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
