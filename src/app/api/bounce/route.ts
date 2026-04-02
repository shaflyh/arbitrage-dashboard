import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import type { BounceExecutionLog } from "@/types/bounce";

interface BounceRow {
  id: number;
  generated_at: string | null;
  direction: string;
  status: string;
  target_symbol: string;
  account: string;
  size_usdc: string | number | null;
  expected_pnl_usdc: string | number | null;
  actual_pnl_usdc: string | number | null;
  gas_spent: string | number | null;
  wallet_usdc_before: string | number | null;
  wallet_usdc_after: string | number | null;
  skip_reason: string | null;
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

function toNumber(value: unknown): number {
  if (value === null || value === undefined || value === "") return 0;
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
}

function toNullableNumber(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value));
  return Number.isNaN(parsed) ? null : parsed;
}

export async function GET() {
  try {
    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase is not configured on the server" },
        { status: 500 },
      );
    }

    const PAGE_SIZE = 1000;
    let allData: BounceRow[] = [];
    let page = 0;
    let fetchError = null;

    while (true) {
      const { data: pageData, error: pageError } = await supabase
        .from("bounce_execution_logs")
        .select("*")
        .order("generated_at", { ascending: false })
        .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

      if (pageError) {
        fetchError = pageError;
        break;
      }

      if (!pageData || pageData.length === 0) break;

      allData = allData.concat(pageData);

      if (pageData.length < PAGE_SIZE) break;

      page++;
    }

    if (fetchError) {
      console.error("Error fetching bounce logs from Supabase:", fetchError);
      return NextResponse.json(
        { error: "Failed to fetch bounce logs from Supabase" },
        { status: 500 },
      );
    }

    const logs: BounceExecutionLog[] = allData.map((row: BounceRow) => ({
      id: row.id,
      generatedAt: row.generated_at ?? "",
      direction: row.direction,
      status: row.status,
      targetSymbol: row.target_symbol,
      account: row.account,
      sizeUsdc: toNumber(row.size_usdc),
      expectedPnlUsdc: toNumber(row.expected_pnl_usdc),
      actualPnlUsdc: toNullableNumber(row.actual_pnl_usdc),
      gasSpent: toNullableNumber(row.gas_spent),
      walletUsdcBefore: toNumber(row.wallet_usdc_before),
      walletUsdcAfter: toNullableNumber(row.wallet_usdc_after),
      skipReason: row.skip_reason,
    }));

    return NextResponse.json({
      logs,
      count: logs.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error handling bounce logs request:", error);
    return NextResponse.json(
      { error: "Failed to fetch bounce execution logs" },
      { status: 500 },
    );
  }
}
