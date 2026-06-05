// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { MarketDetailContent } from "@/components/marketlab/market-detail-content";
import {
  buildSamplePriceHistoryForTests,
  formatYesChancePercent,
} from "@/lib/markets/price-history";

vi.mock("@/components/marketlab/market-buy-section", () => ({
  MarketBuySection: ({
    status,
  }: {
    marketId: string;
    status: string;
    closeDate: string;
    referenceNow: string;
  }) => (
    <section data-testid="market-buy-section">
      {status === "open" ? (
        <p>Buy section</p>
      ) : (
        <p>This market is closed. Fake-money buying is not available.</p>
      )}
    </section>
  ),
}));

const MARKET_ID = "11111111-1111-1111-1111-111111111111";
const REFERENCE_NOW = new Date("2026-06-04T12:00:00.000Z");

const baseMarket = {
  id: MARKET_ID,
  title: "Demo market",
  description: "Workshop market.",
  status: "open",
  close_date: "2026-06-10T18:30:00.000Z",
};

describe("MarketDetailContent", () => {
  it("renders the chart and current yes chance from real props", () => {
    const priceHistory = buildSamplePriceHistoryForTests(
      MARKET_ID,
      REFERENCE_NOW,
    );
    const yesChance = priceHistory[priceHistory.length - 1].yesChance;
    const yesChanceLabel = formatYesChancePercent(yesChance);

    render(
      <MarketDetailContent
        market={baseMarket}
        priceHistory={priceHistory}
        yesChance={yesChance}
        referenceNow={REFERENCE_NOW.toISOString()}
      />,
    );

    expect(screen.getByText("Yes chance")).toBeInTheDocument();
    expect(screen.getAllByText(yesChanceLabel).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(
      screen.getByRole("img", { name: "Yes probability over time" }),
    ).toBeInTheDocument();
  });

  it("shows no-trades outcomes when yes chance is null", () => {
    render(
      <MarketDetailContent
        market={baseMarket}
        priceHistory={[]}
        yesChance={null}
        referenceNow={REFERENCE_NOW.toISOString()}
      />,
    );

    expect(screen.getByText(/No fake-money trades yet/)).toBeInTheDocument();
  });

  it("shows buying unavailable for closed markets", () => {
    const priceHistory = buildSamplePriceHistoryForTests(
      MARKET_ID,
      REFERENCE_NOW,
    );

    render(
      <MarketDetailContent
        market={{ ...baseMarket, status: "closed" }}
        priceHistory={priceHistory}
        yesChance={50}
        referenceNow={REFERENCE_NOW.toISOString()}
      />,
    );

    expect(
      screen.getByText(
        "This market is closed. Fake-money buying is not available.",
      ),
    ).toBeInTheDocument();
  });

  it("preserves existing market detail behavior", () => {
    const priceHistory = buildSamplePriceHistoryForTests(
      MARKET_ID,
      REFERENCE_NOW,
    );

    render(
      <MarketDetailContent
        market={baseMarket}
        priceHistory={priceHistory}
        yesChance={50}
        referenceNow={REFERENCE_NOW.toISOString()}
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
