// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { MarketPriceChart } from "@/components/marketlab/market-price-chart";
import {
  buildSamplePriceHistoryForTests,
  formatYesChancePercent,
  getCurrentYesChance,
} from "@/lib/markets/price-history";

const MARKET_ID = "11111111-1111-1111-1111-111111111111";
const REFERENCE_NOW = new Date("2026-06-04T12:00:00.000Z");

describe("MarketPriceChart", () => {
  it("renders current yes chance and chart controls", () => {
    const points = buildSamplePriceHistoryForTests(MARKET_ID, REFERENCE_NOW);
    const yesChance = getCurrentYesChance(points);

    render(
      <MarketPriceChart
        points={points}
        yesChance={yesChance}
        referenceNow={REFERENCE_NOW.toISOString()}
      />,
    );

    expect(
      screen.getByText(formatYesChancePercent(yesChance ?? 0)),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1D" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1W" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ALL" })).toBeInTheDocument();
  });

  it("shows empty chart message when there is no history", () => {
    render(
      <MarketPriceChart
        points={[]}
        yesChance={null}
        referenceNow={REFERENCE_NOW.toISOString()}
      />,
    );

    expect(screen.getByText("—")).toBeInTheDocument();
    expect(
      screen.getByText(/Chart updates after the first fake-money buy/),
    ).toBeInTheDocument();
  });

  it("switches chart range buttons", async () => {
    const points = buildSamplePriceHistoryForTests(MARKET_ID, REFERENCE_NOW);
    const user = userEvent.setup();

    render(
      <MarketPriceChart
        points={points}
        yesChance={getCurrentYesChance(points)}
        referenceNow={REFERENCE_NOW.toISOString()}
      />,
    );

    await user.click(screen.getByRole("button", { name: "1D" }));
    expect(screen.getByRole("button", { name: "1D" })).toHaveClass("bg-muted");
  });
});
