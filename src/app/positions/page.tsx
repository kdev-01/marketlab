import { PageShell } from "@/components/marketlab/page-shell";
import { PositionsPageContent } from "@/components/marketlab/positions-page-content";
import { PositionsPageHeader } from "@/components/marketlab/positions-page-header";
import { SupabaseSetupNotice } from "@/components/marketlab/supabase-setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function PositionsPage() {
  if (!isSupabaseConfigured) {
    return (
      <PageShell>
        <div className="space-y-10">
          <PositionsPageHeader />
          <SupabaseSetupNotice />
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <div className="space-y-10">
        <PositionsPageHeader />
        <PositionsPageContent />
      </div>
    </PageShell>
  );
}
