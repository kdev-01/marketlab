import {
  computeYesChanceFromShareTotals,
  type MarketShareTotals,
  type PriceHistoryPoint,
  parsePriceHistoryPoints,
} from "@/lib/markets/price-history";
import { createServerSupabaseClient } from "@/lib/supabase/server";

type ShareTotalsRpc = {
  yes_shares_cents: number;
  no_shares_cents: number;
};

export async function getMarketShareTotals(
  marketId: string,
): Promise<MarketShareTotals> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_market_share_totals", {
    p_market_id: marketId,
  });

  if (error || !data) {
    return { yesSharesCents: 0, noSharesCents: 0 };
  }

  const totals = data as ShareTotalsRpc;
  return {
    yesSharesCents: totals.yes_shares_cents,
    noSharesCents: totals.no_shares_cents,
  };
}

export async function getMarketPriceHistory(
  marketId: string,
): Promise<PriceHistoryPoint[]> {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.rpc("get_market_price_history", {
    p_market_id: marketId,
  });

  if (error || !data) {
    return [];
  }

  return parsePriceHistoryPoints(data);
}

export async function getMarketChartData(marketId: string, referenceNow: Date) {
  const [totals, history] = await Promise.all([
    getMarketShareTotals(marketId),
    getMarketPriceHistory(marketId),
  ]);

  if (history.length > 0) {
    return {
      priceHistory: history,
      yesChance: history[history.length - 1].yesChance,
    };
  }

  const yesChance = computeYesChanceFromShareTotals(totals);
  if (yesChance === null) {
    return { priceHistory: [], yesChance: null };
  }

  return {
    priceHistory: [
      {
        recordedAt: referenceNow.toISOString(),
        yesChance,
      },
    ],
    yesChance,
  };
}
