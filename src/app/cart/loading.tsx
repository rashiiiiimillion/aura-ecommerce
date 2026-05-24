import { Skeleton } from "@/components/ui/skeleton";

export default function CartLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <Skeleton className="h-10 w-40 mb-12" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-0 divide-y">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-6 py-8">
                <Skeleton className="w-24 h-32 md:w-32 md:h-40 shrink-0" />
                <div className="flex-1 space-y-3">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-16 mt-2" />
                  <div className="flex justify-between mt-4">
                    <Skeleton className="h-10 w-28" />
                    <Skeleton className="h-5 w-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24 border p-8 space-y-6">
              <Skeleton className="h-5 w-32" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <div className="border-t pt-4">
                <Skeleton className="h-6 w-full" />
              </div>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-4 w-32 mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
