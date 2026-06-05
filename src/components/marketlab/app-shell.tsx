import { Header } from "@/components/marketlab/header";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      <Header />
      <div className="flex flex-1 flex-col">{children}</div>
    </div>
  );
}
