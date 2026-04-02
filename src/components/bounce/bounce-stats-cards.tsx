import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BounceStats } from "@/types/bounce";
import { BarChart3, Target, TrendingUp } from "lucide-react";

interface BounceStatsCardsProps {
  stats: BounceStats;
}

export function BounceStatsCards({ stats }: BounceStatsCardsProps) {
  const pnlPositive = stats.totalActualPnl >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total PnL</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${pnlPositive ? "text-green-500" : "text-red-500"}`}
          >
            {pnlPositive ? "+" : ""}
            {stats.totalActualPnl.toFixed(4)} USDC
          </div>
          <p className="text-xs text-muted-foreground">
            Avg: {stats.avgPnlPerExecution.toFixed(4)} per execution
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Logs</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalLogs}</div>
          <p className="text-xs text-muted-foreground">
            {stats.totalExecuted} executed · {stats.totalSkipped} skipped
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Execution Rate</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.executionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">Opportunities taken</p>
        </CardContent>
      </Card>
    </div>
  );
}
