"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { formatFakeBalance } from "@/lib/fake-money";
import {
  type BuyActionState,
  buyMarketSharesAction,
} from "@/lib/markets/actions";
import { cn } from "@/lib/utils";

const initialState: BuyActionState = {};

const inputClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-input dark:bg-input/30";

type MarketBuyFormProps = {
  marketId: string;
  balanceCents: number;
  yesSharesCents: number;
  noSharesCents: number;
  investedCents: number;
};

export function MarketBuyForm({
  marketId,
  balanceCents,
  yesSharesCents,
  noSharesCents,
  investedCents,
}: MarketBuyFormProps) {
  const [state, formAction, isPending] = useActionState(
    buyMarketSharesAction,
    initialState,
  );

  const displayBalance = state.balanceCents ?? balanceCents;
  const displayYesShares = state.yesSharesCents ?? yesSharesCents;
  const displayNoShares = state.noSharesCents ?? noSharesCents;
  const displayInvested = state.investedCents ?? investedCents;

  return (
    <form action={formAction} className="mt-4 space-y-4">
      <input type="hidden" name="market_id" value={marketId} />

      {state.error ? (
        <p
          role="alert"
          className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p
          role="status"
          className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-800 dark:text-emerald-200"
        >
          Buy recorded with fake money. Your balance and position are updated
          below.
        </p>
      ) : null}

      <p className="text-muted-foreground">
        Available fake balance:{" "}
        <span className="font-medium text-foreground">
          {formatFakeBalance(displayBalance)}
        </span>
      </p>

      <div className="space-y-2">
        <p className="text-sm font-medium">Your position in this market</p>
        <dl className="grid gap-2 text-sm sm:grid-cols-3">
          <div className="rounded-lg border border-border bg-background/50 px-3 py-2 dark:bg-input/20">
            <dt className="text-muted-foreground">Yes shares</dt>
            <dd className="font-medium tabular-nums">
              {formatFakeBalance(displayYesShares)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-background/50 px-3 py-2 dark:bg-input/20">
            <dt className="text-muted-foreground">No shares</dt>
            <dd className="font-medium tabular-nums">
              {formatFakeBalance(displayNoShares)}
            </dd>
          </div>
          <div className="rounded-lg border border-border bg-background/50 px-3 py-2 dark:bg-input/20">
            <dt className="text-muted-foreground">Invested</dt>
            <dd className="font-medium tabular-nums">
              {formatFakeBalance(displayInvested)}
            </dd>
          </div>
        </dl>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Side</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["yes", "no"] as const).map((side) => (
            <label
              key={side}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium capitalize transition-colors has-checked:border-primary has-checked:bg-primary/10",
                "border-border bg-background dark:bg-input/30",
              )}
            >
              <input
                type="radio"
                name="side"
                value={side}
                defaultChecked={side === "yes"}
                required
                className="sr-only"
                disabled={isPending}
              />
              {side}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="space-y-2">
        <label htmlFor="amount_dollars" className="text-sm font-medium">
          Fake dollars to spend
        </label>
        <input
          id="amount_dollars"
          name="amount_dollars"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="1.00"
          required
          disabled={isPending}
          className={inputClassName}
        />
        <p className="text-xs text-muted-foreground">
          One fake cent spent buys one share cent. Not real money.
        </p>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Buying…" : "Buy with fake money"}
      </Button>
    </form>
  );
}
