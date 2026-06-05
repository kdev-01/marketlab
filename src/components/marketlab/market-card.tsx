import Link from "next/link";

import { StatusBadge } from "@/components/marketlab/status-badge";
import { SurfaceCard } from "@/components/marketlab/surface-card";
import { Button } from "@/components/ui/button";
import { formatCloseDate } from "@/lib/markets/display";
import type { Tables } from "@/lib/supabase/database.types";

export type MarketListItem = Pick<
  Tables<"markets">,
  "id" | "title" | "description" | "status" | "close_date"
>;

export function MarketCard({ market }: { market: MarketListItem }) {
  const closeLabel = formatCloseDate(market.close_date);

  return (
    <SurfaceCard
      as="article"
      hoverable
      className="flex h-full flex-col [&>div]:flex [&>div]:flex-1 [&>div]:flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug">{market.title}</h2>
        <StatusBadge status={market.status} />
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
    </SurfaceCard>
  );
}
