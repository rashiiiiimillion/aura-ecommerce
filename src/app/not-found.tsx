import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-background px-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-6">404</p>
      <h1 className="text-6xl md:text-8xl font-heading font-light uppercase tracking-wide mb-4">Not Found</h1>
      <p className="text-muted-foreground mb-10 max-w-md font-light text-sm">
        The page you are looking for doesn&apos;t exist or has been moved.
      </p>
      <Link href="/">
        <Button className="rounded-none px-10 py-6 uppercase tracking-[0.2em] text-[10px] bg-foreground text-background hover:bg-foreground/90">
          Return Home
        </Button>
      </Link>
    </div>
  );
}
