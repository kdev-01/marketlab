export function SupabaseSetupNotice() {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-6 py-8 text-center">
      <h2 className="text-lg font-semibold">Supabase is not configured</h2>
      <p className="mx-auto mt-2 max-w-lg text-sm text-muted-foreground">
        Add your Supabase URL and publishable key to the environment, then run{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          task db:push
        </code>{" "}
        to load seeded markets.
      </p>
    </div>
  );
}
