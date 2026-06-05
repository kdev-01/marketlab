import { cn } from "@/lib/utils";

const ALL_CHIPS = [
  "Spend fake cents to collect Yes or No shares.",
  "1 fake cent spent = 1 share cent.",
  "This workshop app does not use real money.",
] as const;

type FakeMoneyChipsProps = {
  variant?: "full" | "compact";
  className?: string;
};

export function FakeMoneyChips({
  variant = "full",
  className,
}: FakeMoneyChipsProps) {
  const chips = variant === "compact" ? ALL_CHIPS.slice(1) : ALL_CHIPS;

  return (
    <ul
      className={cn("flex list-none flex-wrap gap-2 p-0", className)}
      aria-label="Fake money reminders"
    >
      {chips.map((chip) => (
        <li key={chip}>
          <span className="inline-block rounded-full border border-brand/25 bg-brand/5 px-3 py-1 text-xs font-medium text-foreground">
            {chip}
          </span>
        </li>
      ))}
    </ul>
  );
}
