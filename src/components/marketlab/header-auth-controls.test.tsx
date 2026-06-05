// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { HeaderAuthControls } from "@/components/marketlab/header-auth-controls";

vi.mock("@/lib/auth/actions", () => ({
  signOutAction: vi.fn(),
}));

describe("HeaderAuthControls", () => {
  it("renders sign-in and sign-up actions when signed out", () => {
    render(<HeaderAuthControls isSignedIn={false} balanceCents={null} />);

    expect(screen.getByRole("link", { name: "Sign in" })).toHaveAttribute(
      "href",
      "/login",
    );
    expect(screen.getByRole("link", { name: "Sign up" })).toHaveAttribute(
      "href",
      "/signup",
    );
    expect(screen.queryByRole("button", { name: "Sign out" })).toBeNull();
  });

  it("renders fake balance and sign-out when signed in", () => {
    render(<HeaderAuthControls isSignedIn balanceCents={10000} />);

    expect(screen.getByText("$100.00 fake")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign out" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Sign up" })).toBeNull();
  });

  it("shows balance unavailable when profile is missing", () => {
    render(<HeaderAuthControls isSignedIn balanceCents={null} />);

    expect(screen.getByText("Balance unavailable")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Sign out" }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Sign up" })).toBeNull();
  });

  it("does not render balance inputs", () => {
    render(<HeaderAuthControls isSignedIn balanceCents={10000} />);

    expect(screen.queryByRole("textbox")).toBeNull();
    expect(screen.queryByRole("spinbutton")).toBeNull();
  });
});
