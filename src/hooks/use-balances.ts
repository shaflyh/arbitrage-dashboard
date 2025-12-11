import { useState, useEffect, useCallback } from "react";

interface WalletBalances {
  address: string;
  whype: string;
  usdt: string;
  timestamp: number;
}

interface UseBalancesReturn {
  balances: WalletBalances | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useBalances(refreshIntervalMs?: number): UseBalancesReturn {
  const [balances, setBalances] = useState<WalletBalances | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBalances = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/balances");

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch balances");
      }

      const data = await response.json();
      setBalances(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Error fetching balances:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial fetch
  useEffect(() => {
    fetchBalances();
  }, [fetchBalances]);

  // Auto-refresh
  useEffect(() => {
    if (!refreshIntervalMs) return;

    const interval = setInterval(() => {
      fetchBalances();
    }, refreshIntervalMs);

    return () => clearInterval(interval);
  }, [refreshIntervalMs, fetchBalances]);

  return {
    balances,
    loading,
    error,
    refetch: fetchBalances,
  };
}
