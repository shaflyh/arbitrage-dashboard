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
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { BounceExecutionLog } from "@/types/bounce";

interface BounceExpectedVsActualChartProps {
  logs: BounceExecutionLog[];
}

const chartConfig = {
  expected: { label: "Expected PnL", color: "var(--color-chart-2)" },
  actual: { label: "Actual PnL", color: "var(--color-chart-1)" },
} satisfies ChartConfig;

export function BounceExpectedVsActualChart({
  logs,
}: BounceExpectedVsActualChartProps) {
  const executed = [...logs]
    .filter((l) => l.status === "executed" && l.generatedAt)
    .sort(
      (a, b) =>
        new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime(),
    );

  // Group by date to avoid too many bars
  const byDate = executed.reduce(
    (acc, log) => {
      const date = new Date(log.generatedAt).toLocaleDateString();
      if (!acc[date]) acc[date] = { expected: 0, actual: 0 };
      acc[date].expected += log.expectedPnlUsdc ?? 0;
      acc[date].actual += log.actualPnlUsdc ?? 0;
      return acc;
    },
    {} as Record<string, { expected: number; actual: number }>,
  );

  const chartData = Object.entries(byDate).map(([date, vals]) => ({
    date,
    expected: parseFloat(vals.expected.toFixed(4)),
    actual: parseFloat(vals.actual.toFixed(4)),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expected vs Actual PnL</CardTitle>
        <CardDescription>
          Daily comparison of expected and actual PnL (executed trades)
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
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.slice(0, 5)}
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
                  labelFormatter={(v) => `Date: ${v}`}
                  formatter={(v, name) => [`$${Number(v).toFixed(4)}`, name]}
                />
              }
            />
            <Bar
              dataKey="expected"
              fill="var(--color-chart-2)"
              radius={[4, 4, 0, 0]}
              opacity={0.7}
            />
            <Bar
              dataKey="actual"
              fill="var(--color-chart-1)"
              radius={[4, 4, 0, 0]}
            />
            <ChartLegend
              content={<ChartLegendContent />}
              wrapperStyle={{ paddingTop: "12px" }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
