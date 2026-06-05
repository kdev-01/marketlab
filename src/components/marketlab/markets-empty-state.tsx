export function MarketsEmptyState() {
  return (
    <div
      className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center"
      data-testid="markets-empty-state"
    >
      <h2 className="text-lg font-semibold">No markets yet</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
        Seeded workshop markets will show up here after you run{" "}
        <code className="rounded bg-muted px-1.5 py-0.5 text-xs">
          task db:push
        </code>
        . This page works while signed in or signed out.
      </p>
    </div>
  );
}
