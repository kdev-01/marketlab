import Link from "next/link";

import { FakeMoneyChips } from "@/components/marketlab/fake-money-chips";
import { MarketBuyForm } from "@/components/marketlab/market-buy-form";
import { SurfaceCard } from "@/components/marketlab/surface-card";
import { Button } from "@/components/ui/button";
import { getAuthUser, getCurrentProfile } from "@/lib/auth/queries";
import { isMarketBuyable } from "@/lib/markets/buyable";
import { getPositionForMarket } from "@/lib/markets/position-queries";

type MarketBuySectionProps = {
  marketId: string;
  status: string;
  closeDate: string;
  referenceNow: string;
};

function buyUnavailableMessage(
  status: string,
  closeDate: string,
  referenceNow: string,
) {
  if (status !== "open") {
    if (status === "closed") {
      return "This market is closed. Fake-money buying is not available.";
    }
    if (status === "resolved") {
      return "This market is resolved. Fake-money buying is not available.";
    }
    return "This market is not open for fake-money buys.";
  }

  if (!isMarketBuyable(status, closeDate, new Date(referenceNow))) {
    return "This market has passed its close date. Fake-money buying is not available.";
  }

  return "Fake-money buying is not available for this market.";
}

export async function MarketBuySection({
  marketId,
  status,
  closeDate,
  referenceNow,
}: MarketBuySectionProps) {
  const buyable = isMarketBuyable(status, closeDate, new Date(referenceNow));

  return (
    <SurfaceCard title="Buy with fake money">
      <FakeMoneyChips variant="compact" className="mb-4" />

      {!buyable ? (
        <p className="text-muted-foreground">
          {buyUnavailableMessage(status, closeDate, referenceNow)}
        </p>
      ) : (
        <BuyableMarketContent marketId={marketId} />
      )}
    </SurfaceCard>
  );
}

async function BuyableMarketContent({ marketId }: { marketId: string }) {
  const user = await getAuthUser();

  if (!user) {
    return (
      <div className="space-y-3">
        <p className="text-muted-foreground">
          Sign in to buy Yes or No shares with your fake-money balance.
        </p>
        <Button asChild size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    );
  }

  const profile = await getCurrentProfile(user.id);
  const position = await getPositionForMarket(user.id, marketId);

  if (!profile) {
    return (
      <p className="text-muted-foreground">
        Your fake-money balance is unavailable right now.
      </p>
    );
  }

  return (
    <MarketBuyForm
      marketId={marketId}
      balanceCents={profile.balance_cents}
      yesSharesCents={position?.yes_shares_cents ?? 0}
      noSharesCents={position?.no_shares_cents ?? 0}
      investedCents={position?.invested_cents ?? 0}
    />
  );
}
