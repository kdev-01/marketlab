// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketsEmptyState } from "@/components/marketlab/markets-empty-state";

describe("MarketsEmptyState", () => {
  it("shows empty message", () => {
    render(<MarketsEmptyState />);
    expect(
      screen.getByRole("heading", { name: "No markets yet" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/task db:push/i)).toBeInTheDocument();
  });
});
