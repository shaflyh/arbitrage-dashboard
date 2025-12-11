import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import type { Trade } from "@/types/trade";

export async function GET() {
  try {
    // Read CSV from parent project's data folder
    const csvPath = path.join(process.cwd(), "../data/trade-history.csv");

    // Check if file exists
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ error: "Trade history file not found" }, { status: 404 });
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");

    // Parse CSV
    const parsed = Papa.parse<Trade>(fileContent, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
    });

    // Filter out any invalid rows
    const trades = parsed.data.filter((trade) => trade.timestamp && trade.direction);

    // Sort by timestamp descending (newest first)
    trades.sort((a, b) => b.timestamp - a.timestamp);

    return NextResponse.json({
      trades,
      count: trades.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error reading trade history:", error);
    return NextResponse.json({ error: "Failed to read trade history" }, { status: 500 });
  }
}
