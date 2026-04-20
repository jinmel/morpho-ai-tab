# Enriched AI Tab with Charts — Design Spec

**Date:** 2026-04-20
**Status:** Approved, ready for implementation plan
**Supersedes (for the AI tab only):** The AI tab section of `2026-04-20-morpho-dashboard-mockup-design.md`. Positions, Activity, and dashboard shell are unchanged.

## Purpose

Enrich the existing AI tab (`components/AISummary.tsx`) by adding six charts alongside the narrative prose. Purpose is still showcasing the AI tab idea to a Morpho designer — charts give the designer more to react to and signal that "AI analysis" is more than just wall-of-text.

## Tech Stack Addition

- **Recharts** (`recharts` npm package) for Allocation Donut, APY Contribution Bar, Chain Distribution, Liquidation Stress Curve.
- **Hand-rolled inline SVG** inside React components for Health Factor Gauge and Risk Score Radar (library defaults look generic for these two).
- All data remains hardcoded in `lib/data.ts` (or a new `lib/ai-data.ts` — implementer's call during planning).

## Layout

Top to bottom inside the AI tab, all contained within the existing `AISummary` component's area:

1. **Header row** (unchanged) — sparkle icon, "Portfolio Summary" title, subtitle, visual-only Regenerate button.
2. **Hero row** — 3-column grid:
   - **Health Factor Gauge** (semicircle, red/amber/green zones, needle at 1.82, big numeric value below)
   - **Allocation Donut** (supplied-capital split: Steakhouse 42% / Gauntlet 58%, legend below)
   - **Risk Score Radar** (5 axes: Concentration / Liquidation / Yield Quality / Chain Diversity / Asset Diversity, filled polygon for current scores)
3. **Narrative block** — same card as today, but condensed to 3 paragraphs (was 4) so the tab doesn't get too tall. Prose remains the analyst-style summary.
4. **Secondary row** — 2-column grid, `2fr 1fr` split:
   - **Net APY Contribution Bar** (horizontal stacked bar showing each position's contribution toward the +6.42% net APY; borrow position shown as negative segment)
   - **Chain Distribution** (small horizontal bar, Base vs Ethereum)
5. **Full-width** — **Liquidation Stress Curve** (line chart: x = ETH price drop 0% → -50%, y = health factor; marks `HF = 1.0` dashed line; annotates current point and the -30% scenario referenced in the narrative)
6. **Disclaimer** (unchanged).

## Component Decomposition

Each chart becomes its own component file. Keeps files small, each has one responsibility, easy to swap independently.

- `components/charts/HealthGauge.tsx` — hand-rolled SVG
- `components/charts/AllocationDonut.tsx` — Recharts `PieChart`
- `components/charts/RiskRadar.tsx` — hand-rolled SVG
- `components/charts/ApyContributionBar.tsx` — Recharts horizontal stacked bar
- `components/charts/ChainDistribution.tsx` — Recharts horizontal stacked bar (or simple flex divs if Recharts is overkill at this size)
- `components/charts/StressCurve.tsx` — Recharts `LineChart`
- `components/charts/ChartCard.tsx` — tiny wrapper that provides the consistent card shell (dark surface, border, rounded, label header). All six chart components accept `children` via this wrapper, or the wrapper is composed at the tab level.

Updated:
- `components/AISummary.tsx` — shortened to assemble the new layout from the chart components plus the narrative. Becomes layout-only; chart internals live in their own files.

## Data Additions

Add to `lib/data.ts` (or a sibling file `lib/ai-data.ts`):

```ts
// Allocation donut: supply-side capital only
export const allocationData = [
  { name: "Steakhouse USDC", valueUsd: 60000,  pct: 42, color: "#4ade80" },
  { name: "Gauntlet WETH Core", valueUsd: 82100, pct: 58, color: "#60a5fa" },
];

// Health factor (matches AI prose)
export const healthFactor = 1.82;

// Risk radar: 0-10 scores
export const riskScores = {
  concentration: 6.5,  // high = concentrated = worse
  liquidation:   3.0,  // higher = closer to liquidation
  yieldQuality:  7.5,  // higher = better yield quality
  chainDiversity: 5.0, // higher = more chains
  assetDiversity: 4.0, // higher = more assets
};

// APY contribution to net APY (percentage points)
export const apyContribution = [
  { name: "Steakhouse USDC", pts:  4.9, color: "#4ade80" },
  { name: "Gauntlet WETH Core", pts:  2.0, color: "#60a5fa" },
  { name: "WETH / USDC borrow", pts: -0.5, color: "#f87171" },
];

// Chain distribution (supply-side dollars)
export const chainDistribution = [
  { name: "Base",     pct: 52, color: "#60a5fa" },
  { name: "Ethereum", pct: 48, color: "#a78bfa" },
];

// Stress curve: health factor as ETH drops
export const stressCurve = [
  { ethDropPct: 0,   hf: 1.82 },
  { ethDropPct: 10,  hf: 1.62 },
  { ethDropPct: 20,  hf: 1.45 },
  { ethDropPct: 30,  hf: 1.28 },
  { ethDropPct: 40,  hf: 1.12 },
  { ethDropPct: 50,  hf: 0.96 }, // below liquidation
];
```

Values are chosen to match the narrative prose (health 1.82, -30% → ~1.28, ~42% in Steakhouse, etc.). Reasonable approximation — not derived from a lending-protocol formula.

## Narrative Update

Trim the AI summary from 4 to 3 paragraphs. Rationale: with six charts present, the narrative doesn't need to carry as much data — it should add interpretation, not repeat numbers already visualized.

New prose (replaces `aiSummaryParagraphs` in `lib/data.ts`):

```
Your wallet holds **$142K in supplied assets** across two vaults, with a moderate **$13.7K borrow**. Net APY **+6.42%**, driven primarily by Steakhouse USDC (~42% of deployed capital).

The portfolio is **concentrated in stablecoin yield** — historically lower-variance but with stablecoin-specific risks (peg deviation, vault collateral composition). Your ETH exposure is primarily indirect through Gauntlet WETH Core.

**Risk is healthy.** Health factor sits at **1.82**, and a 30% drop in ETH would push it to roughly **1.28** — still above the 1.0 liquidation threshold. Diversifying across more vault curators or chains would reduce concentration risk.
```

## Visual Style

- Each chart sits in a card with: `bg-surface-2` background, `border border-border`, `rounded-lg`, `p-3` padding, small uppercase label at the top using existing `text-muted` + `text-[11px] uppercase tracking-wide`.
- Chart palette: `#4ade80` (green, positive), `#60a5fa` (blue, neutral supply), `#a78bfa` (purple, secondary chain), `#f87171` (red, negative/borrow), `#fbbf24` (amber, warning zone).
- Hero row chart cards: fixed height (~170-190px) to keep the grid tidy.
- Stress curve: fixed height ~130-160px, full width.
- APY bar: chart height ~28-32px, bar only (no axes); label segments inline.
- Chain distribution: identical thin horizontal bar pattern.

All colors resolve from existing Tailwind theme tokens where possible; non-theme colors used in charts (blue, purple, amber) live inline in the chart components or extend the Tailwind palette (implementer decides during planning — prefer extending `tailwind.config.ts` to keep a single source of truth).

## Scope Boundaries

### In scope

- Install `recharts`.
- Create 6 chart components under `components/charts/`.
- Add the data constants to the data file.
- Update `AISummary.tsx` to assemble new layout.
- Trim narrative to 3 paragraphs.
- Minor Tailwind theme additions for new chart colors if needed.

### Out of scope

- Interactive charts (hover tooltips, drill-down, zoom). Static rendering only — the designer demo doesn't need interactivity.
- Responsive layout adjustments for mobile.
- Animations or transitions.
- Real calculations from positions (stress curve and risk scores remain hardcoded).
- Tooltip/popover explanations of what each chart means.
- Changes to Positions / Activity tabs or any other part of the dashboard.
- Light-theme variants of the charts.

## Open Questions

None.
