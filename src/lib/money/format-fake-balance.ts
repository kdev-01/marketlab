const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatFakeBalance(cents: number): string {
  const dollars = cents / 100;
  return `${currencyFormatter.format(dollars)} fake`;
}
