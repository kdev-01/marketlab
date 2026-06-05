import { SurfaceCard } from "@/components/marketlab/surface-card";
import { formatYesChancePercent } from "@/lib/markets/price-history";
import { cn } from "@/lib/utils";

type MarketOutcomesProps = {
  yesChance: number | null;
};

export function MarketOutcomes({ yesChance }: MarketOutcomesProps) {
  if (yesChance === null) {
    return (
      <SurfaceCard title="Outcomes" titleMuted>
        <p className="text-sm text-muted-foreground">
          No fake-money trades yet. Yes and No shares will appear here after the
          first buy.
        </p>
      </SurfaceCard>
    );
  }

  const noChance = 100 - Math.round(yesChance);

  return (
    <SurfaceCard title="Outcomes" titleMuted>
      <p className="text-xs text-muted-foreground">
        Based on total Yes and No shares from real workshop buys.
      </p>
      <div className="mt-4 space-y-4">
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-emerald-700 dark:text-emerald-300">
              Yes
            </span>
            <span className="tabular-nums font-semibold text-emerald-700 dark:text-emerald-300">
              {formatYesChancePercent(yesChance)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-emerald-500/70"
              style={{ width: `${yesChance}%` }}
            />
          </div>
        </div>
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="font-medium text-rose-700 dark:text-rose-300">
              No
            </span>
            <span
              className={cn(
                "tabular-nums font-semibold text-rose-700 dark:text-rose-300",
              )}
            >
              {formatYesChancePercent(noChance)}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-rose-500/70"
              style={{ width: `${noChance}%` }}
            />
          </div>
        </div>
      </div>
    </SurfaceCard>
  );
}
