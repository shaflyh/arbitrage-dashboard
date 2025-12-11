export interface Trade {
  timestamp: number;
  datetime: string;
  direction: string;
  tradeSize: number;
  whypeSpent: number;
  whypeReceived: number;
  netWhypeChange: number;
  whypeBalanceBefore: number;
  whypeBalanceAfter: number;
  intermediateToken: string;
  intermediateQuoted: number;
  intermediateReceived: number;
  intermediateSpent: number;
  buyLegQuoted: number;
  buyLegActual: number;
  buyLegSlippageBps: number;
  sellLegQuoted: number;
  sellLegActual: number;
  sellLegSlippageBps: number;
  opportunityBps: number;
  grossProfit: number;
  grossProfitBps: number;
  netProfit: number;
  netProfitBps: number;
  profitPercentage: number;
  gasPriceGwei: number;
  buyLegGas: number;
  sellLegGas: number;
  totalGas: number;
  gasBps: number;
  buyTxHash: string;
  sellTxHash: string;
  buyBlockNumber: number;
  sellBlockNumber: number;
  buyDex: string;
  sellDex: string;
  buyPrice: number;
  sellPrice: number;
  effectiveRate: number;
  breakevenTradeSize: number;
  executionTimeMs: number;
}

export interface TradeStats {
  totalTrades: number;
  totalProfit: number;
  averageProfit: number;
  winRate: number;
  totalVolume: number;
  averageExecutionTime: number;
}
