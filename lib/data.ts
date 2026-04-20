export const DEMO_ADDRESS = "0x96a2e1Cb03128DC4cD2b5D9502F0AaB8E9a9e856";

export type Position = {
  name: string;
  kind: "supply" | "borrow";
  balanceUsd: number;
  apyPct: number;
  chain: "Base" | "Ethereum";
};

export const positions: Position[] = [
  { name: "Steakhouse USDC", kind: "supply", balanceUsd: 60000, apyPct: 8.1, chain: "Base" },
  { name: "Gauntlet WETH Core", kind: "supply", balanceUsd: 82100, apyPct: 4.8, chain: "Ethereum" },
  { name: "WETH / USDC market", kind: "borrow", balanceUsd: 13680, apyPct: -5.2, chain: "Base" },
];

export const summary = {
  netWorthUsd: 128420,
  suppliedUsd: 142100,
  borrowedUsd: 13680,
  netApyPct: 6.42,
};

export type ActivityAction = "Supply" | "Borrow" | "Withdraw" | "Repay";
export type ActivityRow = {
  action: ActivityAction;
  asset: string;
  amountUsd: number;
  chain: "Base" | "Ethereum";
  date: string;
};

export const activity: ActivityRow[] = [
  { action: "Supply", asset: "USDC",  amountUsd: 20000, chain: "Base",     date: "2026-04-18" },
  { action: "Borrow", asset: "USDC",  amountUsd:  5000, chain: "Base",     date: "2026-04-15" },
  { action: "Supply", asset: "WETH",  amountUsd: 40000, chain: "Ethereum", date: "2026-04-10" },
  { action: "Repay",  asset: "USDC",  amountUsd:  1500, chain: "Base",     date: "2026-04-02" },
  { action: "Withdraw", asset: "USDC", amountUsd: 3000, chain: "Base",     date: "2026-03-28" },
  { action: "Supply", asset: "USDC",  amountUsd: 40000, chain: "Base",     date: "2026-03-22" },
];

export const aiSummaryParagraphs: string[] = [
  "Your wallet holds **$142K in supplied assets** across two vaults, with a moderate **$13.7K borrow** against WETH collateral on Base. Your overall net APY of **+6.42%** is driven primarily by Steakhouse USDC, which accounts for roughly 42% of your deployed capital.",
  "The portfolio is **concentrated in stablecoin yield**, which has historically been lower-variance but exposes you to stablecoin-specific risks (peg deviation, underlying collateral composition of vaults). Your ETH exposure is primarily indirect through Gauntlet WETH Core.",
  "**Risk exposure is currently healthy.** Your borrow position on Base has a health factor of 1.82 — comfortable but worth monitoring if ETH moves sharply downward. A 30% drop in ETH would push health factor below 1.3.",
  "Consider diversifying across additional vault curators or chains if you want to reduce concentration risk. Your current setup is well-suited for a moderate-risk yield profile.",
];
