"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">Error</p>
      <h2 className="text-3xl md:text-5xl font-heading font-light uppercase tracking-wide mb-4">Something went wrong</h2>
      <p className="text-muted-foreground mb-10 max-w-md font-light text-sm">
        We apologize for the inconvenience. Please try again or return to the homepage.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          onClick={() => reset()}
          className="rounded-none px-10 py-6 uppercase tracking-[0.2em] text-[10px] bg-foreground text-background hover:bg-foreground/90"
        >
          Try Again
        </Button>
        <Link href="/">
          <Button
            variant="outline"
            className="rounded-none px-10 py-6 uppercase tracking-[0.2em] text-[10px]"
          >
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
