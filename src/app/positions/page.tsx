import { PositionsPageContent } from "@/components/marketlab/positions-page-content";
import { PositionsPageHeader } from "@/components/marketlab/positions-page-header";
import { SupabaseSetupNotice } from "@/components/marketlab/supabase-setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default async function PositionsPage() {
  if (!isSupabaseConfigured) {
    return (
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
        <div className="space-y-10">
          <PositionsPageHeader />
          <SupabaseSetupNotice />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
      <div className="space-y-10">
        <PositionsPageHeader />
        <PositionsPageContent />
      </div>
    </main>
  );
}
