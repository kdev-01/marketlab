const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export type MarketSide = "yes" | "no";

export const MARKET_SIDES: MarketSide[] = ["yes", "no"];

export function formatFakeBalance(cents: number): string {
  const dollars = cents / 100;
  return `${currencyFormatter.format(dollars)} fake`;
}

export type ParseFakeDollarResult =
  | { ok: true; normalized: string }
  | { ok: false; error: string };

export function parseFakeDollarInput(raw: string): ParseFakeDollarResult {
  const trimmed = raw.trim();

  if (!trimmed) {
    return { ok: false, error: "Enter a fake dollar amount." };
  }

  if (!/^\d+(\.\d{1,2})?$/.test(trimmed)) {
    return {
      ok: false,
      error: "Use a valid amount with up to two decimal places.",
    };
  }

  return { ok: true, normalized: trimmed };
}

export function fakeDollarsToCents(dollars: string): number | null {
  const parsed = parseFakeDollarInput(dollars);
  if (!parsed.ok) {
    return null;
  }

  const [wholePart, fractionPart = ""] = parsed.normalized.split(".");
  const whole = Number.parseInt(wholePart, 10);
  const fraction = fractionPart.padEnd(2, "0");
  const fracCents = fraction.length > 0 ? Number.parseInt(fraction, 10) : 0;
  const cents = whole * 100 + fracCents;

  if (cents <= 0) {
    return null;
  }

  return cents;
}

export function isMarketSide(value: string): value is MarketSide {
  return value === "yes" || value === "no";
}
