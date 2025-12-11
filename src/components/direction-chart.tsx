"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Cell } from "recharts";
import type { Trade } from "@/types/trade";

interface DirectionChartProps {
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
  count: {
    label: "Number of Trades",
    color: "var(--color-chart-2)",
  },
} satisfies ChartConfig;

export function DirectionChart({ trades }: DirectionChartProps) {
  // Group trades by direction
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
    direction: stat.direction.replace("_TO_", " → "),
    count: stat.count,
    profit: parseFloat(stat.profit.toFixed(6)),
    fill: COLORS[index % COLORS.length],
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trades by Direction</CardTitle>
        <CardDescription>Number of trades and profit per direction</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 20,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="direction"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => value}
                  formatter={(value, _name, props) => {
                    const data = props.payload;
                    return [
                      <div key="content" className="flex flex-col gap-1">
                        <div className="font-semibold">{value} trades</div>
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
            <Bar dataKey="count" radius={4}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
            <ChartLegend content={<ChartLegendContent />} wrapperStyle={{ paddingTop: "20px" }} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
