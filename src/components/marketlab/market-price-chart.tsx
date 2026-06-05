"use client";

import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  buildSvgAreaPath,
  buildSvgLinePath,
  type ChartRange,
  filterPriceHistoryByRange,
  formatYesChancePercent,
  getCurrentYesChance,
  type PriceHistoryPoint,
} from "@/lib/markets/price-history";
import { cn } from "@/lib/utils";

const CHART_WIDTH = 400;
const CHART_HEIGHT = 200;
const CHART_PADDING = {
  paddingTop: 12,
  paddingRight: 12,
  paddingBottom: 28,
  paddingLeft: 36,
};

const RANGE_OPTIONS: { value: ChartRange; label: string }[] = [
  { value: "1d", label: "1D" },
  { value: "1w", label: "1W" },
  { value: "all", label: "ALL" },
];

type MarketPriceChartProps = {
  points: PriceHistoryPoint[];
  yesChance: number | null;
  referenceNow: string;
};

function formatAxisTime(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

function pickAxisTicks(points: PriceHistoryPoint[]): PriceHistoryPoint[] {
  if (points.length <= 3) {
    return points;
  }

  const middleIndex = Math.floor(points.length / 2);
  return [points[0], points[middleIndex], points[points.length - 1]];
}

export function MarketPriceChart({
  points,
  yesChance,
  referenceNow,
}: MarketPriceChartProps) {
  const [range, setRange] = useState<ChartRange>("all");
  const referenceDate = useMemo(() => new Date(referenceNow), [referenceNow]);

  const filteredPoints = useMemo(
    () => filterPriceHistoryByRange(points, range, referenceDate),
    [points, range, referenceDate],
  );

  const currentYesChance = yesChance ?? getCurrentYesChance(points) ?? null;
  const linePath = buildSvgLinePath(filteredPoints, {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    ...CHART_PADDING,
  });
  const areaPath = buildSvgAreaPath(filteredPoints, {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    ...CHART_PADDING,
  });
  const axisTicks = pickAxisTicks(filteredPoints);

  const chartHeight =
    CHART_HEIGHT - CHART_PADDING.paddingTop - CHART_PADDING.paddingBottom;
  const chartWidth =
    CHART_WIDTH - CHART_PADDING.paddingLeft - CHART_PADDING.paddingRight;
  const baselineY = CHART_PADDING.paddingTop + chartHeight;

  const yGridLines = [0, 50, 100];

  return (
    <section className="rounded-xl border border-border bg-card p-6 text-card-foreground shadow-sm">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Yes chance
          </p>
          <p className="text-4xl font-semibold tracking-tight text-brand tabular-nums sm:text-5xl">
            {currentYesChance === null
              ? "—"
              : formatYesChancePercent(currentYesChance)}
          </p>
        </div>
        <div className="flex items-center gap-1">
          {RANGE_OPTIONS.map((option) => (
            <Button
              key={option.value}
              type="button"
              size="xs"
              variant="outline"
              className={cn(
                range === option.value && "bg-muted text-foreground",
              )}
              onClick={() => setRange(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 w-full">
        {filteredPoints.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chart updates after the first fake-money buy on this market.
          </p>
        ) : null}
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          preserveAspectRatio="none"
          className="h-48 w-full text-muted-foreground"
          role="img"
          aria-label="Yes probability over time"
        >
          {yGridLines.map((value) => {
            const y =
              CHART_PADDING.paddingTop +
              chartHeight -
              (value / 100) * chartHeight;
            return (
              <g key={value}>
                <line
                  x1={CHART_PADDING.paddingLeft}
                  y1={y}
                  x2={CHART_PADDING.paddingLeft + chartWidth}
                  y2={y}
                  className="stroke-border"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                />
                <text
                  x={CHART_PADDING.paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-muted-foreground text-[10px]"
                >
                  {value}%
                </text>
              </g>
            );
          })}

          {areaPath ? (
            <path
              d={areaPath}
              className="fill-chart-1/15 stroke-none"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}

          {linePath ? (
            <path
              d={linePath}
              fill="none"
              className="stroke-chart-1"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
            />
          ) : null}

          <line
            x1={CHART_PADDING.paddingLeft}
            y1={baselineY}
            x2={CHART_PADDING.paddingLeft + chartWidth}
            y2={baselineY}
            className="stroke-border"
            strokeWidth="1"
            vectorEffect="non-scaling-stroke"
          />

          {axisTicks.map((point) => {
            const startMs = new Date(filteredPoints[0].recordedAt).getTime();
            const endMs = new Date(
              filteredPoints[filteredPoints.length - 1].recordedAt,
            ).getTime();
            const timeSpan = Math.max(endMs - startMs, 1);
            const x =
              CHART_PADDING.paddingLeft +
              ((new Date(point.recordedAt).getTime() - startMs) / timeSpan) *
                chartWidth;

            return (
              <text
                key={point.recordedAt}
                x={x}
                y={CHART_HEIGHT - 8}
                textAnchor="middle"
                className="fill-muted-foreground text-[10px]"
              >
                {formatAxisTime(point.recordedAt)}
              </text>
            );
          })}
        </svg>
      </div>
    </section>
  );
}
