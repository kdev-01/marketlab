import { AuthSignUpForm } from "@/components/marketlab/auth-sign-up-form";
import { FakeMoneyChips } from "@/components/marketlab/fake-money-chips";
import { PageHeader, PageShell } from "@/components/marketlab/page-shell";
import { SupabaseSetupNotice } from "@/components/marketlab/supabase-setup-notice";
import { SurfaceCard } from "@/components/marketlab/surface-card";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function SignUpPage() {
  return (
    <PageShell width="auth">
      <div className="mx-auto space-y-8">
        <PageHeader
          eyebrow="Account"
          title="Sign up"
          subtitle="Create an account to get your fake starting balance."
          centered
        />
        <FakeMoneyChips variant="compact" className="justify-center" />

        {isSupabaseConfigured ? (
          <SurfaceCard contentClassName="py-8">
            <AuthSignUpForm />
          </SurfaceCard>
        ) : (
          <SupabaseSetupNotice />
        )}
      </div>
    </PageShell>
  );
}
