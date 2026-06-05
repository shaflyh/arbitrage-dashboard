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

export function ContractRouteChart({ logs }: { logs: ContractExecutionLog[] }) {
  const buyRedeem = logs.filter((l) => l.route === "buy-redeem").length;
  const mintSell = logs.filter((l) => l.route === "mint-sell").length;
  const total = logs.length;

  const chartData = [
    {
      name: "Buy-Redeem",
      value: buyRedeem,
      percentage: total > 0 ? ((buyRedeem / total) * 100).toFixed(1) : "0",
      fill: "var(--color-chart-1)",
    },
    {
      name: "Mint-Sell",
      value: mintSell,
      percentage: total > 0 ? ((mintSell / total) * 100).toFixed(1) : "0",
      fill: "var(--color-chart-2)",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Route Split</CardTitle>
        <CardDescription>Buy-redeem vs mint-sell distribution</CardDescription>
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
