"use client";

import { useActionState, useState } from "react";

import { AlertBanner } from "@/components/marketlab/alert-banner";
import { FormInput, FormLabel } from "@/components/marketlab/form-input";
import { StatTile } from "@/components/marketlab/stat-tile";
import { Button } from "@/components/ui/button";
import {
  fakeDollarsToCents,
  formatFakeBalance,
  type MarketSide,
} from "@/lib/fake-money";
import {
  type BuyActionState,
  buyMarketSharesAction,
} from "@/lib/markets/actions";
import { cn } from "@/lib/utils";

const initialState: BuyActionState = {};

type MarketBuyFormProps = {
  marketId: string;
  balanceCents: number;
  yesSharesCents: number;
  noSharesCents: number;
  investedCents: number;
};

const sideStyles: Record<MarketSide, { active: string; idle: string }> = {
  yes: {
    active:
      "border-emerald-500/50 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
    idle: "border-border bg-background dark:bg-input/30",
  },
  no: {
    active:
      "border-rose-500/50 bg-rose-500/10 text-rose-800 dark:text-rose-200",
    idle: "border-border bg-background dark:bg-input/30",
  },
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
  const [selectedSide, setSelectedSide] = useState<MarketSide>("yes");
  const [amountDollars, setAmountDollars] = useState("");

  const displayBalance = state.balanceCents ?? balanceCents;
  const displayYesShares = state.yesSharesCents ?? yesSharesCents;
  const displayNoShares = state.noSharesCents ?? noSharesCents;
  const displayInvested = state.investedCents ?? investedCents;

  const previewCents = fakeDollarsToCents(amountDollars);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="market_id" value={marketId} />

      {state.error ? <AlertBanner>{state.error}</AlertBanner> : null}

      {state.success ? (
        <AlertBanner variant="success" role="status">
          Buy recorded with fake money. Your balance and position are updated
          below.
        </AlertBanner>
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
          <StatTile
            label="Yes shares"
            value={formatFakeBalance(displayYesShares)}
            accent="yes"
          />
          <StatTile
            label="No shares"
            value={formatFakeBalance(displayNoShares)}
            accent="no"
          />
          <StatTile
            label="Invested"
            value={formatFakeBalance(displayInvested)}
          />
        </dl>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Side</legend>
        <div className="grid grid-cols-2 gap-2">
          {(["yes", "no"] as const).map((side) => (
            <label
              key={side}
              className={cn(
                "flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2.5 text-sm font-medium capitalize transition-colors",
                selectedSide === side
                  ? sideStyles[side].active
                  : sideStyles[side].idle,
              )}
            >
              <input
                type="radio"
                name="side"
                value={side}
                checked={selectedSide === side}
                onChange={() => setSelectedSide(side)}
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
        <FormLabel htmlFor="amount_dollars">Fake dollars to spend</FormLabel>
        <FormInput
          id="amount_dollars"
          name="amount_dollars"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="1.00"
          required
          disabled={isPending}
          value={amountDollars}
          onChange={(event) => setAmountDollars(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">
          One fake cent spent buys one share cent. Not real money.
        </p>
        {previewCents !== null ? (
          <p
            className="text-sm text-muted-foreground"
            data-testid="buy-preview"
          >
            Share cents to receive:{" "}
            <span className="font-medium text-foreground">
              {formatFakeBalance(previewCents)}
            </span>
          </p>
        ) : null}
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Buying…" : "Buy with fake money"}
      </Button>
    </form>
  );
}
