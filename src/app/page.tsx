"use client";

import { useTrades } from "@/hooks/use-trades";
import { useBalances } from "@/hooks/use-balances";
import { StatsCards } from "@/components/stats-cards";
import { ProfitChart } from "@/components/profit-chart";
import { IndividualProfitChart } from "@/components/individual-profit-chart";
import { DirectionChart } from "@/components/direction-chart";
import { DirectionPieChart } from "@/components/direction-pie-chart";
import { TradeTable } from "@/components/trade-table";
import { DateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { RefreshCw, Wallet } from "lucide-react";

export default function Home() {
  const { trades, stats, loading, error, lastUpdated, refetch, dateRange, setDateRange } =
    useTrades(
      60000, // Auto-refresh every 60 seconds
    );

  const { balances, loading: balancesLoading, refetch: refetchBalances } = useBalances(60000); // Auto-refresh balances every 60 seconds

  if (loading && trades.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading trades...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Hyperliquid Arbitrage Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              {lastUpdated && `Last updated: ${new Date(lastUpdated).toLocaleString()}`}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card text-card-foreground">
              <Wallet className="h-3.5 w-3.5 text-muted-foreground" />
              <span className="text-sm font-medium">
                {balancesLoading ? (
                  <span className="text-muted-foreground">--</span>
                ) : balances ? (
                  parseFloat(balances.whype).toFixed(2)
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">WHYPE</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card text-card-foreground">
              <span className="text-sm font-medium">
                {balancesLoading ? (
                  <span className="text-muted-foreground">--</span>
                ) : balances ? (
                  parseFloat(balances.usdt).toFixed(2)
                ) : (
                  <span className="text-muted-foreground">--</span>
                )}
              </span>
              <span className="text-xs text-muted-foreground">USD₮0</span>
            </div>
            <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />
            <Button
              onClick={() => {
                refetch();
                refetchBalances();
              }}
              variant="outline"
              size="sm"
              disabled={loading || balancesLoading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading || balancesLoading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && <StatsCards stats={stats} />}

        {/* Charts Grid - Top Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <ProfitChart trades={trades} />
          <DirectionPieChart trades={trades} />
        </div>

        {/* Charts Grid - Middle Row */}
        <div className="grid gap-6 md:grid-cols-2">
          <IndividualProfitChart trades={trades} />
          <DirectionChart trades={trades} />
        </div>

        {/* Trade Table */}
        <TradeTable trades={trades} />
      </div>
    </div>
  );
}
