import { describe, expect, it } from "vitest";

import {
  buildSamplePriceHistoryForTests,
  computeYesChanceFromShareTotals,
  filterPriceHistoryByRange,
  formatYesChancePercent,
  getCurrentYesChance,
  parsePriceHistoryPoints,
} from "@/lib/markets/price-history";

const MARKET_ID = "11111111-1111-1111-1111-111111111111";
const REFERENCE_NOW = new Date("2026-06-04T12:00:00.000Z");

describe("parsePriceHistoryPoints", () => {
  it("parses rpc price history arrays", () => {
    expect(
      parsePriceHistoryPoints([
        { recorded_at: "2026-06-01T00:00:00.000Z", yes_chance: 42 },
        { recorded_at: "2026-06-02T00:00:00.000Z", yes_chance: 55 },
      ]),
    ).toEqual([
      { recordedAt: "2026-06-01T00:00:00.000Z", yesChance: 42 },
      { recordedAt: "2026-06-02T00:00:00.000Z", yesChance: 55 },
    ]);
  });

  it("returns empty array for invalid payloads", () => {
    expect(parsePriceHistoryPoints(null)).toEqual([]);
    expect(parsePriceHistoryPoints([{ bad: true }])).toEqual([]);
  });
});

describe("computeYesChanceFromShareTotals", () => {
  it("derives yes chance from aggregated share cents", () => {
    expect(
      computeYesChanceFromShareTotals({
        yesSharesCents: 300,
        noSharesCents: 100,
      }),
    ).toBe(75);
    expect(
      computeYesChanceFromShareTotals({
        yesSharesCents: 0,
        noSharesCents: 0,
      }),
    ).toBeNull();
  });
});

describe("buildSamplePriceHistoryForTests", () => {
  it("returns deterministic sample points for tests", () => {
    const first = buildSamplePriceHistoryForTests(MARKET_ID, REFERENCE_NOW);
    const second = buildSamplePriceHistoryForTests(MARKET_ID, REFERENCE_NOW);

    expect(first).toEqual(second);
    expect(first.length).toBeGreaterThan(1);
  });
});

describe("getCurrentYesChance", () => {
  it("returns the latest point yes chance", () => {
    const points = buildSamplePriceHistoryForTests(MARKET_ID, REFERENCE_NOW);
    expect(getCurrentYesChance(points)).toBe(
      points[points.length - 1].yesChance,
    );
  });

  it("returns null when history is empty", () => {
    expect(getCurrentYesChance([])).toBeNull();
  });
});

describe("filterPriceHistoryByRange", () => {
  it("filters points by range relative to reference now", () => {
    const points = buildSamplePriceHistoryForTests(MARKET_ID, REFERENCE_NOW);
    const filtered = filterPriceHistoryByRange(points, "1w", REFERENCE_NOW);

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.length).toBeLessThanOrEqual(points.length);
  });
});

describe("formatYesChancePercent", () => {
  it("formats rounded percent labels", () => {
    expect(formatYesChancePercent(42.4)).toBe("42%");
  });
});
