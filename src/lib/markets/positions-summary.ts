import type { PositionListItem } from "@/lib/markets/position-queries";

export type PositionsSummary = {
  marketCount: number;
  totalInvestedCents: number;
  yesExposureCents: number;
  noExposureCents: number;
};

export function summarizePositions(
  positions: PositionListItem[],
): PositionsSummary {
  return positions.reduce(
    (acc, position) => ({
      marketCount: acc.marketCount + 1,
      totalInvestedCents: acc.totalInvestedCents + position.investedCents,
      yesExposureCents: acc.yesExposureCents + position.yesSharesCents,
      noExposureCents: acc.noExposureCents + position.noSharesCents,
    }),
    {
      marketCount: 0,
      totalInvestedCents: 0,
      yesExposureCents: 0,
      noExposureCents: 0,
    },
  );
}
