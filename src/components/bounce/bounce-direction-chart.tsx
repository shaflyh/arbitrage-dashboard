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

interface BounceDirectionChartProps {
  logs: BounceExecutionLog[];
}

const chartConfig = {
  count: { label: "Count", color: "var(--color-chart-3)" },
} satisfies ChartConfig;

export function BounceDirectionChart({ logs }: BounceDirectionChartProps) {
  const dirStats = logs.reduce(
    (acc, log) => {
      const dir = log.direction || "unknown";
      if (!acc[dir])
        acc[dir] = { direction: dir, executed: 0, skipped: 0, netPnl: 0 };
      if (log.status === "executed") {
        acc[dir].executed += 1;
        acc[dir].netPnl += (log.actualPnlUsdc ?? 0) - (log.gasSpent ?? 0);
      } else {
        acc[dir].skipped += 1;
      }
      return acc;
    },
    {} as Record<
      string,
      { direction: string; executed: number; skipped: number; netPnl: number }
    >,
  );

  const chartData = Object.values(dirStats).map((stat, index) => ({
    direction: stat.direction,
    executed: stat.executed,
    skipped: stat.skipped,
    netPnl: parseFloat(stat.netPnl.toFixed(4)),
    fill: index === 0 ? "var(--color-chart-1)" : "var(--color-chart-2)",
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity by Direction</CardTitle>
        <CardDescription>
          Executed and skipped counts per direction
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="direction"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => v}
                  formatter={(value, name, props) => {
                    const data = props.payload;
                    return [
                      <div key="content" className="flex flex-col gap-1">
                        <div className="font-semibold">
                          {name}: {value}
                        </div>
                        <div
                          className={`text-xs ${data.netPnl >= 0 ? "text-green-500" : "text-red-500"}`}
                        >
                          Net PnL: ${data.netPnl.toFixed(4)}
                        </div>
                      </div>,
                      "",
                    ];
                  }}
                />
              }
            />
            <Bar dataKey="executed" name="Executed" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`exec-${index}`} fill={entry.fill} />
              ))}
            </Bar>
            <Bar
              dataKey="skipped"
              name="Skipped"
              radius={[4, 4, 0, 0]}
              fill="var(--color-chart-4)"
              opacity={0.5}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
