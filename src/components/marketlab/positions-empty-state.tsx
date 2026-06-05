import Link from "next/link";

import { Button } from "@/components/ui/button";

export function PositionsEmptyState() {
  return (
    <div
      className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center"
      data-testid="positions-empty-state"
    >
      <h2 className="text-lg font-semibold">No positions yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Buy Yes or No shares in an open market to see your positions here.
      </p>
      <div className="mt-6">
        <Button asChild variant="outline">
          <Link href="/markets">Browse markets</Link>
        </Button>
      </div>
    </div>
  );
}
