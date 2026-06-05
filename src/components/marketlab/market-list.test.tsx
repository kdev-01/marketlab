// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { MarketListItem } from "@/components/marketlab/market-card";
import { MarketList } from "@/components/marketlab/market-list";

const markets: MarketListItem[] = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    title: "Will it rain?",
    description: "A weather market.",
    status: "open",
    close_date: "2026-06-10T00:00:00.000Z",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    title: "Did the keynote run long?",
    description: "Resolved example.",
    status: "resolved",
    close_date: "2026-05-01T00:00:00.000Z",
  },
];

describe("MarketList", () => {
  it("renders a card per market", () => {
    render(<MarketList markets={markets} />);
    expect(screen.getByText("Will it rain?")).toBeInTheDocument();
    expect(screen.getByText("Did the keynote run long?")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "View details" })).toHaveLength(
      2,
    );
  });

  it("shows empty state when there are no markets", () => {
    render(<MarketList markets={[]} />);
    expect(
      screen.getByRole("heading", { name: "No markets yet" }),
    ).toBeInTheDocument();
  });
});
