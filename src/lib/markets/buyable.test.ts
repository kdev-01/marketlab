import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "@/lib/markets/buyable";

const referenceNow = new Date("2026-06-04T12:00:00.000Z");

describe("isMarketBuyable", () => {
  it("allows buying only for open markets before close date", () => {
    expect(
      isMarketBuyable("open", "2026-06-10T00:00:00.000Z", referenceNow),
    ).toBe(true);
    expect(
      isMarketBuyable("open", "2026-06-01T00:00:00.000Z", referenceNow),
    ).toBe(false);
    expect(
      isMarketBuyable("closed", "2026-06-10T00:00:00.000Z", referenceNow),
    ).toBe(false);
    expect(
      isMarketBuyable("resolved", "2026-06-10T00:00:00.000Z", referenceNow),
    ).toBe(false);
    expect(
      isMarketBuyable("draft", "2026-06-10T00:00:00.000Z", referenceNow),
    ).toBe(false);
    expect(
      isMarketBuyable("pending", "2026-06-10T00:00:00.000Z", referenceNow),
    ).toBe(false);
  });
});
