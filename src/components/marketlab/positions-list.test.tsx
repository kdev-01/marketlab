// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PositionsList } from "@/components/marketlab/positions-list";
import type { PositionListItem } from "@/lib/markets/position-queries";

const marketId = "11111111-1111-1111-1111-111111111111";

const yesPosition: PositionListItem = {
  id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
  marketId,
  marketTitle: "Will it rain?",
  marketStatus: "open",
  marketCloseDate: "2026-06-10T00:00:00.000Z",
  yesSharesCents: 5000,
  noSharesCents: 0,
  investedCents: 5000,
};

const noPosition: PositionListItem = {
  id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
  marketId: "22222222-2222-2222-2222-222222222222",
  marketTitle: "Did the keynote run long?",
  marketStatus: "closed",
  marketCloseDate: "2026-05-01T00:00:00.000Z",
  yesSharesCents: 0,
  noSharesCents: 2500,
  investedCents: 3000,
};

const mixedPosition: PositionListItem = {
  id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
  marketId: "33333333-3333-3333-3333-333333333333",
  marketTitle: "Will the demo ship?",
  marketStatus: "open",
  marketCloseDate: "2026-07-01T00:00:00.000Z",
  yesSharesCents: 3000,
  noSharesCents: 2000,
  investedCents: 7500,
};

describe("PositionsList", () => {
  it("shows empty state when there are no positions", () => {
    render(<PositionsList positions={[]} />);

    expect(
      screen.getByRole("heading", { name: "No positions yet" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("positions-empty-state")).toBeInTheDocument();
  });

  it("renders Yes shares for a position", () => {
    render(<PositionsList positions={[yesPosition]} />);

    expect(screen.getByText("Will it rain?")).toBeInTheDocument();
    expect(screen.getByText("Yes shares").nextElementSibling).toHaveTextContent(
      "$50.00 fake",
    );
  });

  it("renders No shares for a position", () => {
    render(<PositionsList positions={[noPosition]} />);

    expect(screen.getByText("Did the keynote run long?")).toBeInTheDocument();
    expect(screen.getByText("No shares").nextElementSibling).toHaveTextContent(
      "$25.00 fake",
    );
  });

  it("displays invested fake amount", () => {
    render(<PositionsList positions={[mixedPosition]} />);

    expect(screen.getByText("Invested").nextElementSibling).toHaveTextContent(
      "$75.00 fake",
    );
  });

  it("links each position back to the market detail page", () => {
    render(<PositionsList positions={[yesPosition]} />);

    const viewMarketLink = screen.getByRole("link", { name: "View market" });
    expect(viewMarketLink).toHaveAttribute("href", `/markets/${marketId}`);

    const titleLink = screen.getByRole("link", { name: "Will it rain?" });
    expect(titleLink).toHaveAttribute("href", `/markets/${marketId}`);
  });
});
