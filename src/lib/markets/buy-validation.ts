import {
  fakeDollarsToCents,
  isMarketSide,
  type MarketSide,
} from "@/lib/fake-money";

export type BuyFormFields = {
  marketId: string;
  side: string;
  amountDollars: string;
};

export type ValidatedBuyInput = {
  marketId: string;
  side: MarketSide;
  amountCents: number;
};

export type BuyValidationResult =
  | { ok: true; data: ValidatedBuyInput }
  | { ok: false; error: string };

export function validateBuyFormInput(
  fields: BuyFormFields,
): BuyValidationResult {
  const marketId = fields.marketId.trim();
  if (!marketId) {
    return { ok: false, error: "Market is required." };
  }

  if (!isMarketSide(fields.side)) {
    return { ok: false, error: "Choose Yes or No." };
  }

  const amountCents = fakeDollarsToCents(fields.amountDollars);
  if (amountCents === null) {
    return {
      ok: false,
      error:
        "Enter a positive fake dollar amount with up to two decimal places.",
    };
  }

  return {
    ok: true,
    data: {
      marketId,
      side: fields.side,
      amountCents,
    },
  };
}

export function formDataToBuyFields(formData: FormData): BuyFormFields {
  return {
    marketId: String(formData.get("market_id") ?? ""),
    side: String(formData.get("side") ?? ""),
    amountDollars: String(formData.get("amount_dollars") ?? ""),
  };
}

export function mapBuyRpcError(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("not_authenticated")) {
    return "Sign in to buy with fake money.";
  }
  if (normalized.includes("invalid_amount")) {
    return "Enter a positive fake dollar amount with up to two decimal places.";
  }
  if (normalized.includes("invalid_side")) {
    return "Choose Yes or No.";
  }
  if (normalized.includes("market_not_found")) {
    return "This market could not be found.";
  }
  if (normalized.includes("market_not_buyable")) {
    return "This market is not open for fake-money buys.";
  }
  if (normalized.includes("insufficient_balance")) {
    return "You do not have enough fake balance for this buy.";
  }
  if (normalized.includes("profile_not_found")) {
    return "Your profile could not be loaded.";
  }

  return "Something went wrong. Please try again.";
}
