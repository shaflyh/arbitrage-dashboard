import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { Trade } from "@/types/trade";

interface TradeRow {
  id: number;
  timestamp: number | string;
  datetime: string;
  direction: string;
  trade_size: string | number | null;
  whype_spent: string | number | null;
  whype_received: string | number | null;
  net_whype_change: string | number | null;
  whype_balance_before: string | number | null;
  whype_balance_after: string | number | null;
  intermediate_token: string;
  intermediate_quoted: string | number | null;
  intermediate_received: string | number | null;
  intermediate_spent: string | number | null;
  buy_leg_quoted: string | number | null;
  buy_leg_actual: string | number | null;
  buy_leg_slippage_bps: number | string;
  sell_leg_quoted: string | number | null;
  sell_leg_actual: string | number | null;
  sell_leg_slippage_bps: number | string;
  opportunity_bps: number | string;
  gross_profit: string | number | null;
  gross_profit_bps: number | string;
  net_profit: string | number | null;
  net_profit_bps: number | string;
  profit_percentage: number | string;
  gas_price_gwei: number | string;
  buy_leg_gas: string | number | null;
  sell_leg_gas: string | number | null;
  total_gas: string | number | null;
  gas_bps: number | string;
  buy_tx_hash: string;
  sell_tx_hash: string;
  buy_block_number: number | string;
  sell_block_number: number | string;
  buy_dex: string;
  sell_dex: string;
  buy_price: number | string;
  sell_price: number | string;
  effective_rate: number | string;
  breakeven_trade_size: string | number | null;
  execution_time_ms: number | string;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error(
    "Supabase environment variables SUPABASE_URL and SUPABASE_ANON_KEY must be set"
  );
}

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("trades")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Error fetching trades from Supabase:", error);
      return NextResponse.json(
        { error: "Failed to fetch trades from Supabase" },
        { status: 500 }
      );
    }

    const trades: Trade[] =
      data?.map((row: TradeRow) => ({
        timestamp: Number(row.timestamp),
        datetime: row.datetime,
        direction: row.direction,
        tradeSize: toNumber(row.trade_size),
        whypeSpent: toNumber(row.whype_spent),
        whypeReceived: toNumber(row.whype_received),
        netWhypeChange: toNumber(row.net_whype_change),
        whypeBalanceBefore: toNumber(row.whype_balance_before),
        whypeBalanceAfter: toNumber(row.whype_balance_after),
        intermediateToken: row.intermediate_token,
        intermediateQuoted: toNumber(row.intermediate_quoted),
        intermediateReceived: toNumber(row.intermediate_received),
        intermediateSpent: toNumber(row.intermediate_spent),
        buyLegQuoted: toNumber(row.buy_leg_quoted),
        buyLegActual: toNumber(row.buy_leg_actual),
        buyLegSlippageBps: toNumber(row.buy_leg_slippage_bps),
        sellLegQuoted: toNumber(row.sell_leg_quoted),
        sellLegActual: toNumber(row.sell_leg_actual),
        sellLegSlippageBps: toNumber(row.sell_leg_slippage_bps),
        opportunityBps: toNumber(row.opportunity_bps),
        grossProfit: toNumber(row.gross_profit),
        grossProfitBps: toNumber(row.gross_profit_bps),
        netProfit: toNumber(row.net_profit),
        netProfitBps: toNumber(row.net_profit_bps),
        profitPercentage: toNumber(row.profit_percentage),
        gasPriceGwei: toNumber(row.gas_price_gwei),
        buyLegGas: toNumber(row.buy_leg_gas),
        sellLegGas: toNumber(row.sell_leg_gas),
        totalGas: toNumber(row.total_gas),
        gasBps: toNumber(row.gas_bps),
        buyTxHash: row.buy_tx_hash,
        sellTxHash: row.sell_tx_hash,
        buyBlockNumber: toNumber(row.buy_block_number),
        sellBlockNumber: toNumber(row.sell_block_number),
        buyDex: row.buy_dex,
        sellDex: row.sell_dex,
        buyPrice: toNumber(row.buy_price),
        sellPrice: toNumber(row.sell_price),
        effectiveRate: toNumber(row.effective_rate),
        breakevenTradeSize: toNumber(row.breakeven_trade_size),
        executionTimeMs: toNumber(row.execution_time_ms),
      })) ?? [];

    return NextResponse.json({
      trades,
      count: trades.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error handling trades request:", error);
    return NextResponse.json(
      { error: "Failed to fetch trade history" },
      { status: 500 }
    );
  }
}
