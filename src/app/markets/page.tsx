import { MarketList } from "@/components/marketlab/market-list";
import { MarketsPageHeader } from "@/components/marketlab/markets-page-header";
import { SupabaseSetupNotice } from "@/components/marketlab/supabase-setup-notice";
import { listMarkets } from "@/lib/markets/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function MarketsPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
        <div className="space-y-10">
          <MarketsPageHeader />
          <SupabaseSetupNotice />
        </div>
      </main>
    );
  }

  const { data: markets, error } = await listMarkets();

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
      <div className="space-y-10">
        <MarketsPageHeader />
        {error ? (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-6 py-8 text-center text-sm">
            Could not load markets. Check your Supabase connection and try
            again.
          </div>
        ) : (
          <MarketList markets={markets ?? []} />
        )}
      </div>
    </main>
  );
}
