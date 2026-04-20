# Enriched AI Tab with Charts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add six charts (Health Gauge, Allocation Donut, Risk Radar, APY Contribution Bar, Chain Distribution, Liquidation Stress Curve) and a trimmed narrative to the existing AI tab.

**Architecture:** Each chart lives in its own focused component file under `components/charts/`. Recharts drives the donut and line chart; hand-rolled SVG drives the gauge and radar (where library defaults look generic); CSS flex divs drive the two simple horizontal bars (Recharts would be overkill at that size). All data remains hardcoded in `lib/data.ts`. `AISummary.tsx` is rewritten to be layout-only, assembling the chart components plus the narrative.

**Tech Stack:** Next.js 16 (existing), Tailwind CSS (existing), Recharts (new), TypeScript.

**Spec reference:** `docs/superpowers/specs/2026-04-20-ai-tab-charts-design.md`
**Per spec:** no tests for this mockup.

---

## File Structure

| File | Purpose | Status |
|------|---------|--------|
| `lib/data.ts` | Add chart data constants, trim narrative | Modify |
| `tailwind.config.ts` | Add chart palette colors | Modify |
| `components/charts/ChartCard.tsx` | Small card wrapper (label + content) | Create |
| `components/charts/HealthGauge.tsx` | Hand-SVG semicircular gauge | Create |
| `components/charts/AllocationDonut.tsx` | Recharts donut | Create |
| `components/charts/RiskRadar.tsx` | Hand-SVG radar | Create |
| `components/charts/ApyContributionBar.tsx` | CSS flex horizontal stacked bar | Create |
| `components/charts/ChainDistribution.tsx` | CSS flex horizontal stacked bar | Create |
| `components/charts/StressCurve.tsx` | Recharts line chart | Create |
| `components/AISummary.tsx` | Rewrite to assemble new layout | Modify |

---

## Task 1: Install Recharts

**Files:**
- Modify: `package.json` (via `npm install`)

- [ ] **Step 1: Install recharts**

```bash
cd /Users/jinsuk/code/morpho-demo3
npm install recharts
```

Expected: adds `recharts` to `package.json` dependencies. No peer-dep errors (Recharts supports React 19 via recharts v2.13+).

- [ ] **Step 2: Verify dev server still compiles**

```bash
cd /Users/jinsuk/code/morpho-demo3 && timeout 15 npm run dev 2>&1 | head -20 || true
```

Look for "Ready" with no errors.

- [ ] **Step 3: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add package.json package-lock.json
git commit -m "chore: add recharts dependency"
```

---

## Task 2: Extend Tailwind palette with chart colors

**Files:**
- Modify: `tailwind.config.ts`

- [ ] **Step 1: Add chart colors**

Replace the `colors` block inside `extend` with:

```ts
      colors: {
        bg: "#0f1117",
        surface: "#181b24",
        "surface-2": "#13151d",
        border: "#232634",
        "border-2": "#2a2e3d",
        text: "#e8e8ea",
        muted: "#8a8f9c",
        positive: "#4ade80",
        negative: "#f87171",
        chart: {
          blue:   "#60a5fa",
          purple: "#a78bfa",
          amber:  "#fbbf24",
        },
      },
```

Everything else in the file stays the same.

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add tailwind.config.ts
git commit -m "feat: add chart palette colors to Tailwind theme"
```

---

## Task 3: Add chart data and trim narrative in `lib/data.ts`

**Files:**
- Modify: `lib/data.ts`

- [ ] **Step 1: Replace `aiSummaryParagraphs` and append chart data**

Open `lib/data.ts`. Replace the existing `aiSummaryParagraphs` export with the new 3-paragraph version, and append all chart data constants below it. The full new tail of the file (from `aiSummaryParagraphs` onward) should read:

```ts
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
```

Everything above `aiSummaryParagraphs` (DEMO_ADDRESS, Position, positions, summary, ActivityAction, ActivityRow, activity) stays unchanged.

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add lib/data.ts
git commit -m "feat: add chart data and trim AI narrative to 3 paragraphs"
```

---

## Task 4: `ChartCard` wrapper component

**Files:**
- Create: `components/charts/ChartCard.tsx`

- [ ] **Step 1: Create `components/charts/ChartCard.tsx`**

```tsx
import type { ReactNode } from "react";

type Props = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function ChartCard({ label, className, children }: Props) {
  return (
    <div
      className={`bg-surface-2 border border-border rounded-lg p-3 flex flex-col ${className ?? ""}`}
    >
      <div className="text-[11px] uppercase tracking-wide text-muted mb-2">
        {label}
      </div>
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add components/charts/ChartCard.tsx
git commit -m "feat: add ChartCard wrapper for consistent chart card styling"
```

---

## Task 5: `HealthGauge` — hand-SVG semicircular gauge

**Files:**
- Create: `components/charts/HealthGauge.tsx`

- [ ] **Step 1: Create `components/charts/HealthGauge.tsx`**

The gauge is a semicircle from HF=1.0 (left, red) to HF=3.0 (right, green), with amber between. Needle position is computed linearly: fraction = clamp((hf - 1) / 2, 0, 1), angle = -90° + 180° × fraction (i.e. -90° at left, +90° at right).

```tsx
type Props = { value: number };

const MIN = 1.0;
const MAX = 3.0;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function HealthGauge({ value }: Props) {
  const cx = 70;
  const cy = 70;
  const r = 55;

  const fraction = clamp((value - MIN) / (MAX - MIN), 0, 1);
  const needleAngle = -180 + 180 * fraction;
  const [nx, ny] = polar(cx, cy, r - 10, needleAngle);

  const arc = (startDeg: number, endDeg: number) => {
    const [sx, sy] = polar(cx, cy, r, startDeg);
    const [ex, ey] = polar(cx, cy, r, endDeg);
    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <svg viewBox="0 0 140 90" className="w-full" style={{ maxHeight: 110 }}>
        <path d={arc(-180, 0)} fill="none" stroke="#232634" strokeWidth="12" strokeLinecap="round" />
        <path d={arc(-180, -120)} fill="none" stroke="#f87171" strokeWidth="12" strokeLinecap="round" />
        <path d={arc(-120, -60)} fill="none" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round" />
        <path d={arc(-60, 0)} fill="none" stroke="#4ade80" strokeWidth="12" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#e8e8ea" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="3" fill="#e8e8ea" />
      </svg>
      <div className="mt-1 text-lg font-medium">{value.toFixed(2)}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add components/charts/HealthGauge.tsx
git commit -m "feat: add HealthGauge SVG component"
```

---

## Task 6: `AllocationDonut` — Recharts pie

**Files:**
- Create: `components/charts/AllocationDonut.tsx`

- [ ] **Step 1: Create `components/charts/AllocationDonut.tsx`**

Recharts PieChart with an inner radius creates a donut. We disable the default labels/tooltip and render the legend below as plain text (matching the rest of the UI better than Recharts' default legend).

```tsx
"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { allocationData } from "@/lib/data";

export function AllocationDonut() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full" style={{ height: 110 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={allocationData}
              dataKey="pct"
              nameKey="name"
              innerRadius={30}
              outerRadius={50}
              stroke="none"
              isAnimationActive={false}
            >
              {allocationData.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 w-full flex justify-between text-[11px] text-muted">
        {allocationData.map((slice) => (
          <span key={slice.name}>
            <span
              className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
              style={{ backgroundColor: slice.color }}
            />
            {slice.name.split(" ")[0]} {slice.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add components/charts/AllocationDonut.tsx
git commit -m "feat: add AllocationDonut Recharts pie"
```

---

## Task 7: `RiskRadar` — hand-SVG radar

**Files:**
- Create: `components/charts/RiskRadar.tsx`

- [ ] **Step 1: Create `components/charts/RiskRadar.tsx`**

Five axes evenly spaced around a circle. Each axis' length is `score / 10 * MAX_RADIUS`. Filled polygon connects the 5 points.

```tsx
import { riskScores } from "@/lib/data";

const AXES: { key: keyof typeof riskScores; label: string }[] = [
  { key: "concentration",  label: "Concentration" },
  { key: "liquidation",    label: "Liq Risk" },
  { key: "yieldQuality",   label: "Yield" },
  { key: "chainDiversity", label: "Chains" },
  { key: "assetDiversity", label: "Assets" },
];

export function RiskRadar() {
  const cx = 70;
  const cy = 60;
  const maxR = 40;
  const n = AXES.length;

  const axisAngle = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;

  const outerPts = AXES.map((_, i) => {
    const a = axisAngle(i);
    return [cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR] as const;
  });

  const scorePts = AXES.map((ax, i) => {
    const r = (riskScores[ax.key] / 10) * maxR;
    const a = axisAngle(i);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });

  const polygon = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const labelOffset = 10;
  const labelPts = AXES.map((_, i) => {
    const a = axisAngle(i);
    return [cx + Math.cos(a) * (maxR + labelOffset), cy + Math.sin(a) * (maxR + labelOffset)] as const;
  });

  return (
    <div className="flex items-center justify-center h-full">
      <svg viewBox="0 0 140 120" className="w-full" style={{ maxHeight: 130 }}>
        <polygon points={polygon(outerPts)} fill="none" stroke="#232634" strokeWidth="1" />
        <polygon
          points={polygon(scorePts)}
          fill="rgba(74,222,128,0.18)"
          stroke="#4ade80"
          strokeWidth="1.5"
        />
        {AXES.map((ax, i) => {
          const [lx, ly] = labelPts[i];
          const anchor = lx < cx - 2 ? "end" : lx > cx + 2 ? "start" : "middle";
          return (
            <text
              key={ax.key}
              x={lx}
              y={ly}
              fill="#8a8f9c"
              fontSize="7"
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {ax.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add components/charts/RiskRadar.tsx
git commit -m "feat: add RiskRadar SVG component"
```

---

## Task 8: `ApyContributionBar` — CSS flex stacked bar

**Files:**
- Create: `components/charts/ApyContributionBar.tsx`

- [ ] **Step 1: Create `components/charts/ApyContributionBar.tsx`**

The bar proportions are based on the magnitude of each contribution so segments are visually proportional to size regardless of sign. Each segment shows an inline "name +x.y" label; the negative one shows "-x.y".

```tsx
import { apyContribution } from "@/lib/data";

export function ApyContributionBar() {
  const totalMagnitude = apyContribution.reduce((sum, s) => sum + Math.abs(s.pts), 0);
  const net = apyContribution.reduce((sum, s) => sum + s.pts, 0);

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="flex items-center h-7 rounded overflow-hidden bg-bg">
        {apyContribution.map((s) => {
          const widthPct = (Math.abs(s.pts) / totalMagnitude) * 100;
          const sign = s.pts > 0 ? "+" : "";
          const short = s.name.split(" ")[0];
          return (
            <div
              key={s.name}
              style={{ backgroundColor: s.color, width: `${widthPct}%` }}
              className="h-full flex items-center px-2 text-[10px] text-bg font-medium whitespace-nowrap overflow-hidden"
              title={`${s.name} ${sign}${s.pts}`}
            >
              {short} {sign}{s.pts}
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-[11px] text-muted">
        Net: <strong className="text-positive">+{net.toFixed(2)}%</strong>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add components/charts/ApyContributionBar.tsx
git commit -m "feat: add ApyContributionBar stacked flex bar"
```

---

## Task 9: `ChainDistribution` — CSS flex stacked bar

**Files:**
- Create: `components/charts/ChainDistribution.tsx`

- [ ] **Step 1: Create `components/charts/ChainDistribution.tsx`**

```tsx
import { chainDistribution } from "@/lib/data";

export function ChainDistribution() {
  return (
    <div className="flex flex-col justify-center h-full">
      <div className="flex h-3.5 rounded overflow-hidden bg-bg">
        {chainDistribution.map((s) => (
          <div
            key={s.name}
            style={{ backgroundColor: s.color, width: `${s.pct}%` }}
            className="h-full"
            title={`${s.name} ${s.pct}%`}
          />
        ))}
      </div>
      <div className="mt-2 text-[11px] text-muted">
        {chainDistribution.map((s, i) => (
          <span key={s.name}>
            {i > 0 && " · "}
            {s.name} {s.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add components/charts/ChainDistribution.tsx
git commit -m "feat: add ChainDistribution stacked flex bar"
```

---

## Task 10: `StressCurve` — Recharts line chart

**Files:**
- Create: `components/charts/StressCurve.tsx`

- [ ] **Step 1: Create `components/charts/StressCurve.tsx`**

Line chart of HF vs ETH drop with a dashed reference line at HF=1.0 and annotations for the current HF (at drop=0) and the -30% scenario.

```tsx
"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import { stressCurve } from "@/lib/data";

export function StressCurve() {
  return (
    <div className="h-full" style={{ minHeight: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={stressCurve}
          margin={{ top: 10, right: 16, bottom: 18, left: 0 }}
        >
          <XAxis
            dataKey="ethDropPct"
            tick={{ fill: "#8a8f9c", fontSize: 10 }}
            tickFormatter={(v) => `-${v}%`}
            stroke="#232634"
            label={{
              value: "ETH price drop",
              position: "insideBottom",
              offset: -10,
              fill: "#8a8f9c",
              fontSize: 10,
            }}
          />
          <YAxis
            dataKey="hf"
            tick={{ fill: "#8a8f9c", fontSize: 10 }}
            stroke="#232634"
            domain={[0.8, 2.0]}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <ReferenceLine
            y={1}
            stroke="#f87171"
            strokeDasharray="3 3"
            label={{ value: "HF = 1.0", position: "insideBottomRight", fill: "#f87171", fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="hf"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ fill: "#4ade80", r: 3 }}
            isAnimationActive={false}
          />
          <ReferenceDot x={30} y={1.28} r={4} fill="#fbbf24" stroke="none" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add components/charts/StressCurve.tsx
git commit -m "feat: add StressCurve Recharts line chart"
```

---

## Task 11: Rewrite `AISummary.tsx` to assemble new layout

**Files:**
- Modify: `components/AISummary.tsx`

- [ ] **Step 1: Replace file contents**

The props shape stays the same (takes `paragraphs`). The body now composes the chart cards around the narrative.

```tsx
import { ChartCard } from "./charts/ChartCard";
import { HealthGauge } from "./charts/HealthGauge";
import { AllocationDonut } from "./charts/AllocationDonut";
import { RiskRadar } from "./charts/RiskRadar";
import { ApyContributionBar } from "./charts/ApyContributionBar";
import { ChainDistribution } from "./charts/ChainDistribution";
import { StressCurve } from "./charts/StressCurve";
import { healthFactor } from "@/lib/data";

type Props = { paragraphs: string[] };

function renderWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-text">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function AISummary({ paragraphs }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">✨</span>
          <div>
            <div className="text-base">Portfolio Summary</div>
            <div className="text-xs text-muted">Generated just now · AI-powered analysis</div>
          </div>
        </div>
        <button
          type="button"
          className="rounded-md border border-border-2 px-3 py-1.5 text-xs text-text"
        >
          Regenerate
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <ChartCard label="Health Factor" className="h-44">
          <HealthGauge value={healthFactor} />
        </ChartCard>
        <ChartCard label="Allocation" className="h-44">
          <AllocationDonut />
        </ChartCard>
        <ChartCard label="Risk Profile" className="h-44">
          <RiskRadar />
        </ChartCard>
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-6 leading-[1.7] text-[14px] space-y-3 mb-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="m-0">{renderWithBold(p)}</p>
        ))}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-3 mb-3">
        <ChartCard label="Net APY contribution" className="h-28">
          <ApyContributionBar />
        </ChartCard>
        <ChartCard label="Chain" className="h-28">
          <ChainDistribution />
        </ChartCard>
      </div>

      <ChartCard label="Liquidation stress · Health factor vs ETH drop" className="h-48 mb-3">
        <StressCurve />
      </ChartCard>

      <p className="text-[11px] leading-relaxed text-muted opacity-60">
        AI-generated analysis based on on-chain position data. Not financial advice. Always do your own research before making decisions.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
cd /Users/jinsuk/code/morpho-demo3
git add components/AISummary.tsx
git commit -m "feat: rewrite AISummary to assemble enriched chart layout"
```

---

## Task 12: End-to-end verification

**Files:** none (verification only)

- [ ] **Step 1: Start / confirm dev server**

```bash
cd /Users/jinsuk/code/morpho-demo3 && (lsof -i :3000 -sTCP:LISTEN -t >/dev/null || npm run dev &) && sleep 3
```

(Skip starting a new server if one's already listening on 3000.)

- [ ] **Step 2: Curl the dashboard and verify HTTP 200 + key content**

```bash
curl -sI "http://localhost:3000/dashboard/0x96a2e1Cb03128DC4cD2b5D9502F0AaB8E9a9e856" | head -1
curl -s  "http://localhost:3000/dashboard/0x96a2e1Cb03128DC4cD2b5D9502F0AaB8E9a9e856" | grep -o "Portfolio Summary\|Health Factor\|Allocation\|Risk Profile\|Net APY contribution\|Liquidation stress" | sort | uniq -c
```

Expected:
- `HTTP/1.1 200 OK`
- All six chart labels appear at least once: Portfolio Summary, Health Factor, Allocation, Risk Profile, Net APY contribution, Liquidation stress

The AI tab is only rendered when you click it (client-side tab state); the static SSR output shows the default Positions tab. So after the curl check, open the browser to **http://localhost:3000**, click the **AI ✨** tab, and visually confirm:

1. Top row: gauge needle pointing at 1.82 in the amber-green zone; donut with two slices; radar with a green filled polygon and 5 axis labels.
2. Narrative block: 3 paragraphs with bold emphasis on key figures.
3. Second row: APY bar with 3 labeled segments (Steakhouse +4.9, Gauntlet +2.0, -0.5); chain bar with Base 52% / Ethereum 48%.
4. Full-width stress curve: line dropping from 1.82 down past the red HF=1.0 line at around -50%; amber dot at the -30% point.
5. Disclaimer below.

- [ ] **Step 3: Fix anything broken**

Common issues:
- Recharts "ResponsiveContainer requires parent with explicit height" warning → the `ChartCard` wrapper's `flex-1 min-h-0` content area should supply height via the card's explicit `h-*` class. If a chart renders at 0px, add `h-full` to the chart component's outermost div (most already have this).
- Hydration mismatch on Recharts components → confirm each Recharts-using file starts with `"use client";` (AllocationDonut and StressCurve do).
- Invalid Tailwind class `text-chart-blue` → if used, confirm the `chart` color was added under `extend.colors` in Task 2.

If fixes are made, commit them:

```bash
cd /Users/jinsuk/code/morpho-demo3
git status
# stage relevant changes
git add -A
git commit -m "fix: polish tweaks from end-to-end verification"
```

- [ ] **Step 4: Append run instructions already exist in the mockup spec; nothing to add.**

Skip.

---

## Self-Review

**Spec coverage:**
- [x] Install recharts — Task 1
- [x] Extend Tailwind palette — Task 2
- [x] Data constants + trimmed narrative — Task 3
- [x] ChartCard wrapper — Task 4
- [x] HealthGauge (hand-SVG) — Task 5
- [x] AllocationDonut (Recharts) — Task 6
- [x] RiskRadar (hand-SVG) — Task 7
- [x] ApyContributionBar — Task 8 (CSS flex; spec allows this as "simple flex divs")
- [x] ChainDistribution — Task 9 (CSS flex; same latitude)
- [x] StressCurve (Recharts) — Task 10
- [x] AISummary layout rewrite with new hero row + narrative + secondary row + full-width curve + disclaimer — Task 11
- [x] End-to-end visual verification — Task 12

**Out-of-scope items correctly absent:**
- No tooltip/hover interactions, no animations, no responsive tweaks, no real calculations. Recharts' `isAnimationActive={false}` is set where used.

**Type consistency:**
- `allocationData` referenced by name in AllocationDonut (Task 6), defined in Task 3. ✓
- `riskScores` shape used by RiskRadar (Task 7) matches `RiskScores` type in Task 3. ✓
- `apyContribution` fields (`name`, `pts`, `color`) used by ApyContributionBar (Task 8) match Task 3. ✓
- `chainDistribution` fields used by ChainDistribution (Task 9) match Task 3. ✓
- `stressCurve` field names (`ethDropPct`, `hf`) referenced in StressCurve (Task 10) match Task 3. ✓
- `healthFactor` imported by AISummary (Task 11) and passed to HealthGauge; HealthGauge prop is `value: number`. ✓
- `ChartCard` props (`label`, `className`, `children`) used consistently in Task 11. ✓

**Deviations from spec (intentional):**
- Spec said "APY Contribution Bar" and "Chain Distribution" could use Recharts OR simple flex divs. Plan picks flex divs because the content is just proportional colored segments with no axes.
