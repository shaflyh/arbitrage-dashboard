"use client";

import { useBounce } from "@/hooks/use-bounce";
import { useBalances } from "@/hooks/use-balances";
import { BounceStatsCards } from "@/components/bounce/bounce-stats-cards";
import { BounceCumulativePnlChart } from "@/components/bounce/bounce-cumulative-pnl-chart";
import { BounceStatusPieChart } from "@/components/bounce/bounce-status-pie-chart";
import { BouncePnlByRouteChart } from "@/components/bounce/bounce-pnl-by-route-chart";
import { BounceDirectionChart } from "@/components/bounce/bounce-direction-chart";
import { BounceWalletBalanceChart } from "@/components/bounce/bounce-wallet-balance-chart";
import { BounceExpectedVsActualChart } from "@/components/bounce/bounce-expected-vs-actual-chart";
import { BounceTable } from "@/components/bounce/bounce-table";
import { DateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

export default function BouncePage() {
  const {
    logs,
    stats,
    loading,
    error,
    lastUpdated,
    refetch,
    dateRange,
    setDateRange,
  } = useBounce(60000);

  const {
    balances,
    loading: balancesLoading,
    refetch: refetchBalances,
  } = useBalances(60000, "0x608106fB82639099aB5EBC61D1bDBf2e1b1e1088");

  if (loading && logs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading bounce logs...</div>
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
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-bold tracking-tight">
                Bounce Arbitrage Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-3 mb-2">
              <p className="text-sm text-muted-foreground">
                {lastUpdated &&
                  `Last updated: ${new Date(lastUpdated).toLocaleString()}`}
              </p>
              <Link
                href="/"
                className="text-sm text-muted-foreground underline underline-offset-2 hover:text-foreground"
              >
                ← Hyperliquid Arb
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex gap-2 mb-2">
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
              />
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
            <div className="flex flex-wrap gap-2">
              {(["hype", "usdc", "hype3l", "hype3s", "btc3l"] as const).map(
                (token) => (
                  <div
                    key={token}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border bg-card text-card-foreground"
                  >
                    <span className="text-sm font-medium">
                      {balancesLoading ? (
                        <span className="text-muted-foreground">--</span>
                      ) : balances ? (
                        parseFloat(balances[token]).toFixed(2)
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground uppercase">
                      {token}
                    </span>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && <BounceStatsCards stats={stats} />}

        {/* Row 1: Cumulative PnL + Execution Status */}
        <div className="grid gap-6 md:grid-cols-2">
          <BounceCumulativePnlChart logs={logs} />
          <BounceStatusPieChart logs={logs} />
        </div>

        {/* Row 2: Expected vs Actual + Wallet Balance */}
        <div className="grid gap-6 md:grid-cols-2">
          <BounceExpectedVsActualChart logs={logs} />
          <BounceWalletBalanceChart logs={logs} />
        </div>

        {/* Row 3: PnL by Route + Direction */}
        <div className="grid gap-6 md:grid-cols-2">
          <BouncePnlByRouteChart logs={logs} />
          <BounceDirectionChart logs={logs} />
        </div>

        {/* Execution Log Table */}
        <BounceTable logs={logs} />
      </div>
    </div>
  );
}
