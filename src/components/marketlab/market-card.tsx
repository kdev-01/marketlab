import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  formatCloseDate,
  formatMarketStatus,
  statusBadgeClassName,
} from "@/lib/markets/display";
import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

export type MarketListItem = Pick<
  Tables<"markets">,
  "id" | "title" | "description" | "status" | "close_date"
>;

export function MarketCard({ market }: { market: MarketListItem }) {
  const { label, variant } = formatMarketStatus(market.status);
  const closeLabel = formatCloseDate(market.close_date);

  return (
    <article className="flex h-full flex-col rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug">{market.title}</h2>
        <span
          className={cn(
            "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
            statusBadgeClassName(variant),
          )}
        >
          {label}
        </span>
      </div>
      <p className="mt-3 line-clamp-3 flex-1 text-sm text-muted-foreground">
        {market.description || "No description provided."}
      </p>
      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Closes</dt>
          <dd className="font-medium tabular-nums">{closeLabel}</dd>
        </div>
      </dl>
      <div className="mt-6">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/markets/${market.id}`}>View details</Link>
        </Button>
      </div>
    </article>
  );
}
