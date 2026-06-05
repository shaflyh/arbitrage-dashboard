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
import type { ContractExecutionLog } from "@/types/bounce-contract";
import { useState } from "react";

function truncateTxHash(hash: string): string {
  return `${hash.slice(0, 8)}...${hash.slice(-4)}`;
}

export function ContractTable({ logs }: { logs: ContractExecutionLog[] }) {
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
                <TableHead>Bot</TableHead>
                <TableHead>Symbol</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>DEX</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tx Hash</TableHead>
                <TableHead>Skip Reason</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.map((log) => {
                const isExecuted = log.status === "executed";
                return (
                  <TableRow key={log.id}>
                    <TableCell className="font-mono text-sm whitespace-nowrap">
                      {new Date(log.generatedAt).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="whitespace-nowrap">
                        {log.bot}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{log.symbol}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.route}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {log.dex}
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
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {log.txHash ? (
                        <a
                          href={`https://hyperevmscan.io/tx/${log.txHash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline underline-offset-2 hover:text-foreground"
                        >
                          {truncateTxHash(log.txHash)}
                        </a>
                      ) : (
                        "—"
                      )}
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
