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
  "Your wallet holds **$142K in supplied assets** across two vaults, with a moderate **$13.7K borrow**. Net APY **+6.42%**, driven primarily by Steakhouse USDC (~42% of deployed capital).",
  "The portfolio is **concentrated in stablecoin yield** — historically lower-variance but with stablecoin-specific risks (peg deviation, vault collateral composition). Your ETH exposure is primarily indirect through Gauntlet WETH Core.",
  "**Risk is healthy.** Health factor sits at **1.82**, and a 30% drop in ETH would push it to roughly **1.28** — still above the 1.0 liquidation threshold. Diversifying across more vault curators or chains would reduce concentration risk.",
];

export type AllocationSlice = { name: string; valueUsd: number; pct: number; color: string };
export const allocationData: AllocationSlice[] = [
  { name: "Steakhouse USDC",    valueUsd: 60000, pct: 42, color: "#4ade80" },
  { name: "Gauntlet WETH Core", valueUsd: 82100, pct: 58, color: "#60a5fa" },
];

export const healthFactor = 1.82;

export type RiskScores = {
  concentration: number;
  liquidation: number;
  yieldQuality: number;
  chainDiversity: number;
  assetDiversity: number;
};
export const riskScores: RiskScores = {
  concentration:  6.5,
  liquidation:    3.0,
  yieldQuality:   7.5,
  chainDiversity: 5.0,
  assetDiversity: 4.0,
};

export type ApyContributionSlice = { name: string; pts: number; color: string };
export const apyContribution: ApyContributionSlice[] = [
  { name: "Steakhouse USDC",    pts:  4.9, color: "#4ade80" },
  { name: "Gauntlet WETH Core", pts:  2.0, color: "#60a5fa" },
  { name: "WETH / USDC borrow", pts: -0.5, color: "#f87171" },
];

export type ChainSlice = { name: string; pct: number; color: string };
export const chainDistribution: ChainSlice[] = [
  { name: "Base",     pct: 52, color: "#60a5fa" },
  { name: "Ethereum", pct: 48, color: "#a78bfa" },
];

export type StressPoint = { ethDropPct: number; hf: number };
export const stressCurve: StressPoint[] = [
  { ethDropPct:  0, hf: 1.82 },
  { ethDropPct: 10, hf: 1.62 },
  { ethDropPct: 20, hf: 1.45 },
  { ethDropPct: 30, hf: 1.28 },
  { ethDropPct: 40, hf: 1.12 },
  { ethDropPct: 50, hf: 0.96 },
];
