import { FakeMoneyChips } from "@/components/marketlab/fake-money-chips";
import { PageHeader } from "@/components/marketlab/page-shell";

export function MarketsPageHeader() {
  return (
    <PageHeader
      eyebrow="Fake money markets"
      title="Browse markets"
      subtitle="Browse fictional Yes/No markets using fake money."
    >
      <FakeMoneyChips />
    </PageHeader>
  );
}
