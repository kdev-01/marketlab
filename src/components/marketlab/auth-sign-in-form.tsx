"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AlertBanner } from "@/components/marketlab/alert-banner";
import { FormInput, FormLabel } from "@/components/marketlab/form-input";
import { Button } from "@/components/ui/button";
import { type AuthActionState, signInAction } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

export function AuthSignInForm() {
  const [state, formAction, isPending] = useActionState(
    signInAction,
    initialState,
  );

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <AlertBanner>{state.error}</AlertBanner> : null}

      <div className="space-y-2">
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormInput
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormInput
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in…" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        No account yet?{" "}
        <Link
          href="/signup"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  );
}
