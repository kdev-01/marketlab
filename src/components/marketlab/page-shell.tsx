import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type PageShellProps = {
  children: ReactNode;
  width?: "default" | "narrow" | "auth";
  className?: string;
};

const widthClasses = {
  default: "max-w-6xl",
  narrow: "max-w-3xl",
  auth: "max-w-md",
};

export function PageShell({
  children,
  width = "default",
  className,
}: PageShellProps) {
  return (
    <main
      className={cn(
        "mx-auto w-full flex-1 px-4 py-10 sm:py-14",
        widthClasses[width],
        className,
      )}
    >
      {children}
    </main>
  );
}

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  centered?: boolean;
  children?: ReactNode;
};

export function PageHeader({
  eyebrow,
  title,
  subtitle,
  centered = false,
  children,
}: PageHeaderProps) {
  return (
    <header className={cn("space-y-3", centered && "text-center")}>
      <p className="text-sm font-medium uppercase tracking-wider text-brand">
        {eyebrow}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {title}
      </h1>
      {subtitle ? (
        <p
          className={cn(
            "max-w-2xl text-base text-muted-foreground sm:text-lg",
            centered && "mx-auto",
          )}
        >
          {subtitle}
        </p>
      ) : null}
      {children}
    </header>
  );
}
