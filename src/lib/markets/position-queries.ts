import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getPositionForMarket(userId: string, marketId: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select("yes_shares_cents, no_shares_cents, invested_cents")
    .eq("user_id", userId)
    .eq("market_id", marketId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data;
}
