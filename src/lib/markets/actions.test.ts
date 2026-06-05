import { beforeEach, describe, expect, it, vi } from "vitest";

import { buyMarketSharesAction } from "@/lib/markets/actions";

const { getUserMock, rpcMock, createServerSupabaseClientMock } = vi.hoisted(
  () => ({
    getUserMock: vi.fn(),
    rpcMock: vi.fn(),
    createServerSupabaseClientMock: vi.fn(),
  }),
);

vi.mock("@/lib/supabase/config", () => ({
  isSupabaseConfigured: true,
}));

vi.mock("@/lib/supabase/server", () => ({
  createServerSupabaseClient: createServerSupabaseClientMock,
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

describe("buyMarketSharesAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    createServerSupabaseClientMock.mockResolvedValue({
      auth: { getUser: getUserMock },
      rpc: rpcMock,
    });
  });

  it("rejects signed-out users", async () => {
    getUserMock.mockResolvedValue({ data: { user: null } });

    const result = await buyMarketSharesAction({}, new FormData());

    expect(result.error).toContain("Sign in");
    expect(rpcMock).not.toHaveBeenCalled();
  });

  it("calls rpc without user_id from form data", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { id: "user-123" } },
    });
    rpcMock.mockResolvedValue({
      data: {
        balance_cents: 9900,
        yes_shares_cents: 100,
        no_shares_cents: 0,
        invested_cents: 100,
      },
      error: null,
    });

    const formData = new FormData();
    formData.set("market_id", "11111111-1111-1111-1111-111111111111");
    formData.set("side", "yes");
    formData.set("amount_dollars", "1");
    formData.set("user_id", "attacker");

    await buyMarketSharesAction({}, formData);

    expect(rpcMock).toHaveBeenCalledWith("buy_market_shares", {
      p_market_id: "11111111-1111-1111-1111-111111111111",
      p_side: "yes",
      p_amount_cents: 100,
    });
    expect(rpcMock.mock.calls[0][1]).not.toHaveProperty("user_id");
    expect(rpcMock.mock.calls[0][1]).not.toHaveProperty("p_user_id");
  });

  it("maps insufficient balance rpc errors", async () => {
    getUserMock.mockResolvedValue({
      data: { user: { id: "user-123" } },
    });
    rpcMock.mockResolvedValue({
      data: null,
      error: { message: "insufficient_balance" },
    });

    const formData = new FormData();
    formData.set("market_id", "11111111-1111-1111-1111-111111111111");
    formData.set("side", "no");
    formData.set("amount_dollars", "9999");

    const result = await buyMarketSharesAction({}, formData);

    expect(result.error).toContain("enough fake balance");
  });
});
