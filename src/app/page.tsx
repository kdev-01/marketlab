import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-2xl space-y-6 text-center">
        <p className="text-sm font-medium uppercase tracking-wider text-[#00d395]">
          Cursor workshop
        </p>
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          MarketLab is ready
        </h1>
        <p className="text-lg leading-relaxed text-muted-foreground">
          Build fake-money Yes/No prediction markets step by step. Browse seeded
          markets to see the dashboard layout, then keep shipping features from
          here.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild size="lg">
            <Link href="/markets">Browse markets</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
