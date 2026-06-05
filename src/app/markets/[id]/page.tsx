import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  formatCloseDate,
  formatMarketStatus,
  statusBadgeClassName,
} from "@/lib/markets/display";
import { getMarketById } from "@/lib/markets/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { cn } from "@/lib/utils";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function MarketDetailPage({ params }: PageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured) {
    notFound();
  }

  const { data: market, error } = await getMarketById(id);

  if (error || !market) {
    notFound();
  }

  const { label, variant } = formatMarketStatus(market.status);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:py-14">
      <Button asChild variant="ghost" size="sm" className="mb-8 -ml-2">
        <Link href="/markets">← Back to markets</Link>
      </Button>
      <article className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-3xl font-semibold tracking-tight">
            {market.title}
          </h1>
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-medium",
              statusBadgeClassName(variant),
            )}
          >
            {label}
          </span>
        </div>
        <p className="text-base leading-relaxed text-muted-foreground">
          {market.description || "No description provided."}
        </p>
        <dl className="rounded-xl border border-border bg-card p-6 text-sm">
          <div className="flex justify-between gap-4 border-b border-border py-3 first:pt-0 last:border-0 last:pb-0">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="font-medium">{label}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border py-3 last:border-0 last:pb-0">
            <dt className="text-muted-foreground">Closes</dt>
            <dd className="font-medium tabular-nums">
              {formatCloseDate(market.close_date)}
            </dd>
          </div>
        </dl>
        <p className="text-sm text-muted-foreground">
          Trading and positions are not available on this page yet.
        </p>
      </article>
    </main>
  );
}
