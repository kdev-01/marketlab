import { describe, expect, it } from "vitest";
import type { PositionListItem } from "@/lib/markets/position-queries";
import { summarizePositions } from "@/lib/markets/positions-summary";

const samplePositions: PositionListItem[] = [
  {
    id: "pos-1",
    marketId: "market-1",
    marketTitle: "Market A",
    marketStatus: "open",
    marketCloseDate: "2026-06-04T00:00:00.000Z",
    yesSharesCents: 500,
    noSharesCents: 200,
    investedCents: 700,
  },
  {
    id: "pos-2",
    marketId: "market-2",
    marketTitle: "Market B",
    marketStatus: "open",
    marketCloseDate: "2026-06-05T00:00:00.000Z",
    yesSharesCents: 100,
    noSharesCents: 300,
    investedCents: 400,
  },
];

describe("summarizePositions", () => {
  it("returns zero totals for an empty list", () => {
    expect(summarizePositions([])).toEqual({
      marketCount: 0,
      totalInvestedCents: 0,
      yesExposureCents: 0,
      noExposureCents: 0,
    });
  });

  it("aggregates market count and exposure cents", () => {
    expect(summarizePositions(samplePositions)).toEqual({
      marketCount: 2,
      totalInvestedCents: 1100,
      yesExposureCents: 600,
      noExposureCents: 500,
    });
  });
});
