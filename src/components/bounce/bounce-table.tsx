"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { BounceExecutionLog } from "@/types/bounce";
import { useState } from "react";

interface BounceTableProps {
  logs: BounceExecutionLog[];
}

export function BounceTable({ logs }: BounceTableProps) {
  const [showAll, setShowAll] = useState(false);
  const displayed = showAll ? logs : logs.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Execution Logs</CardTitle>
        <CardDescription>
          {showAll ? "All logs" : "Latest 10 logs"} ({logs.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Size (USDC)</TableHead>
                <TableHead className="text-right">Expected PnL</TableHead>
                <TableHead className="text-right">Actual PnL</TableHead>
                <TableHead className="text-right">Gas (HYPE)</TableHead>
                <TableHead className="text-right">Net PnL</TableHead>
                <TableHead className="text-right">Wallet Before</TableHead>
                <TableHead>Skip Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.map((log) => {
                const isExecuted = log.status === "executed";
                const actualPnl = log.actualPnlUsdc ?? null;
                const gas = log.gasSpent ?? 0;
                const netPnl = actualPnl !== null ? actualPnl - gas : null;
                const netPositive = netPnl !== null && netPnl >= 0;

                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {log.generatedAt
                        ? new Date(log.generatedAt).toLocaleString()
                        : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="whitespace-nowrap">
                        {log.direction}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isExecuted ? "default" : "secondary"}
                        className={
                          isExecuted
                            ? "bg-green-600 text-white hover:bg-green-700"
                            : "bg-muted text-muted-foreground"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${log.sizeUsdc.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      ${log.expectedPnlUsdc.toFixed(4)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        actualPnl === null
                          ? "text-muted-foreground"
                          : actualPnl >= 0
                            ? "text-green-500"
                            : "text-red-500"
                      }`}
                    >
                      {actualPnl !== null ? `$${actualPnl.toFixed(4)}` : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {gas > 0 ? `${gas.toFixed(4)}` : "—"}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono font-semibold ${
                        netPnl === null
                          ? "text-muted-foreground"
                          : netPositive
                            ? "text-green-500"
                            : "text-red-500"
                      }`}
                    >
                      {netPnl !== null
                        ? `${netPositive ? "+" : ""}$${netPnl.toFixed(4)}`
                        : "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      ${log.walletUsdcBefore.toFixed(2)}
                    </TableCell>
                    <TableCell
                      className="text-sm text-muted-foreground max-w-40 truncate"
                      title={log.skipReason ?? ""}
                    >
                      {log.skipReason ?? "—"}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {logs.length > 10 && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : `Show All (${logs.length} logs)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
