import { AlertBanner } from "@/components/marketlab/alert-banner";
import { PositionsList } from "@/components/marketlab/positions-list";
import { PositionsSignedOutState } from "@/components/marketlab/positions-signed-out-state";
import { getAuthUser } from "@/lib/auth/queries";
import { listPositions } from "@/lib/markets/position-queries";

export async function PositionsPageContent() {
  const user = await getAuthUser();

  if (!user) {
    return <PositionsSignedOutState />;
  }

  const { data: positions, error } = await listPositions();

  if (error) {
    return (
      <AlertBanner className="px-6 py-8 text-center">
        Could not load your positions. Check your Supabase connection and try
        again.
      </AlertBanner>
    );
  }

  return <PositionsList positions={positions ?? []} />;
}
