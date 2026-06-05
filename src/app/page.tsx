import Link from "next/link";

import { FakeMoneyChips } from "@/components/marketlab/fake-money-chips";
import { PageHeader, PageShell } from "@/components/marketlab/page-shell";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <PageShell className="flex flex-col justify-center py-16 sm:py-24">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        <PageHeader
          eyebrow="Cursor workshop"
          title="MarketLab is ready"
          subtitle="Build fake-money Yes/No prediction markets step by step. Browse seeded markets to see the dashboard layout, then keep shipping features from here."
        />
        <FakeMoneyChips className="justify-center" />
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/markets">Browse markets</Link>
          </Button>
        </div>
      </div>
    </PageShell>
  );
}
