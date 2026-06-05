// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Header } from "@/components/marketlab/header";
import { ThemeProvider } from "@/components/marketlab/theme-provider";

vi.mock("@/components/marketlab/header-auth", () => ({
  HeaderAuth: () => (
    <div data-slot="auth" data-testid="header-auth-mock">
      Auth
    </div>
  ),
}));

function renderHeader() {
  return render(
    <ThemeProvider>
      <Header />
    </ThemeProvider>,
  );
}

describe("Header", () => {
  it("renders markets navigation and theme toggle", () => {
    renderHeader();

    expect(
      screen.getByRole("navigation", { name: "Main" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Markets" })).toHaveAttribute(
      "href",
      "/markets",
    );
    expect(screen.getByRole("link", { name: "My Positions" })).toHaveAttribute(
      "href",
      "/positions",
    );
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });

  it("renders the auth slot via HeaderAuth", () => {
    renderHeader();

    expect(screen.getByTestId("header-auth-mock")).toBeInTheDocument();
  });
});
