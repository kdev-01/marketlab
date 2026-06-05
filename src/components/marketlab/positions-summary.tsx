import { StatTile } from "@/components/marketlab/stat-tile";
import { formatFakeBalance } from "@/lib/fake-money";
import type { PositionListItem } from "@/lib/markets/position-queries";
import { summarizePositions } from "@/lib/markets/positions-summary";

type PositionsSummaryProps = {
  positions: PositionListItem[];
};

export function PositionsSummary({ positions }: PositionsSummaryProps) {
  const summary = summarizePositions(positions);

  return (
    <section
      aria-label="Portfolio summary"
      className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
      data-testid="positions-summary"
    >
      <StatTile label="Markets held" value={summary.marketCount} />
      <StatTile
        label="Total invested"
        value={formatFakeBalance(summary.totalInvestedCents)}
      />
      <StatTile
        label="Yes exposure"
        value={formatFakeBalance(summary.yesExposureCents)}
        accent="yes"
      />
      <StatTile
        label="No exposure"
        value={formatFakeBalance(summary.noExposureCents)}
        accent="no"
      />
    </section>
  );
}
