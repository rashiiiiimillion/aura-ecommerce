import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[100dvh] w-full overflow-hidden bg-black">
        <Skeleton className="absolute inset-0" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-8">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-20 w-[500px]" />
          <Skeleton className="h-20 w-[500px]" />
          <Skeleton className="h-4 w-64 mt-4" />
          <Skeleton className="h-14 w-48 mt-6" />
        </div>
      </div>

      <div className="border-y border-border/50 overflow-hidden py-4">
        <Skeleton className="h-3 w-full" />
      </div>

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid gap-10 md:grid-cols-[0.8fr_1.2fr] md:items-end">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="mb-16">
            <Skeleton className="h-3 w-24 mb-4" />
            <Skeleton className="h-10 w-72 mb-4" />
            <Skeleton className="h-5 w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 md:h-[800px]">
            <Skeleton className="col-span-1 md:col-span-7 h-[500px] md:h-full" />
            <div className="col-span-1 md:col-span-5 grid grid-rows-2 gap-4 md:gap-6 h-[800px] md:h-full">
              <Skeleton className="h-full" />
              <div className="grid grid-cols-2 gap-4 md:gap-6 h-full">
                <Skeleton className="h-full" />
                <Skeleton className="h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
