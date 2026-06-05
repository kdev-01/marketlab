import Link from "next/link";

import { MarketBuySection } from "@/components/marketlab/market-buy-section";
import { MarketOutcomes } from "@/components/marketlab/market-outcomes";
import { MarketPriceChart } from "@/components/marketlab/market-price-chart";
import { Button } from "@/components/ui/button";
import {
  formatCloseDate,
  formatMarketStatus,
  statusBadgeClassName,
} from "@/lib/markets/display";
import type { PriceHistoryPoint } from "@/lib/markets/price-history";
import type { Tables } from "@/lib/supabase/database.types";
import { cn } from "@/lib/utils";

export type MarketDetailItem = Pick<
  Tables<"markets">,
  "id" | "title" | "description" | "status" | "close_date"
>;

type MarketDetailContentProps = {
  market: MarketDetailItem;
  priceHistory: PriceHistoryPoint[];
  yesChance: number | null;
  referenceNow: string;
};

export function MarketDetailContent({
  market,
  priceHistory,
  yesChance,
  referenceNow,
}: MarketDetailContentProps) {
  const { label, variant } = formatMarketStatus(market.status);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
        <Link href="/markets">← Back to markets</Link>
      </Button>
      <article className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {market.title}
          </h1>
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-medium",
              statusBadgeClassName(variant),
            )}
          >
            {label}
          </span>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">
          {market.description || "No description provided."}
        </p>
        <MarketPriceChart
          points={priceHistory}
          yesChance={yesChance}
          referenceNow={referenceNow}
        />
        <MarketOutcomes yesChance={yesChance} />
        <dl className="rounded-xl border border-border bg-card p-6 text-sm shadow-sm">
          <div className="flex justify-between gap-4 border-b border-border py-3 first:pt-0 last:border-0 last:pb-0">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">{label}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border py-3 last:border-0 last:pb-0">
            <dt className="text-muted-foreground">Closes</dt>
            <dd className="font-medium tabular-nums">
              {formatCloseDate(market.close_date)}
            </dd>
          </div>
        </dl>
        <MarketBuySection
          marketId={market.id}
          status={market.status}
          closeDate={market.close_date}
          referenceNow={referenceNow}
        />
      </article>
    </main>
  );
}
