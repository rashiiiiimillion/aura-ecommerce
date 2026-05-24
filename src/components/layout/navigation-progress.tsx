"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");

      if (
        anchor &&
        anchor.href &&
        anchor.target !== "_blank" &&
        !event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        !event.altKey
      ) {
        const url = new URL(anchor.href);
        const isInternal = url.origin === window.location.origin;
        const isSamePage = url.pathname === window.location.pathname && url.search === window.location.search;

        if (isInternal && !isSamePage) {
          setLoading(true);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => document.removeEventListener("click", handleAnchorClick);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-[100] pointer-events-none"
        >
          <motion.div
            className="h-[2px] bg-foreground"
            initial={{ width: "0%" }}
            animate={{ 
              width: "90%",
              transition: { duration: 10, ease: [0.16, 1, 0.3, 1] }
            }}
            style={{
              boxShadow: "0 0 8px rgba(0,0,0,0.1)",
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
