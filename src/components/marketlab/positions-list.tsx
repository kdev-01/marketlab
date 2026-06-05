import { PositionCard } from "@/components/marketlab/position-card";
import { PositionsEmptyState } from "@/components/marketlab/positions-empty-state";
import type { PositionListItem } from "@/lib/markets/position-queries";

export function PositionsList({
  positions,
}: {
  positions: PositionListItem[];
}) {
  if (positions.length === 0) {
    return <PositionsEmptyState />;
  }

  return (
    <ul
      className="grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3"
      data-testid="positions-list"
    >
      {positions.map((position) => (
        <li key={position.id}>
          <PositionCard position={position} />
        </li>
      ))}
    </ul>
  );
}
