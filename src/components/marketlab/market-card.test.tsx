// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketCard } from "@/components/marketlab/market-card";

describe("MarketCard", () => {
  it("shows status and close date", () => {
    render(
      <MarketCard
        market={{
          id: "11111111-1111-1111-1111-111111111111",
          title: "Demo market",
          description: "Workshop market.",
          status: "closed",
          close_date: "2026-06-04T18:30:00.000Z",
        }}
      />,
    );
    expect(screen.getByText("Closed")).toBeInTheDocument();
    expect(screen.getByText("Closes")).toBeInTheDocument();
    expect(screen.getByText(/2026/)).toBeInTheDocument();
  });
});
