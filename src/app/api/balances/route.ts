import { NextResponse } from "next/server";
import { createPublicClient, http, formatEther, formatUnits } from "viem";

// HyperEVM Chain Configuration
const hyperEVM = {
  id: 999,
  name: "HyperEVM",
  nativeCurrency: {
    decimals: 18,
    name: "HYPE",
    symbol: "HYPE",
  },
  rpcUrls: {
    default: {
      http: ["https://rpc.hyperliquid.xyz/evm"],
    },
  },
} as const;

// Token Addresses
const TOKENS = {
  stHYPE: "0xfFaa4a3D97fE9107Cef8a3F48c069F577Ff76cC1",
  wstHYPE: "0x94e8396e0869c9F2200760aF0621aFd240E1CF38",
  kHYPE: "0xfD739d4e423301CE9385c1fb8850539D657C296D",
  WHYPE: "0x5555555555555555555555555555555555555555",
  USDT: "0xB8CE59FC3717ada4C02eaDF9682A9e934F625ebb",
  USDC: "0xb88339CB7199b77E23DB6E890353E22632Ba630f",
  HYPE3L: "0x9A51b0DC3545cb8e9b0382b42c91F9e39a92eFD6",
  HYPE3S: "0x176fe1F384F1b0fC2A0a270c56485eA3efc6c727",
  BTC3L: "0x7B430c5842ce7dBa29b910c018369FA2Fa0ac2e3",
} as const;

// ERC20 ABI (balanceOf function only)
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const queryAddress = searchParams.get("address");
    const walletAddress = (queryAddress || process.env.WALLET_ADDRESS) as
      | `0x${string}`
      | undefined;
    if (!walletAddress) {
      return NextResponse.json(
        { error: "WALLET_ADDRESS not configured" },
        { status: 500 },
      );
    }

    // Create public client
    const client = createPublicClient({
      chain: hyperEVM,
      transport: http(),
    });

    // Fetch all balances in parallel
    const [
      hypeBalance,
      whypeBalance,
      usdtBalance,
      usdcBalance,
      hype3lBalance,
      hype3sBalance,
      btc3lBalance,
    ] = await Promise.all([
      // HYPE (native token)
      client.getBalance({ address: walletAddress }),

      // WHYPE
      client.readContract({
        address: TOKENS.WHYPE as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [walletAddress],
      }),

      // USDT
      client.readContract({
        address: TOKENS.USDT as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [walletAddress],
      }),

      // USDC
      client.readContract({
        address: TOKENS.USDC as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [walletAddress],
      }),

      // HYPE3L
      client.readContract({
        address: TOKENS.HYPE3L as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [walletAddress],
      }),

      // HYPE3S
      client.readContract({
        address: TOKENS.HYPE3S as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [walletAddress],
      }),

      // BTC3L
      client.readContract({
        address: TOKENS.BTC3L as `0x${string}`,
        abi: ERC20_ABI,
        functionName: "balanceOf",
        args: [walletAddress],
      }),
    ]);

    // Convert to readable format
    const balances = {
      address: walletAddress,
      hype: formatEther(hypeBalance),
      whype: formatEther(whypeBalance as bigint),
      usdt: formatUnits(usdtBalance as bigint, 6),
      usdc: formatUnits(usdcBalance as bigint, 6),
      hype3l: formatEther(hype3lBalance as bigint),
      hype3s: formatEther(hype3sBalance as bigint),
      btc3l: formatEther(btc3lBalance as bigint),
      timestamp: Date.now(),
    };

    return NextResponse.json(balances);
  } catch (error) {
    console.error("Error fetching balances:", error);
    return NextResponse.json(
      { error: "Failed to fetch balances", details: String(error) },
      { status: 500 },
    );
  }
}
