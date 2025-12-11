# Arbitrage Dashboard

A Next.js dashboard for visualizing arbitrage bot trade data from the HyperEVM arbitrage bot.

## Features

- **Real-time Stats**: Total profit, trade count, win rate, and average execution time
- **Cumulative Profit Chart**: Line chart showing profit accumulation over time
- **Direction Analysis**: Bar chart showing trade distribution across different DEX pairs
- **Trade History Table**: Detailed view of all trades with filtering
- **Auto-refresh**: Automatically fetches new data every 30 seconds
- **Manual Refresh**: Click the refresh button to update data immediately

## Getting Started

### Install Dependencies

```bash
cd dashboard
pnpm install
```

### Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

## How It Works

1. **Data Source**: The dashboard reads trade data from `../data/trade-history.csv`
2. **API Route**: `/api/trades` endpoint parses the CSV and returns JSON
3. **Auto-refresh**: The dashboard polls the API every 30 seconds for new data
4. **Manual Refresh**: Click the refresh button in the top-right to update immediately

## Components

- **StatsCards**: Displays key metrics (profit, trades, win rate, execution time)
- **ProfitChart**: Line chart showing cumulative profit over time
- **DirectionChart**: Bar chart showing trade count by direction
- **TradeTable**: Detailed table of all trades with profit highlighting

## Technology Stack

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **shadcn/ui**: Beautiful, accessible UI components
- **Recharts**: Declarative charting library
- **Tailwind CSS**: Utility-first CSS framework
- **Papaparse**: CSV parsing library

## File Structure

```
dashboard/
├── src/
│   ├── app/
│   │   ├── api/trades/route.ts   # API endpoint
│   │   └── page.tsx               # Main dashboard page
│   ├── components/
│   │   ├── stats-cards.tsx        # Stats overview
│   │   ├── profit-chart.tsx       # Cumulative profit chart
│   │   ├── direction-chart.tsx    # Trade direction chart
│   │   ├── trade-table.tsx        # Trade history table
│   │   └── ui/                    # shadcn/ui components
│   ├── hooks/
│   │   └── useTrades.ts           # Trade data fetching hook
│   └── types/
│       └── trade.ts               # TypeScript types
└── README.md
```

## Customization

### Change Auto-refresh Interval

Edit `src/app/page.tsx`:

```typescript
const { trades, stats, loading, error, lastUpdated, refetch } = useTrades(
  30000 // Change this value (in milliseconds)
);
```

### Modify Charts

- Edit `src/components/profit-chart.tsx` for profit visualization
- Edit `src/components/direction-chart.tsx` for direction breakdown
- Use any Recharts component (AreaChart, PieChart, etc.)

### Add More Stats

Edit `src/hooks/useTrades.ts` `calculateStats()` function to compute additional metrics.

## Troubleshooting

### "Trade history file not found" Error

Make sure the arbitrage bot has created `data/trade-history.csv` in the parent directory. Run a trade first:

```bash
cd ..
pnpm arbitrage
```

### No Data Showing

Check that:
1. The CSV file exists at `../data/trade-history.csv`
2. The file contains trade data (at least one trade)
3. The API route is working: visit [http://localhost:3000/api/trades](http://localhost:3000/api/trades)

### TypeScript Errors

Run type checking:

```bash
pnpm tsc --noEmit
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
