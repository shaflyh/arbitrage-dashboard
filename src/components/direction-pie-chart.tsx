"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  // ChartLegend,
} from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import type { Trade } from "@/types/trade";

interface DirectionPieChartProps {
  trades: Trade[];
}

const COLORS = [
  "var(--color-chart-1)",
  "var(--color-chart-2)",
  "var(--color-chart-3)",
  "var(--color-chart-4)",
  "var(--color-chart-5)",
];

const chartConfig = {
  trades: {
    label: "Trades",
  },
} satisfies ChartConfig;

export function DirectionPieChart({ trades }: DirectionPieChartProps) {
  // Group trades by direction and calculate percentages
  const directionStats = trades.reduce((acc, trade) => {
    const dir = trade.direction || "UNKNOWN";
    if (!acc[dir]) {
      acc[dir] = { direction: dir, count: 0, profit: 0 };
    }
    acc[dir].count += 1;
    acc[dir].profit += trade.netProfit || 0;
    return acc;
  }, {} as Record<string, { direction: string; count: number; profit: number }>);

  const chartData = Object.values(directionStats).map((stat, index) => ({
    name: stat.direction.replace("_TO_", " → "),
    value: stat.count,
    profit: parseFloat(stat.profit.toFixed(6)),
    percentage: ((stat.count / trades.length) * 100).toFixed(1),
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Distribution by Route</CardTitle>
        <CardDescription>Percentage of trades per DEX pair</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, name, props) => {
                    const data = props.payload;
                    return [
                      <div key="content" className="flex flex-col gap-1">
                        <div className="font-semibold">{data.name}</div>
                        <div className="text-sm">
                          {value} trades ({data.percentage}%)
                        </div>
                        <div
                          className={`text-xs ${
                            data.profit >= 0 ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          Profit: {data.profit >= 0 ? "+" : ""}
                          {data.profit.toFixed(6)} WHYPE
                        </div>
                      </div>,
                      "",
                    ];
                  }}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={2}
              label={(entry) => `${entry.percentage}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            {/* <ChartLegend
              content={({ payload }) => {
                return (
                  <div className="flex flex-wrap gap-2 justify-left mt-4">
                    {payload?.map((entry, index) => (
                      <div key={`legend-${index}`} className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-sm"
                          style={{ backgroundColor: entry.color }}
                        />
                        <span className="text-xs text-muted-foreground">{entry.value}</span>
                      </div>
                    ))}
                  </div>
                );
              }}
            /> */}
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
