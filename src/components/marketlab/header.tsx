import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";

import { HeaderAuth } from "@/components/marketlab/header-auth";
import { HeaderNav } from "@/components/marketlab/header-nav";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-6xl px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <Link href="/" className="flex shrink-0 items-center gap-2.5">
            <Image
              src="/logo/iso-marketlab.webp"
              alt=""
              width={64}
              height={64}
              className="h-9 w-9 object-contain sm:hidden dark:brightness-110"
              priority
            />
            <Image
              src="/logo/logo-marketlab.webp"
              alt=""
              width={677}
              height={369}
              className="hidden h-9 w-auto object-contain sm:block dark:brightness-110"
              priority
            />
            <span className="sr-only">MarketLab</span>
            <span
              aria-hidden
              className="hidden text-lg font-semibold tracking-tight text-foreground md:inline"
            >
              MarketLab
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Suspense
              fallback={
                <div
                  data-slot="auth"
                  className="h-7 w-28 animate-pulse rounded-md bg-muted"
                  aria-hidden
                />
              }
            >
              <HeaderAuth />
            </Suspense>
            <ThemeToggle />
          </div>
        </div>
        <div className="mt-2 border-t border-border/60 pt-2 sm:mt-3">
          <HeaderNav />
        </div>
      </div>
    </header>
  );
}
