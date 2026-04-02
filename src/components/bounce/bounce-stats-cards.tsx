import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BounceStats } from "@/types/bounce";
import { TrendingUp, BarChart3, Target, DollarSign } from "lucide-react";

interface BounceStatsCardsProps {
  stats: BounceStats;
}

export function BounceStatsCards({ stats }: BounceStatsCardsProps) {
  const netPositive = stats.netPnlAfterGas >= 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Net PnL (after gas)
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${netPositive ? "text-green-500" : "text-red-500"}`}
          >
            {netPositive ? "+" : ""}
            {stats.netPnlAfterGas.toFixed(4)} USDC
          </div>
          <p className="text-xs text-muted-foreground">
            Actual: {stats.totalActualPnl.toFixed(4)} − Gas:{" "}
            {stats.totalGasSpent.toFixed(4)}
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

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Avg PnL / Execution
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div
            className={`text-2xl font-bold ${stats.avgPnlPerExecution >= 0 ? "text-green-500" : "text-red-500"}`}
          >
            {stats.avgPnlPerExecution >= 0 ? "+" : ""}
            {stats.avgPnlPerExecution.toFixed(4)}
          </div>
          <p className="text-xs text-muted-foreground">
            USDC per executed trade
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
