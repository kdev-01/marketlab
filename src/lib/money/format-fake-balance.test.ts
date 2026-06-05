import { describe, expect, it } from "vitest";

import { formatFakeBalance } from "@/lib/money/format-fake-balance";

describe("formatFakeBalance", () => {
  it("formats starting balance as dollars with fake suffix", () => {
    expect(formatFakeBalance(10000)).toBe("$100.00 fake");
  });

  it("formats smaller cent amounts", () => {
    expect(formatFakeBalance(1000)).toBe("$10.00 fake");
  });

  it("formats zero balance", () => {
    expect(formatFakeBalance(0)).toBe("$0.00 fake");
  });
});
