import { beforeEach, describe, expect, it, vi } from "vitest";

import { listPositions } from "@/lib/markets/position-queries";

const {
  createServerSupabaseClientMock,
  fromMock,
  selectMock,
  gtMock,
  orderMock,
} = vi.hoisted(() => ({
  createServerSupabaseClientMock: vi.fn(),
  fromMock: vi.fn(),
  selectMock: vi.fn(),
  gtMock: vi.fn(),
  orderMock: vi.fn(),
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: createServerSupabaseClientMock,
}));

describe("listPositions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    orderMock.mockReturnValue({
      data: [
        {
          id: "pos-1",
          yes_shares_cents: 100,
          no_shares_cents: 0,
          invested_cents: 100,
          markets: {
            id: "11111111-1111-1111-1111-111111111111",
            title: "Demo market",
            status: "open",
            close_date: "2026-06-10T00:00:00.000Z",
          },
        },
      ],
      error: null,
    });
    gtMock.mockReturnValue({ order: orderMock });
    selectMock.mockReturnValue({ gt: gtMock });
    fromMock.mockReturnValue({ select: selectMock });
    createServerSupabaseClientMock.mockResolvedValue({ from: fromMock });
  });

  it("does not accept a user_id parameter", () => {
    expect(listPositions).toHaveLength(0);
  });

  it("queries positions with market join and invested filter", async () => {
    const result = await listPositions();

    expect(fromMock).toHaveBeenCalledWith("positions");
    expect(selectMock).toHaveBeenCalledWith(
      expect.stringContaining("markets ( id, title, status, close_date )"),
    );
    expect(gtMock).toHaveBeenCalledWith("invested_cents", 0);
    expect(orderMock).toHaveBeenCalledWith("updated_at", { ascending: false });
    expect(selectMock.mock.calls[0][0]).not.toContain("user_id");
    expect(result.data).toEqual([
      {
        id: "pos-1",
        marketId: "11111111-1111-1111-1111-111111111111",
        marketTitle: "Demo market",
        marketStatus: "open",
        marketCloseDate: "2026-06-10T00:00:00.000Z",
        yesSharesCents: 100,
        noSharesCents: 0,
        investedCents: 100,
      },
    ]);
    expect(result.error).toBeNull();
  });

  it("skips rows with missing market join data", async () => {
    orderMock.mockReturnValue({
      data: [
        {
          id: "pos-1",
          yes_shares_cents: 100,
          no_shares_cents: 0,
          invested_cents: 100,
          markets: null,
        },
      ],
      error: null,
    });

    const result = await listPositions();

    expect(result.data).toEqual([]);
    expect(result.error).toBeNull();
  });

  it("returns errors from Supabase", async () => {
    const supabaseError = { message: "db error" };
    orderMock.mockReturnValue({ data: null, error: supabaseError });

    const result = await listPositions();

    expect(result.data).toBeNull();
    expect(result.error).toEqual(supabaseError);
  });
});
