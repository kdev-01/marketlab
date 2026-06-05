import Image from "next/image";
import Link from "next/link";

import { HeaderNav } from "@/components/marketlab/header-nav";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";

export function Header() {
  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <div className="flex min-w-0 items-center gap-6">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image
              src="/logo/logo-marketlab.webp"
              alt=""
              width={677}
              height={369}
              className="h-10 w-auto object-contain dark:brightness-110"
              priority
            />
            <span className="sr-only">MarketLab</span>
            <span
              aria-hidden
              className="hidden text-lg font-semibold tracking-tight text-foreground sm:inline"
            >
              MarketLab
            </span>
          </Link>
          <HeaderNav />
        </div>
        <div className="flex items-center gap-2">
          <div data-slot="auth" className="min-w-0" />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
