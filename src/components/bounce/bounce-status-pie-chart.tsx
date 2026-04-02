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
import { Pie, PieChart, Cell } from "recharts";
import type { BounceExecutionLog } from "@/types/bounce";

interface BounceStatusPieChartProps {
  logs: BounceExecutionLog[];
}

const chartConfig = {
  logs: { label: "Logs" },
} satisfies ChartConfig;

export function BounceStatusPieChart({ logs }: BounceStatusPieChartProps) {
  const executed = logs.filter((l) => l.status === "executed").length;
  const skipped = logs.filter((l) => l.status === "skipped").length;
  const total = logs.length;

  const chartData = [
    {
      name: "Executed",
      value: executed,
      percentage: total > 0 ? ((executed / total) * 100).toFixed(1) : "0",
      fill: "var(--color-chart-2)",
    },
    {
      name: "Skipped",
      value: skipped,
      percentage: total > 0 ? ((skipped / total) * 100).toFixed(1) : "0",
      fill: "var(--color-chart-4)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Status</CardTitle>
        <CardDescription>Executed vs skipped opportunities</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[300px]"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent
                  hideLabel
                  formatter={(value, _name, props) => {
                    const data = props.payload;
                    return [
                      <div key="content" className="flex flex-col gap-1">
                        <div className="font-semibold">{data.name}</div>
                        <div className="text-sm">
                          {value} logs ({data.percentage}%)
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
              label={(entry) => `${entry.name} ${entry.percentage}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
