import Link from "next/link";
import { StatTile } from "@/components/marketlab/stat-tile";
import { StatusBadge } from "@/components/marketlab/status-badge";
import { SurfaceCard } from "@/components/marketlab/surface-card";
import { Button } from "@/components/ui/button";
import { formatFakeBalance } from "@/lib/fake-money";
import { formatCloseDate } from "@/lib/markets/display";
import type { PositionListItem } from "@/lib/markets/position-queries";

export function PositionCard({ position }: { position: PositionListItem }) {
  const closeLabel = formatCloseDate(position.marketCloseDate);
  const yesDominant =
    position.yesSharesCents >= position.noSharesCents &&
    position.yesSharesCents > 0;
  const noDominant =
    position.noSharesCents > position.yesSharesCents &&
    position.noSharesCents > 0;

  return (
    <SurfaceCard
      as="article"
      hoverable
      className="flex h-full flex-col [&>div]:flex [&>div]:flex-1 [&>div]:flex-col"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug">
          <Link
            href={`/markets/${position.marketId}`}
            className="hover:text-brand hover:underline"
          >
            {position.marketTitle}
          </Link>
        </h2>
        <StatusBadge status={position.marketStatus} />
      </div>

      <dl className="mt-4 space-y-1 text-sm">
        <div className="flex justify-between gap-2">
          <dt className="text-muted-foreground">Closes</dt>
          <dd className="font-medium tabular-nums">{closeLabel}</dd>
        </div>
      </dl>

      <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-3">
        <StatTile
          label="Yes shares"
          value={formatFakeBalance(position.yesSharesCents)}
          accent={yesDominant ? "yes" : "none"}
        />
        <StatTile
          label="No shares"
          value={formatFakeBalance(position.noSharesCents)}
          accent={noDominant ? "no" : "none"}
        />
        <StatTile
          label="Invested"
          value={formatFakeBalance(position.investedCents)}
        />
      </dl>

      <div className="mt-6">
        <Button asChild variant="outline" className="w-full sm:w-auto">
          <Link href={`/markets/${position.marketId}`}>View market</Link>
        </Button>
      </div>
    </SurfaceCard>
  );
}
