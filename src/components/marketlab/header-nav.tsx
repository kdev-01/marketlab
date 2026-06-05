"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground";

export function HeaderNav() {
  const pathname = usePathname();
  const isMarkets = pathname === "/markets" || pathname.startsWith("/markets/");
  const isPositions = pathname === "/positions";

  return (
    <nav
      aria-label="Main"
      className="-mx-1 flex items-center gap-1 overflow-x-auto sm:mx-0"
    >
      <Link
        href="/markets"
        className={cn(
          navLinkClass,
          isMarkets &&
            "border border-brand/30 bg-brand/10 font-semibold text-foreground",
        )}
        aria-current={isMarkets ? "page" : undefined}
      >
        Markets
      </Link>
      <Link
        href="/positions"
        className={cn(
          navLinkClass,
          isPositions &&
            "border border-brand/30 bg-brand/10 font-semibold text-foreground",
        )}
        aria-current={isPositions ? "page" : undefined}
      >
        My Positions
      </Link>
    </nav>
  );
}
