import type { InputHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

export const formInputClassName =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:border-input dark:bg-input/30";

type FormLabelProps = {
  htmlFor: string;
  children: ReactNode;
  className?: string;
};

export function FormLabel({ htmlFor, children, className }: FormLabelProps) {
  return (
    <label htmlFor={htmlFor} className={cn("text-sm font-medium", className)}>
      {children}
    </label>
  );
}

type FormInputProps = InputHTMLAttributes<HTMLInputElement>;

export function FormInput({ className, ...props }: FormInputProps) {
  return <input className={cn(formInputClassName, className)} {...props} />;
}
