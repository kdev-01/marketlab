"use client";

import Link from "next/link";
import { useActionState } from "react";

import { AlertBanner } from "@/components/marketlab/alert-banner";
import { FormInput, FormLabel } from "@/components/marketlab/form-input";
import { Button } from "@/components/ui/button";
import { type AuthActionState, signUpAction } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

export function AuthSignUpForm() {
  const [state, formAction, isPending] = useActionState(
    signUpAction,
    initialState,
  );

  if (state.needsEmailConfirmation) {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-xl border border-sky-500/30 bg-sky-500/10 px-6 py-8">
          <h2 className="text-lg font-semibold">Check your email</h2>
          <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
            We sent a confirmation link to your inbox. Open it to finish
            creating your account, then sign in.
          </p>
        </div>
        <p className="text-sm text-muted-foreground">
          Already confirmed?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      {state.error ? <AlertBanner>{state.error}</AlertBanner> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <FormLabel htmlFor="first_name">First name</FormLabel>
          <FormInput
            id="first_name"
            name="first_name"
            type="text"
            autoComplete="given-name"
            required
          />
        </div>
        <div className="space-y-2">
          <FormLabel htmlFor="last_name">Last name</FormLabel>
          <FormInput
            id="last_name"
            name="last_name"
            type="text"
            autoComplete="family-name"
            required
          />
        </div>
      </div>

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
          autoComplete="new-password"
          required
          minLength={6}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Creating account…" : "Sign up"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
