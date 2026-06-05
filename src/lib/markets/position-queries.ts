import { createServerSupabaseClient } from "@/lib/supabase/server";

export type PositionListItem = {
  id: string;
  marketId: string;
  marketTitle: string;
  marketStatus: string;
  marketCloseDate: string;
  yesSharesCents: number;
  noSharesCents: number;
  investedCents: number;
};

type PositionRow = {
  id: string;
  yes_shares_cents: number;
  no_shares_cents: number;
  invested_cents: number;
  markets: {
    id: string;
    title: string;
    status: string;
    close_date: string;
  } | null;
};

function mapPositionRow(row: PositionRow): PositionListItem | null {
  if (!row.markets) {
    return null;
  }

  return {
    id: row.id,
    marketId: row.markets.id,
    marketTitle: row.markets.title,
    marketStatus: row.markets.status,
    marketCloseDate: row.markets.close_date,
    yesSharesCents: row.yes_shares_cents,
    noSharesCents: row.no_shares_cents,
    investedCents: row.invested_cents,
  };
}

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

/**
 * Lists positions for the authenticated user. Row scoping is enforced by
 * positions_owner_read RLS (auth.uid() = user_id), not by a user_id filter here.
 */
export async function listPositions() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("positions")
    .select(
      `
      id,
      yes_shares_cents,
      no_shares_cents,
      invested_cents,
      updated_at,
      markets ( id, title, status, close_date )
    `,
    )
    .gt("invested_cents", 0)
    .order("updated_at", { ascending: false });

  if (error) {
    return { data: null, error };
  }

  const positions = (data ?? [])
    .map((row) => mapPositionRow(row as PositionRow))
    .filter((item): item is PositionListItem => item !== null);

  return { data: positions, error: null };
}
