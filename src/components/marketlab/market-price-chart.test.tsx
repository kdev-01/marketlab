// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketPriceChart } from "@/components/marketlab/market-price-chart";
import {
  buildMockPriceHistory,
  DEFAULT_REFERENCE_NOW,
  formatYesChancePercent,
  getCurrentYesChance,
} from "@/lib/markets/price-history";

const MARKET_ID = "11111111-1111-1111-1111-111111111111";

describe("MarketPriceChart", () => {
  it("renders the current yes chance hero and chart", () => {
    const points = buildMockPriceHistory(MARKET_ID);
    const yesChance = formatYesChancePercent(getCurrentYesChance(points));

    render(
      <MarketPriceChart
        points={points}
        referenceNow={DEFAULT_REFERENCE_NOW.toISOString()}
      />,
    );

    expect(screen.getByText("Yes chance")).toBeInTheDocument();
    expect(screen.getByText(yesChance)).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Yes probability over time" }),
    ).toBeInTheDocument();
  });

  it("renders range toggle buttons", () => {
    const points = buildMockPriceHistory(MARKET_ID);

    render(
      <MarketPriceChart
        points={points}
        referenceNow={DEFAULT_REFERENCE_NOW.toISOString()}
      />,
    );

    expect(screen.getByRole("button", { name: "1D" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1W" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ALL" })).toBeInTheDocument();
  });
});
