import { Skeleton } from "@/components/ui/skeleton";

export default function CollectionsLoading() {
  return (
    <div className="min-h-screen pt-24 pb-16 bg-background">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center mb-12 text-center space-y-4">
          <Skeleton className="h-16 w-64 md:w-96 rounded-none" />
          <Skeleton className="h-6 w-full max-w-xl rounded-none" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
            <div>
              <Skeleton className="h-4 w-24 mb-4 rounded-none" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-32 rounded-none" />
                <Skeleton className="h-4 w-28 rounded-none" />
                <Skeleton className="h-4 w-36 rounded-none" />
              </div>
            </div>
            <div>
              <Skeleton className="h-4 w-24 mb-4 rounded-none" />
              <Skeleton className="h-4 w-40 rounded-none" />
            </div>
          </aside>
          
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <Skeleton className="h-4 w-20 rounded-none" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-4">
                  <Skeleton className="aspect-[3/4] w-full rounded-none" />
                  <Skeleton className="h-4 w-3/4 rounded-none" />
                  <Skeleton className="h-4 w-1/4 rounded-none" />
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
