"use client";

import { useContract } from "@/hooks/use-bounce-contract";
import { ContractStatsCards } from "@/components/contract/contract-stats-cards";
import { ContractExecutionsChart } from "@/components/contract/contract-executions-chart";
import { ContractStatusPieChart } from "@/components/contract/contract-status-pie-chart";
import { ContractRouteChart } from "@/components/contract/contract-route-chart";
import { ContractBotChart } from "@/components/contract/contract-bot-chart";
import { ContractSymbolChart } from "@/components/contract/contract-symbol-chart";
import { ContractTable } from "@/components/contract/contract-table";
import { DateRangePicker } from "@/components/date-range-picker";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import Link from "next/link";

export default function ContractPage() {
  const {
    logs,
    stats,
    loading,
    error,
    lastUpdated,
    refetch,
    dateRange,
    setDateRange,
  } = useContract(60000);

  if (loading && logs.length === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-lg">Loading contract executions...</div>
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
                Contract Bot Executions
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
                ← Home
              </Link>
            </div>
          </div>
          <div className="flex gap-2">
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            <Button
              onClick={refetch}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && <ContractStatsCards stats={stats} />}

        {/* Row 1: Executions Over Time + Status Pie */}
        <div className="grid gap-6 md:grid-cols-2">
          <ContractExecutionsChart logs={logs} />
          <ContractStatusPieChart logs={logs} />
        </div>

        {/* Row 2: Route Split + Bot Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <ContractRouteChart logs={logs} />
          <ContractBotChart logs={logs} />
        </div>

        {/* Row 3: Symbol Bar Chart (full width) */}
        <ContractSymbolChart logs={logs} />

        {/* Execution Log Table */}
        <ContractTable logs={logs} />
      </div>
    </div>
  );
}
