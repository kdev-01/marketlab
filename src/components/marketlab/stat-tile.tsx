import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type StatTileProps = {
  label: string;
  value: ReactNode;
  accent?: "none" | "yes" | "no";
  className?: string;
};

const accentClasses = {
  none: "border-border bg-background/50 dark:bg-input/20",
  yes: "border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10",
  no: "border-rose-500/30 bg-rose-500/5 dark:bg-rose-500/10",
};

export function StatTile({
  label,
  value,
  accent = "none",
  className,
}: StatTileProps) {
  return (
    <div
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        accentClasses[accent],
        className,
      )}
    >
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}
