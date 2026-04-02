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
import { Line, LineChart, CartesianGrid, XAxis, YAxis } from "recharts";
import type { BounceExecutionLog } from "@/types/bounce";

interface BounceWalletBalanceChartProps {
  logs: BounceExecutionLog[];
}

const chartConfig = {
  balance: {
    label: "Wallet USDC",
    color: "var(--color-chart-3)",
  },
} satisfies ChartConfig;

export function BounceWalletBalanceChart({
  logs,
}: BounceWalletBalanceChartProps) {
  const sorted = [...logs]
    .filter((l) => l.generatedAt && l.walletUsdcBefore != null)
    .sort(
      (a, b) =>
        new Date(a.generatedAt).getTime() - new Date(b.generatedAt).getTime(),
    );

  // Use walletUsdcAfter when available (executed), else walletUsdcBefore
  const chartData = sorted.map((log) => ({
    datetime: new Date(log.generatedAt).toLocaleDateString(),
    balance: parseFloat(
      ((log.walletUsdcAfter ?? log.walletUsdcBefore) || 0).toFixed(4),
    ),
    status: log.status,
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Wallet USDC Balance</CardTitle>
        <CardDescription>
          Balance trajectory over time across all logs
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 10, left: 10, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="datetime"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => v.slice(0, 5)}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(v) => `$${Number(v).toFixed(0)}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(v) => `Date: ${v}`}
                  formatter={(v, _name, props) => [
                    <div key="content" className="flex flex-col gap-1">
                      <div className="font-semibold">
                        ${Number(v).toFixed(4)} USDC
                      </div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {props.payload?.status}
                      </div>
                    </div>,
                    "",
                  ]}
                  indicator="dot"
                />
              }
            />
            <Line
              dataKey="balance"
              type="monotone"
              stroke="var(--color-chart-3)"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
