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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { ContractExecutionLog } from "@/types/bounce-contract";

const chartConfig = {
  executed: { label: "Executed", color: "var(--color-chart-2)" },
  skipped: { label: "Skipped", color: "var(--color-chart-4)" },
} satisfies ChartConfig;

function getBucket(date: Date, useHours: boolean): string {
  if (useHours) {
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      hour12: true,
    });
  }
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function ContractExecutionsChart({
  logs,
}: {
  logs: ContractExecutionLog[];
}) {
  if (logs.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Executions Over Time</CardTitle>
          <CardDescription>No data in selected range</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center text-muted-foreground">
          No executions to display
        </CardContent>
      </Card>
    );
  }

  const dates = logs.map((l) => new Date(l.generatedAt).getTime());
  const rangeMs = Math.max(...dates) - Math.min(...dates);
  const useHours = rangeMs <= 2 * 24 * 60 * 60 * 1000;

  const buckets = logs.reduce<
    Record<string, { executed: number; skipped: number }>
  >((acc, log) => {
    const key = getBucket(new Date(log.generatedAt), useHours);
    if (!acc[key]) acc[key] = { executed: 0, skipped: 0 };
    acc[key][log.status]++;
    return acc;
  }, {});

  const chartData = Object.entries(buckets).map(([label, counts]) => ({
    label,
    ...counts,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Executions Over Time</CardTitle>
        <CardDescription>
          Executed and skipped by {useHours ? "hour" : "day"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 11 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar
              dataKey="executed"
              stackId="a"
              fill="var(--color-chart-2)"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="skipped"
              stackId="a"
              fill="var(--color-chart-4)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
