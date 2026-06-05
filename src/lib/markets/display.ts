export type MarketStatus = "open" | "closed" | "resolved";

export type StatusBadgeVariant = "open" | "closed" | "resolved" | "unknown";

const STATUS_LABELS: Record<MarketStatus, string> = {
  open: "Open",
  closed: "Closed",
  resolved: "Resolved",
};

export function formatMarketStatus(status: string): {
  label: string;
  variant: StatusBadgeVariant;
} {
  if (status === "open" || status === "closed" || status === "resolved") {
    return { label: STATUS_LABELS[status], variant: status };
  }
  return { label: status, variant: "unknown" };
}

export function formatCloseDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return iso;
  }
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function statusBadgeClassName(variant: StatusBadgeVariant): string {
  switch (variant) {
    case "open":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300";
    case "closed":
      return "border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300";
    case "resolved":
      return "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-300";
    default:
      return "border-border bg-muted text-muted-foreground";
  }
}
