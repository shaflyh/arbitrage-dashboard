"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Line, LineChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts";
import type { Trade } from "@/types/trade";

interface IndividualProfitChartProps {
  trades: Trade[];
}

const chartConfig = {
  profit: {
    label: "Profit",
    color: "var(--color-chart-1)",
  },
} satisfies ChartConfig;

export function IndividualProfitChart({ trades }: IndividualProfitChartProps) {
  // Sort by timestamp ascending for chronological order
  const sortedTrades = [...trades].sort((a, b) => a.timestamp - b.timestamp);

  const chartData = sortedTrades.map((trade, index) => ({
    index: index + 1,
    datetime: new Date(trade.timestamp).toLocaleDateString(),
    time: new Date(trade.timestamp).toLocaleTimeString(),
    profit: parseFloat((trade.netProfit || 0).toFixed(6)),
    direction: trade.direction.replace("_TO_", " → "),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Individual Trade Profits</CardTitle>
        <CardDescription>Profit/loss trend for each trade over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <LineChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: 10,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="index" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${Number(value).toFixed(3)}`}
            />
            <ReferenceLine
              y={0}
              stroke="hsl(var(--border))"
              strokeWidth={2}
              strokeDasharray="3 3"
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `Trade #${value}`}
                  formatter={(value, _name, props) => {
                    const data = props.payload;
                    const isProfit = (value as number) >= 0;
                    return [
                      <div key="content" className="flex flex-col gap-1">
                        <div
                          className={
                            isProfit ? "text-green-600 font-semibold" : "text-red-600 font-semibold"
                          }
                        >
                          {isProfit ? "+" : ""}
                          {Number(value).toFixed(6)} WHYPE
                        </div>
                        <div className="text-xs text-muted-foreground">{data.direction}</div>
                        <div className="text-xs text-muted-foreground">
                          {data.datetime} {data.time}
                        </div>
                      </div>,
                      "",
                    ];
                  }}
                />
              }
            />
            <Line
              dataKey="profit"
              type="natural"
              stroke="var(--color-chart-1)"
              strokeWidth={2}
              dot={(props) => {
                const { cx, cy, payload } = props;
                const isProfit = payload.profit >= 0;
                return (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={2}
                    fill={isProfit ? "var(--color-chart-2)" : "var(--color-destructive)"}
                    stroke={isProfit ? "var(--color-chart-2)" : "var(--color-destructive)"}
                    strokeWidth={2}
                  />
                );
              }}
              activeDot={{
                r: 4,
              }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
