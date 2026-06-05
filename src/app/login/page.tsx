import { AuthSignInForm } from "@/components/marketlab/auth-sign-in-form";
import { SupabaseSetupNotice } from "@/components/marketlab/supabase-setup-notice";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export default function LoginPage() {
  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-md space-y-8">
        <header className="space-y-2 text-center">
          <p className="text-sm font-medium uppercase tracking-wider text-[#00d395]">
            Account
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
          <p className="text-sm text-muted-foreground">
            Use your email and password to access your fake-money balance.
          </p>
        </header>

        {isSupabaseConfigured ? (
          <div className="rounded-xl border border-border bg-card px-6 py-8 shadow-sm">
            <AuthSignInForm />
          </div>
        ) : (
          <SupabaseSetupNotice />
        )}
      </div>
    </main>
  );
}
