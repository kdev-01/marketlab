import { describe, expect, it } from "vitest";

import {
  buildMockPriceHistory,
  buildSvgLinePath,
  DEFAULT_REFERENCE_NOW,
  filterPriceHistoryByRange,
  formatYesChancePercent,
  getCurrentYesChance,
} from "@/lib/markets/price-history";

const MARKET_ID = "11111111-1111-1111-1111-111111111111";

describe("buildMockPriceHistory", () => {
  it("returns a deterministic series for the same market id", () => {
    const first = buildMockPriceHistory(MARKET_ID);
    const second = buildMockPriceHistory(MARKET_ID);
    expect(first).toEqual(second);
  });

  it("returns different series for different market ids", () => {
    const first = buildMockPriceHistory(MARKET_ID);
    const second = buildMockPriceHistory(
      "22222222-2222-2222-2222-222222222222",
    );
    expect(first).not.toEqual(second);
  });

  it("keeps yes chance within bounds", () => {
    const points = buildMockPriceHistory(MARKET_ID);
    for (const point of points) {
      expect(point.yesChance).toBeGreaterThanOrEqual(5);
      expect(point.yesChance).toBeLessThanOrEqual(95);
    }
  });
});

describe("getCurrentYesChance", () => {
  it("returns the last point yes chance", () => {
    const points = buildMockPriceHistory(MARKET_ID);
    expect(getCurrentYesChance(points)).toBe(
      points[points.length - 1].yesChance,
    );
  });
});

describe("formatYesChancePercent", () => {
  it("formats rounded percent labels", () => {
    expect(formatYesChancePercent(62.4)).toBe("62%");
    expect(formatYesChancePercent(62.6)).toBe("63%");
  });
});

describe("filterPriceHistoryByRange", () => {
  it("returns all points for the all range", () => {
    const points = buildMockPriceHistory(MARKET_ID);
    expect(filterPriceHistoryByRange(points, "all")).toEqual(points);
  });

  it("narrows points for 1d and 1w ranges", () => {
    const points = buildMockPriceHistory(MARKET_ID);
    const oneDay = filterPriceHistoryByRange(
      points,
      "1d",
      DEFAULT_REFERENCE_NOW,
    );
    const oneWeek = filterPriceHistoryByRange(
      points,
      "1w",
      DEFAULT_REFERENCE_NOW,
    );

    expect(oneDay.length).toBeGreaterThan(0);
    expect(oneWeek.length).toBeGreaterThan(oneDay.length);
    expect(oneWeek.length).toBeLessThan(points.length);
  });
});

describe("buildSvgLinePath", () => {
  it("returns a stable path for a fixed fixture", () => {
    const points = buildMockPriceHistory(MARKET_ID);
    const path = buildSvgLinePath(points, { width: 400, height: 200 });
    expect(path).toMatch(/^M /);
    expect(buildSvgLinePath(points, { width: 400, height: 200 })).toBe(path);
  });
});
