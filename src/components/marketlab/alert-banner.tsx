import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type AlertBannerVariant = "destructive" | "success" | "info";

type AlertBannerProps = {
  children: ReactNode;
  variant?: AlertBannerVariant;
  role?: "alert" | "status";
  className?: string;
};

const variantClasses: Record<AlertBannerVariant, string> = {
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  success:
    "border-emerald-500/30 bg-emerald-500/10 text-emerald-800 dark:text-emerald-200",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-800 dark:text-sky-200",
};

export function AlertBanner({
  children,
  variant = "destructive",
  role = "alert",
  className,
}: AlertBannerProps) {
  return (
    <p
      role={role}
      className={cn(
        "rounded-lg border px-3 py-2 text-sm",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </p>
  );
}
