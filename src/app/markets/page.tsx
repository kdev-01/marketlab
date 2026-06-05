import { AlertBanner } from "@/components/marketlab/alert-banner";
import { MarketList } from "@/components/marketlab/market-list";
import { MarketsPageHeader } from "@/components/marketlab/markets-page-header";
import { PageShell } from "@/components/marketlab/page-shell";
import { SupabaseSetupNotice } from "@/components/marketlab/supabase-setup-notice";
import { listMarkets } from "@/lib/markets/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function MarketsPage() {
  if (!isSupabaseConfigured) {
    return (
      <PageShell>
        <div className="space-y-10">
          <MarketsPageHeader />
          <SupabaseSetupNotice />
        </div>
      </PageShell>
    );
  }

  const { data: markets, error } = await listMarkets();

  return (
    <PageShell>
      <div className="space-y-10">
        <MarketsPageHeader />
        {error ? (
          <AlertBanner className="px-6 py-8 text-center">
            Could not load markets. Check your Supabase connection and try
            again.
          </AlertBanner>
        ) : (
          <MarketList markets={markets ?? []} />
        )}
      </div>
    </PageShell>
  );
}
