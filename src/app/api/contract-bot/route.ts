import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = from
      ? new Date(from)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    const rows = await sql`
      SELECT *
      FROM bounce_executions
      WHERE generated_at >= ${fromDate}
        AND generated_at <= ${toDate}
      ORDER BY generated_at DESC
      LIMIT 2000
    `;

    return NextResponse.json({
      logs: rows,
      count: rows.length,
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching bounce executions:", error);
    return NextResponse.json(
      { error: "Failed to fetch executions" },
      { status: 500 },
    );
  }
}
