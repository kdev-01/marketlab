import { describe, expect, it } from "vitest";

import {
  fakeDollarsToCents,
  formatFakeBalance,
  isMarketSide,
  parseFakeDollarInput,
} from "@/lib/fake-money";

describe("formatFakeBalance", () => {
  it("formats starting balance as dollars with fake suffix", () => {
    expect(formatFakeBalance(10000)).toBe("$100.00 fake");
  });
});

describe("parseFakeDollarInput", () => {
  it("accepts whole and decimal amounts", () => {
    expect(parseFakeDollarInput("1")).toEqual({ ok: true, normalized: "1" });
    expect(parseFakeDollarInput("1.50")).toEqual({
      ok: true,
      normalized: "1.50",
    });
    expect(parseFakeDollarInput("  10.00  ")).toEqual({
      ok: true,
      normalized: "10.00",
    });
  });

  it("rejects empty, too many decimals, and non-numeric input", () => {
    expect(parseFakeDollarInput("")).toMatchObject({ ok: false });
    expect(parseFakeDollarInput("1.234")).toMatchObject({ ok: false });
    expect(parseFakeDollarInput("abc")).toMatchObject({ ok: false });
  });
});

describe("fakeDollarsToCents", () => {
  it("converts valid dollar strings to integer cents", () => {
    expect(fakeDollarsToCents("1")).toBe(100);
    expect(fakeDollarsToCents("1.50")).toBe(150);
    expect(fakeDollarsToCents("10.00")).toBe(1000);
  });

  it("rejects zero and invalid amounts", () => {
    expect(fakeDollarsToCents("0")).toBeNull();
    expect(fakeDollarsToCents("0.00")).toBeNull();
    expect(fakeDollarsToCents("1.999")).toBeNull();
  });
});

describe("isMarketSide", () => {
  it("accepts yes and no only", () => {
    expect(isMarketSide("yes")).toBe(true);
    expect(isMarketSide("no")).toBe(true);
    expect(isMarketSide("maybe")).toBe(false);
  });
});
