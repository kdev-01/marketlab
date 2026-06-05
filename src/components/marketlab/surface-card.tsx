import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/lib/utils";

type SurfaceCardProps = {
  children: ReactNode;
  title?: string;
  titleMuted?: boolean;
  className?: string;
  contentClassName?: string;
  hoverable?: boolean;
  as?: "div" | "article" | "section";
} & Omit<ComponentPropsWithoutRef<"div">, "children" | "className">;

export function SurfaceCard({
  children,
  title,
  titleMuted = false,
  className,
  contentClassName,
  hoverable = false,
  as: Component = "div",
  ...props
}: SurfaceCardProps) {
  return (
    <Component
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        hoverable && "transition-shadow hover:border-brand/20 hover:shadow-md",
        className,
      )}
      {...props}
    >
      {title ? (
        <div className="border-b border-border px-6 py-4">
          <h2
            className={cn(
              "text-sm font-medium",
              titleMuted ? "text-muted-foreground" : "text-foreground",
            )}
          >
            {title}
          </h2>
        </div>
      ) : null}
      <div className={cn("p-6", contentClassName)}>{children}</div>
    </Component>
  );
}
