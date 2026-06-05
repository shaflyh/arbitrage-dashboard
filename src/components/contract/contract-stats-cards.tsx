import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ContractStats } from "@/types/bounce-contract";
import { BarChart3, Bot, Target, TrendingUp } from "lucide-react";

interface ContractStatsCardsProps {
  stats: ContractStats;
}

export function ContractStatsCards({ stats }: ContractStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-4">
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
          <CardTitle className="text-sm font-medium">Top Symbol</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.topSymbol ?? "—"}</div>
          <p className="text-xs text-muted-foreground">
            {stats.uniqueSymbols} symbol{stats.uniqueSymbols !== 1 ? "s" : ""}{" "}
            active
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Bot Activity</CardTitle>
          <Bot className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {stats.v1Count + stats.v2Count}
          </div>
          <p className="text-xs text-muted-foreground">
            v1: {stats.v1Count} · v2: {stats.v2Count}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
