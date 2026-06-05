// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

const { buyMarketSharesActionMock } = vi.hoisted(() => ({
  buyMarketSharesActionMock: vi.fn(),
}));

vi.mock("@/lib/markets/actions", () => ({
  buyMarketSharesAction: buyMarketSharesActionMock,
}));

import { MarketBuyForm } from "@/components/marketlab/market-buy-form";

describe("MarketBuyForm", () => {
  it("renders balance, position, and buy controls", () => {
    render(
      <MarketBuyForm
        marketId="11111111-1111-1111-1111-111111111111"
        balanceCents={10000}
        yesSharesCents={100}
        noSharesCents={0}
        investedCents={100}
      />,
    );

    expect(screen.getByText(/\$100\.00 fake/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Fake dollars to spend/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Buy with fake money" }),
    ).toBeInTheDocument();
  });

  it("shows live share-cent preview when amount is valid", async () => {
    const user = userEvent.setup();

    render(
      <MarketBuyForm
        marketId="11111111-1111-1111-1111-111111111111"
        balanceCents={10000}
        yesSharesCents={100}
        noSharesCents={0}
        investedCents={100}
      />,
    );

    await user.type(screen.getByLabelText(/Fake dollars to spend/), "2.50");

    expect(screen.getByTestId("buy-preview")).toHaveTextContent(
      "Share cents to receive: $2.50 fake",
    );
  });

  it("shows success state with updated balance from action", async () => {
    buyMarketSharesActionMock.mockImplementation(
      async (
        _prev: unknown,
        formData: FormData,
      ): Promise<{
        success: boolean;
        balanceCents: number;
        yesSharesCents: number;
        noSharesCents: number;
        investedCents: number;
      }> => {
        const side = formData.get("side");
        return {
          success: true,
          balanceCents: 9900,
          yesSharesCents: side === "yes" ? 200 : 100,
          noSharesCents: side === "no" ? 100 : 0,
          investedCents: 200,
        };
      },
    );

    const user = userEvent.setup();

    render(
      <MarketBuyForm
        marketId="11111111-1111-1111-1111-111111111111"
        balanceCents={10000}
        yesSharesCents={100}
        noSharesCents={0}
        investedCents={100}
      />,
    );

    await user.clear(screen.getByLabelText(/Fake dollars to spend/));
    await user.type(screen.getByLabelText(/Fake dollars to spend/), "1");
    await user.click(
      screen.getByRole("button", { name: "Buy with fake money" }),
    );

    expect(
      await screen.findByText(/Buy recorded with fake money/),
    ).toBeInTheDocument();
    expect(screen.getByText(/\$99\.00 fake/)).toBeInTheDocument();
  });
});
