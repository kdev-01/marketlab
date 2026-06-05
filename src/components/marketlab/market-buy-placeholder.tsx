import { isMarketBuyable } from "@/lib/markets/buyable";

type MarketBuyPlaceholderProps = {
  status: string;
};

export function MarketBuyPlaceholder({ status }: MarketBuyPlaceholderProps) {
  const buyable = isMarketBuyable(status);

  return (
    <section className="rounded-xl border border-border bg-card p-6 text-sm shadow-sm">
      <h2 className="font-medium">Buy</h2>
      {buyable ? (
        <p className="mt-2 text-muted-foreground">
          Buying coming in a later slice.
        </p>
      ) : (
        <p className="mt-2 text-muted-foreground">Buying unavailable</p>
      )}
    </section>
  );
}
