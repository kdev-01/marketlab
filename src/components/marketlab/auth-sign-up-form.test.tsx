// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AuthSignUpForm } from "@/components/marketlab/auth-sign-up-form";

const { signUpAction } = vi.hoisted(() => ({
  signUpAction: vi.fn(),
}));

vi.mock("@/lib/auth/actions", () => ({
  signUpAction,
}));

describe("AuthSignUpForm", () => {
  it("renders signup fields and submit button", () => {
    render(<AuthSignUpForm />);

    expect(screen.getByLabelText("First name")).toBeInTheDocument();
    expect(screen.getByLabelText("Last name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("shows check your email state after signup without session", async () => {
    signUpAction.mockResolvedValueOnce({ needsEmailConfirmation: true });

    const user = userEvent.setup();
    render(<AuthSignUpForm />);

    await user.type(screen.getByLabelText("First name"), "Ada");
    await user.type(screen.getByLabelText("Last name"), "Lovelace");
    await user.type(screen.getByLabelText("Email"), "ada@example.com");
    await user.type(screen.getByLabelText("Password"), "secret12");
    await user.click(screen.getByRole("button", { name: "Sign up" }));

    expect(
      await screen.findByRole("heading", { name: "Check your email" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/confirmation link to your inbox/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign up" })).toBeNull();
  });
});
