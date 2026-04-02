export interface BounceExecutionLog {
  id: number;
  generatedAt: string;
  direction: string; // 'buy-redeem' | 'mint-sell'
  status: string; // 'executed' | 'skipped'
  targetSymbol: string;
  account: string;
  sizeUsdc: number;
  expectedPnlUsdc: number;
  actualPnlUsdc: number | null;
  gasSpent: number | null;
  walletUsdcBefore: number;
  walletUsdcAfter: number | null;
  skipReason: string | null;
}

export interface BounceStats {
  totalLogs: number;
  totalExecuted: number;
  totalSkipped: number;
  executionRate: number;
  totalActualPnl: number;
  totalExpectedPnl: number;
  totalGasSpent: number;
  avgPnlPerExecution: number;
  netPnlAfterGas: number;
}
