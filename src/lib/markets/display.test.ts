import { describe, expect, it } from "vitest";

import { formatCloseDate, formatMarketStatus } from "@/lib/markets/display";

describe("formatMarketStatus", () => {
  it("labels known statuses", () => {
    expect(formatMarketStatus("open")).toEqual({
      label: "Open",
      variant: "open",
    });
    expect(formatMarketStatus("closed")).toEqual({
      label: "Closed",
      variant: "closed",
    });
    expect(formatMarketStatus("resolved")).toEqual({
      label: "Resolved",
      variant: "resolved",
    });
  });

  it("falls back for unknown statuses", () => {
    expect(formatMarketStatus("pending")).toEqual({
      label: "pending",
      variant: "unknown",
    });
  });
});

describe("formatCloseDate", () => {
  it("formats a valid ISO timestamp", () => {
    const formatted = formatCloseDate("2026-06-04T12:00:00.000Z");
    expect(formatted).toContain("2026");
  });

  it("returns the raw value when parsing fails", () => {
    expect(formatCloseDate("not-a-date")).toBe("not-a-date");
  });
});
