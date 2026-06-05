// @vitest-environment jsdom

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { ThemeProvider } from "@/components/marketlab/theme-provider";
import { ThemeToggle } from "@/components/marketlab/theme-toggle";
import { THEME_STORAGE_KEY } from "@/lib/theme";

function renderToggle() {
  return render(
    <ThemeProvider>
      <ThemeToggle />
    </ThemeProvider>,
  );
}

describe("ThemeToggle", () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove("dark");
  });

  it("renders a theme toggle button", () => {
    renderToggle();
    expect(
      screen.getByRole("button", { name: /switch to dark mode/i }),
    ).toBeInTheDocument();
  });

  it("toggles the dark class on the document element", async () => {
    const user = userEvent.setup();
    renderToggle();
    const button = screen.getByRole("button", { name: /switch to dark mode/i });
    await user.click(button);
    expect(document.documentElement).toHaveClass("dark");
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
  });
});
