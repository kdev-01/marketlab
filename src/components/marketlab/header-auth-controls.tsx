"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { signOutAction } from "@/lib/auth/actions";
import { formatFakeBalance } from "@/lib/fake-money";

type HeaderAuthControlsProps = {
  isSignedIn: boolean;
  balanceCents: number | null;
};

export function HeaderAuthControls({
  isSignedIn,
  balanceCents,
}: HeaderAuthControlsProps) {
  if (!isSignedIn) {
    return (
      <div
        data-slot="auth"
        className="flex min-w-0 items-center gap-1.5 sm:gap-2"
        data-auth-state="signed-out"
      >
        <Button asChild variant="outline" size="sm">
          <Link href="/login">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/signup">Sign up</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      data-slot="auth"
      className="flex min-w-0 items-center gap-1.5 sm:gap-2"
      data-auth-state="signed-in"
    >
      <span className="rounded-md border border-brand/30 bg-brand/10 px-2 py-1 text-xs font-medium tabular-nums text-foreground sm:px-2.5">
        {balanceCents === null
          ? "Balance unavailable"
          : formatFakeBalance(balanceCents)}
      </span>
      <form action={signOutAction}>
        <Button type="submit" variant="ghost" size="sm">
          Sign out
        </Button>
      </form>
    </div>
  );
}
