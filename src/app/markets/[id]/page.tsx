import { notFound } from "next/navigation";

import { MarketDetailContent } from "@/components/marketlab/market-detail-content";
import { getMarketChartData } from "@/lib/markets/market-stats-queries";
import { getMarketById } from "@/lib/markets/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured) {
    notFound();
  }

  const { data: market, error } = await getMarketById(id);

  if (error || !market) {
    notFound();
  }

  const referenceNow = new Date();
  const { priceHistory, yesChance } = await getMarketChartData(
    market.id,
    referenceNow,
  );

  return (
    <MarketDetailContent
      market={market}
      priceHistory={priceHistory}
      yesChance={yesChance}
      referenceNow={referenceNow.toISOString()}
    />
  );
}
