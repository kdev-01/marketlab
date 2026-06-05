import Link from "next/link";

import { FakeMoneyChips } from "@/components/marketlab/fake-money-chips";
import { MarketBuySection } from "@/components/marketlab/market-buy-section";
import { MarketOutcomes } from "@/components/marketlab/market-outcomes";
import { MarketPriceChart } from "@/components/marketlab/market-price-chart";
import { PageShell } from "@/components/marketlab/page-shell";
import { StatusBadge } from "@/components/marketlab/status-badge";
import { SurfaceCard } from "@/components/marketlab/surface-card";
import { Button } from "@/components/ui/button";
import { formatCloseDate, formatMarketStatus } from "@/lib/markets/display";
import type { PriceHistoryPoint } from "@/lib/markets/price-history";
import type { Tables } from "@/lib/supabase/database.types";

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
  const { label } = formatMarketStatus(market.status);

  return (
    <PageShell width="narrow">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
        <Link href="/markets">← Back to markets</Link>
      </Button>
      <article className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {market.title}
          </h1>
          <StatusBadge status={market.status} />
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">
          {market.description || "No description provided."}
        </p>
        <FakeMoneyChips variant="compact" />
        <MarketPriceChart
          points={priceHistory}
          yesChance={yesChance}
          referenceNow={referenceNow}
        />
        <MarketOutcomes yesChance={yesChance} />
        <SurfaceCard>
          <dl className="space-y-0 text-sm">
            <div className="flex justify-between gap-4 border-b border-border py-3 first:pt-0">
              <dt className="text-muted-foreground">Status</dt>
              <dd className="font-medium">{label}</dd>
            </div>
            <div className="flex justify-between gap-4 py-3 last:pb-0">
              <dt className="text-muted-foreground">Closes</dt>
              <dd className="font-medium tabular-nums">
                {formatCloseDate(market.close_date)}
              </dd>
            </div>
          </dl>
        </SurfaceCard>
        <MarketBuySection
          marketId={market.id}
          status={market.status}
          closeDate={market.close_date}
          referenceNow={referenceNow}
        />
      </article>
    </PageShell>
  );
}
