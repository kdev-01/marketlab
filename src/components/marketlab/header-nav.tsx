"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navLinkClass =
  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground";

export function HeaderNav() {
  const pathname = usePathname();
  const isMarkets = pathname === "/markets" || pathname.startsWith("/markets/");

  return (
    <nav aria-label="Main" className="flex items-center gap-1">
      <Link
        href="/markets"
        className={cn(
          navLinkClass,
          isMarkets && "bg-muted text-foreground font-semibold",
        )}
        aria-current={isMarkets ? "page" : undefined}
      >
        Markets
      </Link>
    </nav>
  );
}
