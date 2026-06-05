export function isMarketBuyable(
  status: string,
  closeDate: string,
  referenceNow: Date = new Date(),
): boolean {
  if (status !== "open") {
    return false;
  }

  return new Date(closeDate) > referenceNow;
}
