"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { BounceExecutionLog } from "@/types/bounce";

interface BounceCumulativePnlChartProps {
  logs: BounceExecutionLog[];
}

const chartConfig = {
  pnl: {
    label: "Cumulative Net PnL",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function BounceCumulativePnlChart({
  logs,
}: BounceCumulativePnlChartProps) {
  const executed = [...logs]
    .filter((l) => l.status === "executed" && l.generatedAt)
    .sort(
      (a, b) =>
        new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime(),
    );

  const chartData = executed.reduce(
    (acc, log, index) => {
      const prev = index === 0 ? 0 : acc[index - 1].pnl;
      const net = (log.actualPnlUsdc ?? 0) - (log.gasSpent ?? 0);
      acc.push({
        datetime: new Date(log.generatedAt).toLocaleDateString(),
        pnl: parseFloat((prev + net).toFixed(4)),
      });
      return acc;
    },
    [] as Array<{ datetime: string; pnl: number }>,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Net PnL Over Time</CardTitle>
        <CardDescription>
          Actual PnL minus gas — executed trades only
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="fillBouncePnl" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="datetime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.slice(0, 5)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `$${Number(v).toFixed(2)}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => `Date: ${v}`}
                  formatter={(v) => [
                    `$${Number(v).toFixed(4)} USDC`,
                    "Cumulative Net PnL",
                  ]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="pnl"
              type="natural"
              fill="url(#fillBouncePnl)"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
