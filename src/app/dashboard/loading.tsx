import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col lg:flex-row gap-12">
          <aside className="w-full lg:w-56 shrink-0">
            <div className="space-y-1">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          </aside>
          <main className="flex-1 space-y-10">
            <div>
              <Skeleton className="h-3 w-24 mb-2" />
              <Skeleton className="h-10 w-64" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="p-6 md:p-8 border border-border/50 space-y-4">
                  <Skeleton className="h-5 w-5" />
                  <Skeleton className="h-8 w-16" />
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
            <div>
              <Skeleton className="h-4 w-32 mb-6" />
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="p-6 border border-border/50 flex gap-6">
                    <div className="flex -space-x-3">
                      {[...Array(3)].map((_, j) => (
                        <Skeleton key={j} className="w-10 h-14 border-2 border-background" />
                      ))}
                    </div>
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-6 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
