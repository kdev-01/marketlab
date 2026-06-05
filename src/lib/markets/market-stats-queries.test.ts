import { beforeEach, describe, expect, it, vi } from "vitest";

import { getMarketChartData } from "@/lib/markets/market-stats-queries";

const { rpcMock, createServerSupabaseClientMock } = vi.hoisted(() => ({
  rpcMock: vi.fn(),
  createServerSupabaseClientMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: createServerSupabaseClientMock,
}));

describe("getMarketChartData", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createServerSupabaseClientMock.mockResolvedValue({ rpc: rpcMock });
  });

  it("uses ledger history when available", async () => {
    rpcMock.mockImplementation((name: string) => {
      if (name === "get_market_share_totals") {
        return {
          data: { yes_shares_cents: 200, no_shares_cents: 100 },
          error: null,
        };
      }
      return {
        data: [
          { recorded_at: "2026-06-01T00:00:00.000Z", yes_chance: 40 },
          { recorded_at: "2026-06-02T00:00:00.000Z", yes_chance: 67 },
        ],
        error: null,
      };
    });

    const result = await getMarketChartData(
      "11111111-1111-1111-1111-111111111111",
      new Date("2026-06-04T12:00:00.000Z"),
    );

    expect(result.yesChance).toBe(67);
    expect(result.priceHistory).toHaveLength(2);
  });

  it("falls back to share totals when history is empty", async () => {
    rpcMock.mockImplementation((name: string) => {
      if (name === "get_market_share_totals") {
        return {
          data: { yes_shares_cents: 75, no_shares_cents: 25 },
          error: null,
        };
      }
      return { data: [], error: null };
    });

    const referenceNow = new Date("2026-06-04T12:00:00.000Z");
    const result = await getMarketChartData(
      "11111111-1111-1111-1111-111111111111",
      referenceNow,
    );

    expect(result.yesChance).toBe(75);
    expect(result.priceHistory).toEqual([
      {
        recordedAt: referenceNow.toISOString(),
        yesChance: 75,
      },
    ]);
  });

  it("returns null yes chance when there are no trades", async () => {
    rpcMock.mockImplementation((name: string) => {
      if (name === "get_market_share_totals") {
        return {
          data: { yes_shares_cents: 0, no_shares_cents: 0 },
          error: null,
        };
      }
      return { data: [], error: null };
    });

    const result = await getMarketChartData(
      "11111111-1111-1111-1111-111111111111",
      new Date("2026-06-04T12:00:00.000Z"),
    );

    expect(result.yesChance).toBeNull();
    expect(result.priceHistory).toEqual([]);
  });
});
