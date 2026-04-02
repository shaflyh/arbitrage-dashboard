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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import type { BounceExecutionLog } from "@/types/bounce";

interface BouncePnlByRouteChartProps {
  logs: BounceExecutionLog[];
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const chartConfig = {
  netPnl: { label: "Net PnL (USDC)", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export function BouncePnlByRouteChart({ logs }: BouncePnlByRouteChartProps) {
  const routeStats = logs
    .filter((l) => l.status === "executed")
    .reduce(
      (acc, log) => {
        const key = log.targetSymbol || "Unknown";
        if (!acc[key]) acc[key] = { route: key, netPnl: 0, count: 0, gas: 0 };
        acc[key].netPnl += log.actualPnlUsdc ?? 0;
        acc[key].gas += log.gasSpent ?? 0;
        acc[key].count += 1;
        return acc;
      },
      {} as Record<
        string,
        { route: string; netPnl: number; count: number; gas: number }
      >,
    );

  const chartData = Object.values(routeStats)
    .map((stat, index) => ({
      route: stat.route,
      netPnl: parseFloat((stat.netPnl - stat.gas).toFixed(4)),
      count: stat.count,
      fill: COLORS[index % COLORS.length],
    }))
    .sort((a, b) => b.netPnl - a.netPnl);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net PnL by Symbol</CardTitle>
        <CardDescription>
          Actual PnL minus gas per target symbol (executed only)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="route"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-35}
              textAnchor="end"
              height={80}
              tick={{ fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `$${v}`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => v}
                  formatter={(value, _name, props) => {
                    const data = props.payload;
                    const color =
                      Number(value) >= 0 ? "text-green-500" : "text-red-500";
                    return [
                      <div key="content" className="flex flex-col gap-1">
                        <div className={`font-semibold ${color}`}>
                          ${Number(value).toFixed(4)} USDC net
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {data.count} executions
                        </div>
                      </div>,
                      "",
                    ];
                  }}
                />
              }
            />
            <Bar dataKey="netPnl" radius={4}>
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.netPnl >= 0 ? entry.fill : "var(--color-chart-5)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
