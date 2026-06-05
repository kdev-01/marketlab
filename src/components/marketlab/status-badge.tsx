import {
  formatMarketStatus,
  statusBadgeClassName,
} from "@/lib/markets/display";
import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
  className?: string;
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const { label, variant } = formatMarketStatus(status);

  return (
    <span
      className={cn(
        "shrink-0 rounded-full border px-2.5 py-0.5 text-xs font-medium",
        statusBadgeClassName(variant),
        className,
      )}
    >
      {label}
    </span>
  );
}
