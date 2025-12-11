"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import type { Trade, TradeStats } from "@/types/trade";

interface TradesResponse {
  trades: Trade[];
  count: number;
  lastUpdated: string;
}

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export function useTrades(autoRefreshInterval?: number) {
  const [allTrades, setAllTrades] = useState<Trade[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({ from: null, to: null });
  const [stats, setStats] = useState<TradeStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const fetchTrades = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/trades");

      if (!response.ok) {
        throw new Error("Failed to fetch trades");
      }

      const data: TradesResponse = await response.json();
      setAllTrades(data.trades);
      setLastUpdated(data.lastUpdated);

      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter trades based on date range
  const trades = useMemo(() => {
    if (!dateRange.from && !dateRange.to) {
      return allTrades;
    }

    return allTrades.filter((trade) => {
      const tradeDate = new Date(trade.timestamp);

      if (dateRange.from && dateRange.to) {
        return tradeDate >= dateRange.from && tradeDate <= dateRange.to;
      }

      if (dateRange.from) {
        return tradeDate >= dateRange.from;
      }

      if (dateRange.to) {
        return tradeDate <= dateRange.to;
      }

      return true;
    });
  }, [allTrades, dateRange]);

  // Calculate stats based on filtered trades
  useEffect(() => {
    const calculatedStats = calculateStats(trades);
    setStats(calculatedStats);
  }, [trades]);

  // Initial fetch
  useEffect(() => {
    fetchTrades();
  }, [fetchTrades]);

  // Auto-refresh
  useEffect(() => {
    if (!autoRefreshInterval) return;

    const interval = setInterval(() => {
      fetchTrades();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  }, [autoRefreshInterval, fetchTrades]);

  return {
    trades,
    stats,
    loading,
    error,
    lastUpdated,
    refetch: fetchTrades,
    dateRange,
    setDateRange,
  };
}

function calculateStats(trades: Trade[]): TradeStats {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      totalProfit: 0,
      averageProfit: 0,
      winRate: 0,
      totalVolume: 0,
      averageExecutionTime: 0,
    };
  }

  const totalProfit = trades.reduce((sum, t) => sum + (t.netProfit || 0), 0);
  const profitableTrades = trades.filter((t) => (t.netProfit || 0) > 0).length;
  const totalVolume = trades.reduce((sum, t) => sum + (t.tradeSize || 0), 0);
  const totalExecutionTime = trades.reduce((sum, t) => sum + (t.executionTimeMs || 0), 0);

  return {
    totalTrades: trades.length,
    totalProfit,
    averageProfit: totalProfit / trades.length,
    winRate: (profitableTrades / trades.length) * 100,
    totalVolume,
    averageExecutionTime: totalExecutionTime / trades.length,
  };
}
