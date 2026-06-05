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
import type { ContractExecutionLog } from "@/types/bounce-contract";

const chartConfig = { logs: { label: "Logs" } } satisfies ChartConfig;

export function ContractBotChart({ logs }: { logs: ContractExecutionLog[] }) {
  const v1 = logs.filter((l) => l.bot === "contract-v1").length;
  const v2 = logs.filter((l) => l.bot === "contract-v2").length;
  const total = logs.length;

  const chartData = [
    {
      name: "Contract V1",
      value: v1,
      percentage: total > 0 ? ((v1 / total) * 100).toFixed(1) : "0",
      fill: "var(--color-chart-3)",
    },
    {
      name: "Contract V2",
      value: v2,
      percentage: total > 0 ? ((v2 / total) * 100).toFixed(1) : "0",
      fill: "var(--color-chart-5)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bot Activity</CardTitle>
        <CardDescription>Contract V1 vs V2 execution share</CardDescription>
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
