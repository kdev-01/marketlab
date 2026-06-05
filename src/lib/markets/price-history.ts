export type PriceHistoryPoint = {
  recordedAt: string;
  yesChance: number;
};

export type ChartRange = "1d" | "1w" | "all";

export const DEFAULT_REFERENCE_NOW = new Date("2026-06-04T12:00:00.000Z");

const POINT_COUNT = 40;
const HISTORY_DAYS = 30;
const MIN_CHANCE = 5;
const MAX_CHANCE = 95;

function hashMarketId(marketId: string): number {
  let hash = 0;
  for (let i = 0; i < marketId.length; i++) {
    hash = (hash * 31 + marketId.charCodeAt(i)) >>> 0;
  }
  return hash || 1;
}

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function clampChance(value: number): number {
  return Math.min(MAX_CHANCE, Math.max(MIN_CHANCE, value));
}

export function buildMockPriceHistory(
  marketId: string,
  options?: { referenceNow?: Date },
): PriceHistoryPoint[] {
  const referenceNow = options?.referenceNow ?? DEFAULT_REFERENCE_NOW;
  const random = mulberry32(hashMarketId(marketId));
  const endMs = referenceNow.getTime();
  const startMs = endMs - HISTORY_DAYS * 24 * 60 * 60 * 1000;
  const stepMs = (endMs - startMs) / (POINT_COUNT - 1);

  let yesChance = MIN_CHANCE + random() * (MAX_CHANCE - MIN_CHANCE);
  const points: PriceHistoryPoint[] = [];

  for (let i = 0; i < POINT_COUNT; i++) {
    const recordedAt = new Date(startMs + stepMs * i).toISOString();
    yesChance = clampChance(yesChance + (random() - 0.5) * 12);
    points.push({
      recordedAt,
      yesChance: Math.round(yesChance),
    });
  }

  return points;
}

export function getCurrentYesChance(points: PriceHistoryPoint[]): number {
  if (points.length === 0) {
    return 0;
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
  referenceNow: Date = DEFAULT_REFERENCE_NOW,
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
