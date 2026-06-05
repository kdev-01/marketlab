// @vitest-environment jsdom

import "@/test/next-mocks";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MarketList } from "@/components/marketlab/market-list";
import { MarketsPageHeader } from "@/components/marketlab/markets-page-header";

describe("Markets dashboard content", () => {
  it("does not render workshop hero or template images", () => {
    render(
      <>
        <MarketsPageHeader />
        <MarketList
          markets={[
            {
              id: "11111111-1111-1111-1111-111111111111",
              title: "Sample",
              description: "Desc",
              status: "open",
              close_date: "2026-06-04T00:00:00.000Z",
            },
          ]}
        />
      </>,
    );
    expect(screen.queryByAltText(/quito/i)).not.toBeInTheDocument();
    expect(document.querySelector('img[src*="quito"]')).toBeNull();
    expect(document.querySelector('img[src*="hero2"]')).toBeNull();
  });
});
