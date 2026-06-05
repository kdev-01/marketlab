import { describe, expect, it } from "vitest";

import { isMarketBuyable } from "@/lib/markets/buyable";

describe("isMarketBuyable", () => {
  it("allows buying only for open markets", () => {
    expect(isMarketBuyable("open")).toBe(true);
    expect(isMarketBuyable("closed")).toBe(false);
    expect(isMarketBuyable("resolved")).toBe(false);
    expect(isMarketBuyable("pending")).toBe(false);
  });
});
