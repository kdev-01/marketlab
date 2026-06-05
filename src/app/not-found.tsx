import Link from "next/link";

import { PageShell } from "@/components/marketlab/page-shell";
import { SurfaceCard } from "@/components/marketlab/surface-card";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <PageShell width="auth">
      <SurfaceCard className="text-center" contentClassName="py-12">
        <p className="text-sm font-medium uppercase tracking-wider text-brand">
          Not found
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight">
          This page does not exist
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
          The market or page you are looking for is not in this workshop app.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button asChild>
            <Link href="/markets">Browse markets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/">Home</Link>
          </Button>
        </div>
      </SurfaceCard>
    </PageShell>
  );
}
