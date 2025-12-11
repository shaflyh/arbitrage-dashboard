"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { Trade } from "@/types/trade";

interface ProfitChartProps {
  trades: Trade[];
}

const chartConfig = {
  profit: {
    label: "Cumulative Profit",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function ProfitChart({ trades }: ProfitChartProps) {
  // Sort by timestamp ascending and calculate cumulative profit
  const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp);

  const chartData = sortedTrades.reduce((acc, trade, index) => {
    const previousProfit = index === 0 ? 0 : acc[index - 1].profit;
    const cumulativeProfit = previousProfit + (trade.netProfit || 0);

    acc.push({
      datetime: new Date(trade.timestamp).toLocaleDateString(),
      timestamp: trade.timestamp,
      profit: parseFloat(cumulativeProfit.toFixed(6)),
    });

    return acc;
  }, [] as Array<{ datetime: string; timestamp: number; profit: number }>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cumulative Profit Over Time</CardTitle>
        <CardDescription>Total profit accumulated from all trades</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-chart-1)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-chart-1)" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="datetime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 5)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${Number(value).toFixed(3)}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Date: ${value}`}
                  formatter={(value) => [`${Number(value).toFixed(6)} WHYPE`, "Cumulative Profit"]}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="profit"
              type="natural"
              fill="url(#fillProfit)"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
