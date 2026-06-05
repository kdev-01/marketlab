// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketDetailContent } from "@/components/marketlab/market-detail-content";
import {
  buildMockPriceHistory,
  DEFAULT_REFERENCE_NOW,
  formatYesChancePercent,
  getCurrentYesChance,
} from "@/lib/markets/price-history";

const MARKET_ID = "11111111-1111-1111-1111-111111111111";

const baseMarket = {
  id: MARKET_ID,
  title: "Demo market",
  description: "Workshop market.",
  status: "open",
  close_date: "2026-06-04T18:30:00.000Z",
};

describe("MarketDetailContent", () => {
  it("renders the chart and current yes chance", () => {
    const priceHistory = buildMockPriceHistory(MARKET_ID);
    const yesChance = formatYesChancePercent(getCurrentYesChance(priceHistory));

    render(
      <MarketDetailContent
        market={baseMarket}
        priceHistory={priceHistory}
        referenceNow={DEFAULT_REFERENCE_NOW.toISOString()}
      />,
    );

    expect(screen.getByText("Yes chance")).toBeInTheDocument();
    expect(screen.getAllByText(yesChance).length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("img", { name: "Yes probability over time" }),
    ).toBeInTheDocument();
  });

  it("shows buying unavailable for closed markets", () => {
    const priceHistory = buildMockPriceHistory(MARKET_ID);

    render(
      <MarketDetailContent
        market={{ ...baseMarket, status: "closed" }}
        priceHistory={priceHistory}
        referenceNow={DEFAULT_REFERENCE_NOW.toISOString()}
      />,
    );

    expect(screen.getByText("Buying unavailable")).toBeInTheDocument();
  });

  it("preserves existing market detail behavior", () => {
    const priceHistory = buildMockPriceHistory(MARKET_ID);

    render(
      <MarketDetailContent
        market={baseMarket}
        priceHistory={priceHistory}
        referenceNow={DEFAULT_REFERENCE_NOW.toISOString()}
      />,
    );

    expect(
      screen.getByRole("link", { name: "← Back to markets" }),
    ).toHaveAttribute("href", "/markets");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Demo market",
    );
    expect(screen.getAllByText("Open").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Closes")).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
