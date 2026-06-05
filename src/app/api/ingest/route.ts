import { NextRequest, NextResponse } from "next/server";
import { sql } from "@/lib/db";

const VALID_STATUSES = new Set(["executed", "skipped"]);

export async function POST(req: NextRequest) {
  const apiKey = req.headers.get("x-api-key");
  if (!apiKey || apiKey !== process.env.INGEST_API_KEY) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (
    typeof body.generatedAt !== "string" ||
    typeof body.tick !== "number" ||
    typeof body.bot !== "string" ||
    typeof body.symbol !== "string" ||
    typeof body.route !== "string" ||
    typeof body.dex !== "string" ||
    typeof body.status !== "string" ||
    !VALID_STATUSES.has(body.status)
  ) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 422 });
  }

  await sql`
    INSERT INTO bounce_executions
      (generated_at, tick, bot, symbol, route, dex, status, tx_hash, gas_used, skip_reason)
    VALUES
      (${new Date(body.generatedAt)}, ${body.tick}, ${body.bot}, ${body.symbol},
       ${body.route}, ${body.dex}, ${body.status},
       ${(body.txHash as string) ?? null},
       ${(body.gasUsed as string) ?? null},
       ${(body.reason as string) ?? null})
  `;

  return NextResponse.json({ ok: true }, { status: 201 });
}
