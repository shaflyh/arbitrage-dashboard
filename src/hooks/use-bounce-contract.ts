"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { getStartOfToday } from "@/lib/date";
import type { ContractExecutionLog, ContractStats } from "@/types/bounce-contract";
import type { DateRange } from "@/hooks/use-trades";

interface ContractResponse {
  logs: Record<string, unknown>[];
  count: number;
  lastUpdated: string;
}

function mapRow(row: Record<string, unknown>): ContractExecutionLog {
  return {
    id: String(row.id),
    createdAt: row.created_at as string,
    generatedAt: row.generated_at as string,
    tick: row.tick as number,
    bot: row.bot as string,
    symbol: row.symbol as string,
    route: row.route as string,
    dex: row.dex as string,
    status: row.status as "executed" | "skipped",
    txHash: (row.tx_hash as string) ?? null,
    gasUsed: (row.gas_used as string) ?? null,
    skipReason: (row.skip_reason as string) ?? null,
  };
}

function calculateStats(logs: ContractExecutionLog[]): ContractStats {
  if (logs.length === 0) {
    return {
      totalLogs: 0,
      totalExecuted: 0,
      totalSkipped: 0,
      executionRate: 0,
      v1Count: 0,
      v2Count: 0,
      uniqueSymbols: 0,
      topSymbol: null,
    };
  }

  const executed = logs.filter((l) => l.status === "executed");
  const skipped = logs.filter((l) => l.status === "skipped");
  const v1Count = logs.filter((l) => l.bot === "contract-v1").length;
  const v2Count = logs.filter((l) => l.bot === "contract-v2").length;

  const symbolCounts = logs.reduce<Record<string, number>>((acc, l) => {
    acc[l.symbol] = (acc[l.symbol] ?? 0) + 1;
    return acc;
  }, {});
  const uniqueSymbols = Object.keys(symbolCounts).length;
  const topSymbol =
    uniqueSymbols > 0
      ? Object.entries(symbolCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  return {
    totalLogs: logs.length,
    totalExecuted: executed.length,
    totalSkipped: skipped.length,
    executionRate: (executed.length / logs.length) * 100,
    v1Count,
    v2Count,
    uniqueSymbols,
    topSymbol,
  };
}

export function useContract(autoRefreshInterval?: number) {
  const [allLogs, setAllLogs] = useState<ContractExecutionLog[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: getStartOfToday(),
    to: null,
  });
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/contract-bot");

      if (!response.ok) {
        throw new Error("Failed to fetch contract executions");
      }

      const data: ContractResponse = await response.json();
      setAllLogs(data.logs.map(mapRow));
      setLastUpdated(data.lastUpdated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const logs = useMemo(() => {
    return allLogs.filter((log) => {
      if (!dateRange.from && !dateRange.to) return true;
      if (!log.generatedAt) return true;
      const logDate = new Date(log.generatedAt);
      if (dateRange.from && dateRange.to) {
        return logDate >= dateRange.from && logDate <= dateRange.to;
      }
      if (dateRange.from) return logDate >= dateRange.from;
      if (dateRange.to) return logDate <= dateRange.to;
      return true;
    });
  }, [allLogs, dateRange]);

  useEffect(() => {
    setStats(calculateStats(logs));
  }, [logs]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  useEffect(() => {
    if (!autoRefreshInterval) return;
    const interval = setInterval(fetchLogs, autoRefreshInterval);
    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchLogs]);

  return {
    logs,
    stats,
    loading,
    error,
    lastUpdated,
    refetch: fetchLogs,
    dateRange,
    setDateRange,
  };
}
