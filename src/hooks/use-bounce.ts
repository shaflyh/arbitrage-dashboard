"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { BounceExecutionLog, BounceStats } from "@/types/bounce";
import type { DateRange } from "@/hooks/use-trades";

interface BounceResponse {
  logs: BounceExecutionLog[];
  count: number;
  lastUpdated: string;
}

export function useBounce(autoRefreshInterval?: number) {
  const [allLogs, setAllLogs] = useState<BounceExecutionLog[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: null,
    to: null,
  });
  const [stats, setStats] = useState<BounceStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/bounce");

      if (!response.ok) {
        throw new Error("Failed to fetch bounce logs");
      }

      const data: BounceResponse = await response.json();
      setAllLogs(data.logs);
      setLastUpdated(data.lastUpdated);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  const logs = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return allLogs;

    return allLogs.filter((log) => {
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

function calculateStats(logs: BounceExecutionLog[]): BounceStats {
  if (logs.length === 0) {
    return {
      totalLogs: 0,
      totalExecuted: 0,
      totalSkipped: 0,
      executionRate: 0,
      totalActualPnl: 0,
      totalExpectedPnl: 0,
      totalGasSpent: 0,
      avgPnlPerExecution: 0,
      netPnlAfterGas: 0,
    };
  }

  const executed = logs.filter((l) => l.status === "executed");
  const skipped = logs.filter((l) => l.status === "skipped");

  const totalActualPnl = executed.reduce(
    (sum, l) => sum + (l.actualPnlUsdc ?? 0),
    0,
  );
  const totalGasSpent = executed.reduce(
    (sum, l) => sum + (l.gasSpent ?? 0),
    0,
  );
  const totalExpectedPnl = logs.reduce(
    (sum, l) => sum + (l.expectedPnlUsdc ?? 0),
    0,
  );

  return {
    totalLogs: logs.length,
    totalExecuted: executed.length,
    totalSkipped: skipped.length,
    executionRate: (executed.length / logs.length) * 100,
    totalActualPnl,
    totalExpectedPnl,
    totalGasSpent,
    avgPnlPerExecution:
      executed.length > 0 ? totalActualPnl / executed.length : 0,
    netPnlAfterGas: totalActualPnl - totalGasSpent,
  };
}
