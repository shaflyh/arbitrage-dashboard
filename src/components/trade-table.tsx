"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Trade } from "@/types/trade";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface TradeTableProps {
  trades: Trade[];
}

export function TradeTable({ trades }: TradeTableProps) {
  const [showAll, setShowAll] = useState(false);
  const displayedTrades = showAll ? trades : trades.slice(0, 10);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Trades</CardTitle>
        <CardDescription>
          {showAll ? "All trades" : "Latest 10 trades"} ({trades.length} total)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead>Direction</TableHead>
                <TableHead className="text-right">Size</TableHead>
                <TableHead className="text-right">Net Profit</TableHead>
                <TableHead className="text-right">Profit %</TableHead>
                <TableHead className="text-right">Gas (Gwei)</TableHead>
                <TableHead className="text-right">Execution</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayedTrades.map((trade, idx) => {
                const isProfit = (trade.netProfit || 0) > 0;
                return (
                  <TableRow key={idx}>
                    <TableCell className="font-mono text-sm">
                      {new Date(trade.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="whitespace-nowrap">
                        {trade.direction.replace("_TO_", " → ")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {trade.tradeSize.toFixed(4)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isProfit ? "+" : ""}
                      {(trade.netProfit || 0).toFixed(6)}
                    </TableCell>
                    <TableCell
                      className={`text-right font-mono ${
                        isProfit ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {isProfit ? "+" : ""}
                      {(trade.profitPercentage || 0).toFixed(4)}%
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {(trade.gasPriceGwei || 0).toFixed(6)}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {(trade.executionTimeMs || 0).toFixed(0)}ms
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
        {trades.length > 10 && (
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={() => setShowAll(!showAll)}>
              {showAll ? "Show Less" : `Show All (${trades.length} trades)`}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
