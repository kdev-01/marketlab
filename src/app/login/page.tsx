import { AuthSignInForm } from "@/components/marketlab/auth-sign-in-form";
import { FakeMoneyChips } from "@/components/marketlab/fake-money-chips";
import { PageHeader, PageShell } from "@/components/marketlab/page-shell";
import { SupabaseSetupNotice } from "@/components/marketlab/supabase-setup-notice";
import { SurfaceCard } from "@/components/marketlab/surface-card";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  return (
    <PageShell width="auth">
      <div className="mx-auto space-y-8">
        <PageHeader
          eyebrow="Account"
          title="Sign in"
          subtitle="Use your email and password to access your fake-money balance."
          centered
        />
        <FakeMoneyChips variant="compact" className="justify-center" />

        {isSupabaseConfigured ? (
          <SurfaceCard contentClassName="py-8">
            <AuthSignInForm />
          </SurfaceCard>
        ) : (
          <SupabaseSetupNotice />
        )}
      </div>
    </PageShell>
  );
}
