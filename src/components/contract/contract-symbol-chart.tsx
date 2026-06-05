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
import { Bar, BarChart, XAxis, YAxis } from "recharts";
import type { ContractExecutionLog } from "@/types/bounce-contract";

const chartConfig = {
  count: { label: "Executions", color: "var(--color-chart-2)" },
} satisfies ChartConfig;

export function ContractSymbolChart({
  logs,
}: {
  logs: ContractExecutionLog[];
}) {
  const symbolCounts = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.symbol] = (acc[l.symbol] ?? 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(symbolCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([symbol, count]) => ({ symbol, count }));

  const chartHeight = Math.max(200, chartData.length * 40);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executions by Symbol</CardTitle>
        <CardDescription>
          Which pairs fire most often ({chartData.length} active)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          style={{ height: chartHeight }}
          className="w-full"
        >
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ left: 16, right: 16 }}
          >
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <YAxis
              dataKey="symbol"
              type="category"
              tickLine={false}
              axisLine={false}
              width={80}
              tick={{ fontSize: 12 }}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="count"
              fill="var(--color-chart-2)"
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
