import { describe, expect, it } from "vitest";

import {
  formDataToBuyFields,
  mapBuyRpcError,
  validateBuyFormInput,
} from "@/lib/markets/buy-validation";

describe("validateBuyFormInput", () => {
  it("accepts valid yes and no buys", () => {
    expect(
      validateBuyFormInput({
        marketId: "11111111-1111-1111-1111-111111111111",
        side: "yes",
        amountDollars: "1.50",
      }),
    ).toEqual({
      ok: true,
      data: {
        marketId: "11111111-1111-1111-1111-111111111111",
        side: "yes",
        amountCents: 150,
      },
    });
  });

  it("rejects invalid side and amount", () => {
    expect(
      validateBuyFormInput({
        marketId: "11111111-1111-1111-1111-111111111111",
        side: "maybe",
        amountDollars: "1",
      }),
    ).toMatchObject({ ok: false });

    expect(
      validateBuyFormInput({
        marketId: "11111111-1111-1111-1111-111111111111",
        side: "no",
        amountDollars: "1.999",
      }),
    ).toMatchObject({ ok: false });
  });
});

describe("formDataToBuyFields", () => {
  it("reads market_id side and amount_dollars only", () => {
    const formData = new FormData();
    formData.set("market_id", "abc");
    formData.set("side", "yes");
    formData.set("amount_dollars", "2");
    formData.set("user_id", "spoofed");

    expect(formDataToBuyFields(formData)).toEqual({
      marketId: "abc",
      side: "yes",
      amountDollars: "2",
    });
  });
});

describe("mapBuyRpcError", () => {
  it("maps known rpc errors to friendly messages", () => {
    expect(mapBuyRpcError("not_authenticated")).toContain("Sign in");
    expect(mapBuyRpcError("insufficient_balance")).toContain(
      "enough fake balance",
    );
    expect(mapBuyRpcError("market_not_buyable")).toContain("not open");
  });
});
