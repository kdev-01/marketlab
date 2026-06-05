import { formatYesChancePercent } from "@/lib/markets/price-history";

type MarketOutcomesProps = {
  yesChance: number;
};

export function MarketOutcomes({ yesChance }: MarketOutcomesProps) {
  const noChance = 100 - Math.round(yesChance);

  return (
    <section className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <h2 className="text-sm font-medium text-muted-foreground">Outcomes</h2>
      <dl className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between gap-4">
          <dt className="font-medium">Yes</dt>
          <dd className="tabular-nums font-semibold text-emerald-700 dark:text-emerald-300">
            {formatYesChancePercent(yesChance)}
          </dd>
        </div>
        <div className="flex items-center justify-between gap-4">
          <dt className="font-medium">No</dt>
          <dd className="tabular-nums font-semibold text-rose-700 dark:text-rose-300">
            {formatYesChancePercent(noChance)}
          </dd>
        </div>
      </dl>
    </section>
  );
}
