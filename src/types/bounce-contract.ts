export interface ContractExecutionLog {
  id: string;
  createdAt: string;
  generatedAt: string;
  tick: number;
  bot: string;
  symbol: string;
  route: string;
  dex: string;
  status: "executed" | "skipped";
  txHash: string | null;
  gasUsed: string | null;
  skipReason: string | null;
}

export interface ContractStats {
  totalLogs: number;
  totalExecuted: number;
  totalSkipped: number;
  executionRate: number;
  v1Count: number;
  v2Count: number;
  uniqueSymbols: number;
  topSymbol: string | null;
}
