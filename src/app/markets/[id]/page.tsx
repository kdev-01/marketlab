import { notFound } from "next/navigation";

import { MarketDetailContent } from "@/components/marketlab/market-detail-content";
import {
  buildMockPriceHistory,
  DEFAULT_REFERENCE_NOW,
} from "@/lib/markets/price-history";
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

  const priceHistory = buildMockPriceHistory(market.id, {
    referenceNow: DEFAULT_REFERENCE_NOW,
  });

  return (
    <MarketDetailContent
      market={market}
      priceHistory={priceHistory}
      referenceNow={DEFAULT_REFERENCE_NOW.toISOString()}
    />
  );
}
