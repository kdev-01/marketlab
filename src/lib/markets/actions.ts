"use server";

/**
 * Manual smoke (signed-in user, linked Supabase):
 * - Yes buy and No buy on an open market
 * - Balance decreases; position yes/no shares increase
 * - Invalid amount (e.g. 1.999) and overspend are rejected
 * - Closed/resolved market shows not buyable; signed-out shows sign-in prompt
 */

import { revalidatePath } from "next/cache";
import {
  formDataToBuyFields,
  mapBuyRpcError,
  validateBuyFormInput,
} from "@/lib/markets/buy-validation";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type BuyActionState = {
  error?: string;
  success?: boolean;
  balanceCents?: number;
  yesSharesCents?: number;
  noSharesCents?: number;
  investedCents?: number;
};

type BuyRpcResult = {
  balance_cents: number;
  yes_shares_cents: number;
  no_shares_cents: number;
  invested_cents: number;
};

export async function buyMarketSharesAction(
  _prevState: BuyActionState,
  formData: FormData,
): Promise<BuyActionState> {
  if (!isSupabaseConfigured) {
    return { error: "Supabase is not configured." };
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sign in to buy with fake money." };
  }

  const validated = validateBuyFormInput(formDataToBuyFields(formData));
  if (!validated.ok) {
    return { error: validated.error };
  }

  const { marketId, side, amountCents } = validated.data;

  const { data, error } = await supabase.rpc("buy_market_shares", {
    p_market_id: marketId,
    p_side: side,
    p_amount_cents: amountCents,
  });

  if (error) {
    return { error: mapBuyRpcError(error.message) };
  }

  const result = data as BuyRpcResult | null;
  if (!result) {
    return { error: "Something went wrong. Please try again." };
  }

  revalidatePath(`/markets/${marketId}`);
  revalidatePath("/", "layout");

  return {
    success: true,
    balanceCents: result.balance_cents,
    yesSharesCents: result.yes_shares_cents,
    noSharesCents: result.no_shares_cents,
    investedCents: result.invested_cents,
  };
}
