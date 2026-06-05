// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { PositionsSignedOutState } from "@/components/marketlab/positions-signed-out-state";

describe("PositionsSignedOutState", () => {
  it("shows a sign-in message and link", () => {
    render(<PositionsSignedOutState />);

    expect(
      screen.getByRole("heading", { name: "Sign in to view your positions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Your Yes and No share positions are only visible when you are signed in.",
      ),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
