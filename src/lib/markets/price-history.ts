export type PriceHistoryPoint = {
  recordedAt: string;
  yesChance: number;
};

export type ChartRange = "1d" | "1w" | "all";

export type MarketShareTotals = {
  yesSharesCents: number;
  noSharesCents: number;
};

type RpcPricePoint = {
  recorded_at: string;
  yes_chance: number;
};

export function parsePriceHistoryPoints(data: unknown): PriceHistoryPoint[] {
  if (!Array.isArray(data)) {
    return [];
  }

  return data
    .map((item) => {
      if (!item || typeof item !== "object") {
        return null;
      }
      const point = item as RpcPricePoint;
      if (
        typeof point.recorded_at !== "string" ||
        typeof point.yes_chance !== "number"
      ) {
        return null;
      }
      return {
        recordedAt: point.recorded_at,
        yesChance: Math.round(point.yes_chance),
      };
    })
    .filter((point): point is PriceHistoryPoint => point !== null);
}

export function computeYesChanceFromShareTotals(
  totals: MarketShareTotals,
): number | null {
  const total = totals.yesSharesCents + totals.noSharesCents;
  if (total <= 0) {
    return null;
  }

  return Math.round((totals.yesSharesCents / total) * 100);
}

export function getCurrentYesChance(
  points: PriceHistoryPoint[],
): number | null {
  if (points.length === 0) {
    return null;
  }
  return points[points.length - 1].yesChance;
}

export function formatYesChancePercent(value: number): string {
  return `${Math.round(value)}%`;
}

const RANGE_MS: Record<Exclude<ChartRange, "all">, number> = {
  "1d": 24 * 60 * 60 * 1000,
  "1w": 7 * 24 * 60 * 60 * 1000,
};

export function filterPriceHistoryByRange(
  points: PriceHistoryPoint[],
  range: ChartRange,
  referenceNow: Date,
): PriceHistoryPoint[] {
  if (range === "all" || points.length === 0) {
    return points;
  }

  const cutoff = referenceNow.getTime() - RANGE_MS[range];
  const filtered = points.filter(
    (point) => new Date(point.recordedAt).getTime() >= cutoff,
  );

  return filtered.length > 0 ? filtered : [points[points.length - 1]];
}

export type SvgChartDimensions = {
  width: number;
  height: number;
  paddingTop?: number;
  paddingRight?: number;
  paddingBottom?: number;
  paddingLeft?: number;
};

export function buildSvgLinePath(
  points: PriceHistoryPoint[],
  dimensions: SvgChartDimensions,
): string {
  if (points.length === 0) {
    return "";
  }

  const {
    width,
    height,
    paddingTop = 12,
    paddingRight = 12,
    paddingBottom = 24,
    paddingLeft = 36,
  } = dimensions;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const startMs = new Date(points[0].recordedAt).getTime();
  const endMs = new Date(points[points.length - 1].recordedAt).getTime();
  const timeSpan = Math.max(endMs - startMs, 1);

  const coords = points.map((point) => {
    const x =
      paddingLeft +
      ((new Date(point.recordedAt).getTime() - startMs) / timeSpan) *
        chartWidth;
    const y = paddingTop + chartHeight - (point.yesChance / 100) * chartHeight;
    return { x, y };
  });

  return coords
    .map((coord, index) =>
      index === 0
        ? `M ${coord.x.toFixed(2)} ${coord.y.toFixed(2)}`
        : `L ${coord.x.toFixed(2)} ${coord.y.toFixed(2)}`,
    )
    .join(" ");
}

export function buildSvgAreaPath(
  points: PriceHistoryPoint[],
  dimensions: SvgChartDimensions,
): string {
  const linePath = buildSvgLinePath(points, dimensions);
  if (!linePath) {
    return "";
  }

  const {
    width,
    height,
    paddingTop = 12,
    paddingRight = 12,
    paddingBottom = 24,
    paddingLeft = 36,
  } = dimensions;

  const chartHeight = height - paddingTop - paddingBottom;
  const baselineY = paddingTop + chartHeight;
  const startMs = new Date(points[0].recordedAt).getTime();
  const endMs = new Date(points[points.length - 1].recordedAt).getTime();
  const timeSpan = Math.max(endMs - startMs, 1);
  const chartWidth = width - paddingLeft - paddingRight;
  const endX =
    paddingLeft +
    ((new Date(points[points.length - 1].recordedAt).getTime() - startMs) /
      timeSpan) *
      chartWidth;
  const startX = paddingLeft;

  return `${linePath} L ${endX.toFixed(2)} ${baselineY.toFixed(2)} L ${startX.toFixed(2)} ${baselineY.toFixed(2)} Z`;
}

/** Deterministic sample points for unit tests only. */
export function buildSamplePriceHistoryForTests(
  marketId: string,
  referenceNow: Date,
): PriceHistoryPoint[] {
  const seed = marketId.charCodeAt(0) % 20;
  return [
    {
      recordedAt: new Date(referenceNow.getTime() - 7 * 86400000).toISOString(),
      yesChance: 40 + seed,
    },
    {
      recordedAt: new Date(referenceNow.getTime() - 3 * 86400000).toISOString(),
      yesChance: 45 + seed,
    },
    {
      recordedAt: referenceNow.toISOString(),
      yesChance: 50 + seed,
    },
  ];
}
