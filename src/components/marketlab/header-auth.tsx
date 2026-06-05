import { HeaderAuthControls } from "@/components/marketlab/header-auth-controls";
import { getAuthUser, getCurrentProfile } from "@/lib/auth/queries";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function HeaderAuth() {
  if (!isSupabaseConfigured) {
    return null;
  }

  const user = await getAuthUser();

  if (!user) {
    return <HeaderAuthControls isSignedIn={false} balanceCents={null} />;
  }

  const profile = await getCurrentProfile(user.id);

  return (
    <HeaderAuthControls
      isSignedIn
      balanceCents={profile?.balance_cents ?? null}
    />
  );
}
