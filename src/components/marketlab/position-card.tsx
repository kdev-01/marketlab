import Link from "next/link";

import { Button } from "@/components/ui/button";
import { formatFakeBalance } from "@/lib/fake-money";
import {
  formatCloseDate,
  formatMarketStatus,
  statusBadgeClassName,
} from "@/lib/markets/display";
import type { PositionListItem } from "@/lib/markets/position-queries";
import { cn } from "@/lib/utils";

export function PositionCard({ position }: { position: PositionListItem }) {
  const { label, variant } = formatMarketStatus(position.marketStatus);
  const closeLabel = formatCloseDate(position.marketCloseDate);

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug">
          <Link
            href={`/markets/${position.marketId}`}
            className="hover:underline"
          >
            {position.marketTitle}
          </Link>
        </h2>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
            statusBadgeClassName(variant),
          )}
        >
          {label}
        </span>
      </div>

      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Closes</dt>
          <dd className="font-medium tabular-nums">{closeLabel}</dd>
        </div>
      </dl>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-background/50 px-3 py-2 dark:bg-input/20">
          <dt className="text-muted-foreground">Yes shares</dt>
          <dd className="font-medium tabular-nums">
            {formatFakeBalance(position.yesSharesCents)}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-background/50 px-3 py-2 dark:bg-input/20">
          <dt className="text-muted-foreground">No shares</dt>
          <dd className="font-medium tabular-nums">
            {formatFakeBalance(position.noSharesCents)}
          </dd>
        </div>
        <div className="rounded-lg border border-border bg-background/50 px-3 py-2 dark:bg-input/20">
          <dt className="text-muted-foreground">Invested</dt>
          <dd className="font-medium tabular-nums">
            {formatFakeBalance(position.investedCents)}
          </dd>
        </div>
      </dl>

      <div className="mt-6">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/markets/${position.marketId}`}>View market</Link>
        </Button>
      </div>
    </article>
  );
}
