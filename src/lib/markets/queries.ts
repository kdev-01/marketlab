import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function listMarkets() {
  const supabase = await createServerSupabaseClient();
  return supabase
    .from("markets")
    .select("id, title, description, status, close_date")
    .order("close_date", { ascending: true });
}

export async function getMarketById(id: string) {
  const supabase = await createServerSupabaseClient();
  return supabase
    .from("markets")
    .select("id, title, description, status, close_date")
    .eq("id", id)
    .maybeSingle();
}
