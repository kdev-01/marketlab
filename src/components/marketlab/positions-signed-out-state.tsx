import Link from "next/link";

import { SurfaceCard } from "@/components/marketlab/surface-card";
import { Button } from "@/components/ui/button";

export function PositionsSignedOutState() {
  return (
    <SurfaceCard>
      <h2 className="text-lg font-semibold">Sign in to view your positions</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Your Yes and No share positions are only visible when you are signed in.
      </p>
      <div className="mt-4">
        <Button asChild size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
      </div>
    </SurfaceCard>
  );
}
