#!/usr/bin/env tsx
// Analyze and rank all arb routes by return and frequency.
// Usage: pnpm analyze-pairs

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_ANON_KEY in environment.");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

interface TradeRow {
  intermediate_token: string;
  buy_dex: string;
  sell_dex: string;
  net_profit: string | number | null;
  net_profit_bps: string | number | null;
  opportunity_bps: string | number | null;
  timestamp: string | number;
}

interface RouteSummary {
  rank: number;
  pair: string;
  route: string;
  count: number;
  totalNetProfit: number;
  avgNetProfitBps: number;
  avgOpportunityBps: number;
  winRate: number;
}

async function fetchAllTrades(): Promise<TradeRow[]> {
  const PAGE_SIZE = 1000;
  let all: TradeRow[] = [];
  let page = 0;

  while (true) {
    const { data, error } = await supabase
      .from("trades")
      .select(
        "intermediate_token, buy_dex, sell_dex, net_profit, net_profit_bps, opportunity_bps, timestamp",
      )
      .order("timestamp", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error) {
      console.error("Error fetching trades:", error.message);
      process.exit(1);
    }

    if (!data || data.length === 0) break;
    all = all.concat(data as TradeRow[]);
    if (data.length < PAGE_SIZE) break;
    page++;
  }

  return all;
}

function toNumber(v: unknown): number {
  if (v === null || v === undefined || v === "") return 0;
  const n = parseFloat(String(v));
  return isNaN(n) ? 0 : n;
}

function analyzeRoutes(trades: TradeRow[]): RouteSummary[] {
  const byRoute: Record<
    string,
    {
      pair: string;
      route: string;
      count: number;
      totalNetProfit: number;
      totalNetProfitBps: number;
      totalOpportunityBps: number;
      wins: number;
    }
  > = {};

  for (const t of trades) {
    const token = t.intermediate_token || "UNKNOWN";
    const pair = `WHYPE/${token}`;
    const route = `${t.buy_dex} → ${t.sell_dex}`;
    const key = `${pair} | ${route}`;

    const netProfit = toNumber(t.net_profit);
    const netProfitBps = toNumber(t.net_profit_bps);
    const opportunityBps = toNumber(t.opportunity_bps);

    if (!byRoute[key]) {
      byRoute[key] = {
        pair,
        route,
        count: 0,
        totalNetProfit: 0,
        totalNetProfitBps: 0,
        totalOpportunityBps: 0,
        wins: 0,
      };
    }

    const entry = byRoute[key];
    entry.count++;
    entry.totalNetProfit += netProfit;
    entry.totalNetProfitBps += netProfitBps;
    entry.totalOpportunityBps += opportunityBps;
    if (netProfit > 0) entry.wins++;
  }

  return Object.values(byRoute)
    .map((e) => ({
      rank: 0,
      pair: e.pair,
      route: e.route,
      count: e.count,
      totalNetProfit: e.totalNetProfit,
      avgNetProfitBps: e.totalNetProfitBps / e.count,
      avgOpportunityBps: e.totalOpportunityBps / e.count,
      winRate: (e.wins / e.count) * 100,
    }))
    .sort((a, b) => b.totalNetProfit - a.totalNetProfit)
    .map((e, i) => ({ ...e, rank: i + 1 }));
}

function printTable(routes: RouteSummary[]): void {
  console.log("\n=== ALL ARB ROUTES RANKED BY TOTAL NET PROFIT ===\n");

  const header = [
    "Rank",
    "Pair",
    "Route",
    "Trades",
    "Win Rate",
    "Avg Opp (bps)",
    "Avg Net (bps)",
    "Total Net Profit",
  ];

  const rows = routes.map((r) => [
    `#${r.rank}`,
    r.pair,
    r.route,
    r.count.toString(),
    `${r.winRate.toFixed(1)}%`,
    r.avgOpportunityBps.toFixed(2),
    r.avgNetProfitBps.toFixed(2),
    r.totalNetProfit.toFixed(6),
  ]);

  const colWidths = header.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => r[i].length)),
  );

  const line = colWidths.map((w) => "-".repeat(w + 2)).join("+");
  const fmt = (row: string[]) =>
    row.map((cell, i) => cell.padStart(colWidths[i])).join(" | ");

  console.log(line);
  console.log(fmt(header));
  console.log(line);
  for (const row of rows) console.log(fmt(row));
  console.log(line);

  const totalProfit = routes.reduce((sum, r) => sum + r.totalNetProfit, 0);
  const totalTrades = routes.reduce((sum, r) => sum + r.count, 0);
  console.log(
    `${"TOTAL".padStart(colWidths[0])} | ${"".padStart(colWidths[1])} | ${"".padStart(colWidths[2])} | ${totalTrades.toString().padStart(colWidths[3])} | ${"".padStart(colWidths[4])} | ${"".padStart(colWidths[5])} | ${"".padStart(colWidths[6])} | ${totalProfit.toFixed(6).padStart(colWidths[7])}`,
  );
  console.log(line);

  console.log(`\nTotal routes: ${routes.length}`);
}

async function main() {
  const trades = await fetchAllTrades();
  console.log(`Fetched ${trades.length} trades total.`);

  // Debug: show any trades with missing fields that could create unexpected groupings
  const oddTrades = trades.filter(
    (t) => !t.intermediate_token || !t.buy_dex || !t.sell_dex,
  );
  if (oddTrades.length > 0) {
    console.log(
      `\nWarning: ${oddTrades.length} trades with missing token/dex fields:`,
    );
    const oddGroups: Record<string, number> = {};
    for (const t of oddTrades) {
      const key = `token=${t.intermediate_token ?? "null"} buy=${t.buy_dex ?? "null"} sell=${t.sell_dex ?? "null"}`;
      oddGroups[key] = (oddGroups[key] ?? 0) + 1;
    }
    for (const [k, v] of Object.entries(oddGroups))
      console.log(`  ${k}  count: ${v}`);
  }

  const routes = analyzeRoutes(trades);
  printTable(routes);
}

main();
