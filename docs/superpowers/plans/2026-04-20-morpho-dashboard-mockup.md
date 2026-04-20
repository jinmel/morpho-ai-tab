# Morpho Dashboard Mockup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Next.js mockup of the Morpho dashboard at `/dashboard/[address]` with three tabs (Positions, Activity, AI) using hardcoded placeholder data, styled to match Morpho's dark theme, for showcasing the new AI tab idea to a designer.

**Architecture:** Single Next.js App Router page that assembles header, summary cards, tab bar, and one of three tab content components. All data lives in `lib/data.ts`. Tab state is client-side `useState` — no URL routing for tabs. Nav links are non-functional.

**Tech Stack:** Next.js 14+ (App Router), TypeScript, Tailwind CSS. No tests per spec (mockup is throwaway).

**Spec reference:** `docs/superpowers/specs/2026-04-20-morpho-dashboard-mockup-design.md`

---

## Task 1: Initialize Next.js project

**Files:**
- Create: project scaffold at repo root

- [ ] **Step 1: Initialize Next.js app in the current directory**

Run from `/Users/jinsuk/code/morpho-demo3`:

```bash
npx create-next-app@latest . --typescript --tailwind --app --no-src-dir --eslint --import-alias "@/*" --use-npm --yes
```

Expected: creates `package.json`, `app/`, `tailwind.config.ts`, `tsconfig.json`, `next.config.mjs`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, etc. Prompts are suppressed by `--yes`. The `docs/` and `.superpowers/` directories already present are preserved.

If `create-next-app` refuses because the directory is non-empty, answer any prompts with defaults to overwrite only the files it writes.

- [ ] **Step 2: Verify the dev server starts**

```bash
npm run dev
```

Expected: server starts on http://localhost:3000. Open it and see the default Next.js landing page. Stop the server with Ctrl-C.

- [ ] **Step 3: Initialize git and commit**

```bash
git init
git add -A
git commit -m "chore: bootstrap Next.js + TypeScript + Tailwind project"
```

---

## Task 2: Configure dark theme in Tailwind and globals

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `app/globals.css`

- [ ] **Step 1: Replace `tailwind.config.ts` with theme tokens**

Replace the file's contents with:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
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
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 2: Replace `app/globals.css` with the dark base**

Replace the file's contents with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  background-color: #0f1117;
  color: #e8e8ea;
  -webkit-font-smoothing: antialiased;
}

body {
  font-family: var(--font-inter), system-ui, sans-serif;
}
```

- [ ] **Step 3: Commit**

```bash
git add tailwind.config.ts app/globals.css
git commit -m "feat: configure Morpho dark theme tokens in Tailwind"
```

---

## Task 3: Set up root layout with Inter font and dark background

**Files:**
- Modify: `app/layout.tsx`

- [ ] **Step 1: Replace `app/layout.tsx` with:**

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Morpho Dashboard Mockup",
  description: "Static mockup showcasing the AI tab concept",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-bg text-text min-h-screen">{children}</body>
    </html>
  );
}
```

- [ ] **Step 2: Run dev server and verify background is dark**

```bash
npm run dev
```

Open http://localhost:3000 — page background should be near-black (`#0f1117`), default Next.js content still showing. Stop server.

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx
git commit -m "feat: set up root layout with Inter font and dark background"
```

---

## Task 4: Create placeholder data file

**Files:**
- Create: `lib/data.ts`

- [ ] **Step 1: Create `lib/data.ts` with:**

```ts
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
```

- [ ] **Step 2: Commit**

```bash
git add lib/data.ts
git commit -m "feat: add hardcoded placeholder data for positions, activity, AI summary"
```

---

## Task 5: Build TopNav component

**Files:**
- Create: `components/TopNav.tsx`

- [ ] **Step 1: Create `components/TopNav.tsx` with:**

```tsx
type Props = { address: string };

function truncate(addr: string): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function TopNav({ address }: Props) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold tracking-tight">Morpho</span>
          <nav className="flex items-center gap-5 text-sm">
            <span className="text-muted">Earn</span>
            <span className="text-muted">Borrow</span>
            <span className="text-muted">Explore</span>
            <span className="text-text">Dashboard</span>
          </nav>
        </div>
        <div className="rounded-full border border-border-2 px-3 py-1 text-sm text-text">
          {truncate(address)}
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/TopNav.tsx
git commit -m "feat: add TopNav component with nav links and wallet pill"
```

---

## Task 6: Build SummaryCards component

**Files:**
- Create: `components/SummaryCards.tsx`

- [ ] **Step 1: Create `components/SummaryCards.tsx` with:**

```tsx
type Props = {
  netWorthUsd: number;
  suppliedUsd: number;
  borrowedUsd: number;
  netApyPct: number;
};

function fmtUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

function Card({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="bg-surface rounded-lg px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-1.5 text-lg font-medium ${valueClassName ?? ""}`}>{value}</div>
    </div>
  );
}

export function SummaryCards({ netWorthUsd, suppliedUsd, borrowedUsd, netApyPct }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <Card label="Net Worth" value={fmtUsd(netWorthUsd)} />
      <Card label="Supplied" value={fmtUsd(suppliedUsd)} />
      <Card label="Borrowed" value={fmtUsd(borrowedUsd)} />
      <Card
        label="Net APY"
        value={`+${netApyPct.toFixed(2)}%`}
        valueClassName="text-positive"
      />
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/SummaryCards.tsx
git commit -m "feat: add SummaryCards metric grid"
```

---

## Task 7: Build TabBar component

**Files:**
- Create: `components/TabBar.tsx`

- [ ] **Step 1: Create `components/TabBar.tsx` with:**

```tsx
export type TabId = "positions" | "activity" | "ai";

type Tab = { id: TabId; label: string };

const TABS: Tab[] = [
  { id: "positions", label: "Positions" },
  { id: "activity",  label: "Activity" },
  { id: "ai",        label: "AI ✨" },
];

type Props = {
  active: TabId;
  onChange: (id: TabId) => void;
};

export function TabBar({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-border">
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? "border-b-2 border-text text-text"
                : "text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/TabBar.tsx
git commit -m "feat: add TabBar with Positions / Activity / AI tabs"
```

---

## Task 8: Build PositionsTable component

**Files:**
- Create: `components/PositionsTable.tsx`

- [ ] **Step 1: Create `components/PositionsTable.tsx` with:**

```tsx
import type { Position } from "@/lib/data";

type Props = { rows: Position[] };

function fmtBalance(kind: Position["kind"], balanceUsd: number): string {
  const sign = kind === "borrow" ? "-" : "";
  return `${sign}$${balanceUsd.toLocaleString("en-US")}`;
}

function fmtApy(apyPct: number): string {
  const sign = apyPct > 0 ? "+" : "";
  return `${sign}${apyPct.toFixed(1)}%`;
}

export function PositionsTable({ rows }: Props) {
  return (
    <div>
      <div className="bg-surface rounded-lg px-4 py-3 mb-2 grid grid-cols-[2fr_1fr_1fr_1fr] gap-3">
        <div className="text-[11px] uppercase tracking-wide text-muted">Vault / Market</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Balance</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">APY</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Chain</div>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div
            key={`${r.name}-${r.kind}`}
            className="bg-surface-2 rounded-lg px-4 py-3.5 grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 items-center"
          >
            <div>{r.name}</div>
            <div>{fmtBalance(r.kind, r.balanceUsd)}</div>
            <div className={r.apyPct >= 0 ? "text-positive" : "text-negative"}>
              {fmtApy(r.apyPct)}
            </div>
            <div className="text-muted">{r.chain}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/PositionsTable.tsx
git commit -m "feat: add PositionsTable with supply/borrow rows"
```

---

## Task 9: Build ActivityTable component

**Files:**
- Create: `components/ActivityTable.tsx`

- [ ] **Step 1: Create `components/ActivityTable.tsx` with:**

```tsx
import type { ActivityRow } from "@/lib/data";

type Props = { rows: ActivityRow[] };

function fmtUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function ActivityTable({ rows }: Props) {
  return (
    <div>
      <div className="bg-surface rounded-lg px-4 py-3 mb-2 grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3">
        <div className="text-[11px] uppercase tracking-wide text-muted">Action</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Asset</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Amount</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Chain</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Date</div>
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div
            key={i}
            className="bg-surface-2 rounded-lg px-4 py-3.5 grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 items-center"
          >
            <div>{r.action}</div>
            <div>{r.asset}</div>
            <div>{fmtUsd(r.amountUsd)}</div>
            <div className="text-muted">{r.chain}</div>
            <div className="text-muted">{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/ActivityTable.tsx
git commit -m "feat: add ActivityTable with transaction history rows"
```

---

## Task 10: Build AISummary component

**Files:**
- Create: `components/AISummary.tsx`

- [ ] **Step 1: Create `components/AISummary.tsx` with:**

Paragraphs contain `**bold**` markdown-style emphasis. Convert the markers to `<strong>` at render time with a simple splitter.

```tsx
type Props = { paragraphs: string[] };

function renderWithBold(text: string): React.ReactNode[] {
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

      <div className="rounded-xl border border-border bg-surface-2 p-7 leading-[1.7] text-[15px] space-y-3.5">
        {paragraphs.map((p, i) => (
          <p key={i} className="m-0">{renderWithBold(p)}</p>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-muted opacity-60">
        AI-generated analysis based on on-chain position data. Not financial advice. Always do your own research before making decisions.
      </p>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add components/AISummary.tsx
git commit -m "feat: add AISummary narrative tab content"
```

---

## Task 11: Build the dashboard page that assembles everything

**Files:**
- Create: `app/dashboard/[address]/page.tsx`

- [ ] **Step 1: Create `app/dashboard/[address]/page.tsx` with:**

This is a client component because it manages tab state.

```tsx
"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { SummaryCards } from "@/components/SummaryCards";
import { TabBar, type TabId } from "@/components/TabBar";
import { PositionsTable } from "@/components/PositionsTable";
import { ActivityTable } from "@/components/ActivityTable";
import { AISummary } from "@/components/AISummary";
import { positions, activity, summary, aiSummaryParagraphs } from "@/lib/data";

export default function DashboardPage({ params }: { params: { address: string } }) {
  const [tab, setTab] = useState<TabId>("positions");
  const address = params.address;

  return (
    <div>
      <TopNav address={address} />

      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-5">
          <div className="text-xl">Dashboard</div>
          <div className="text-xs text-muted mt-0.5">{address}</div>
        </div>

        <div className="mb-6">
          <SummaryCards {...summary} />
        </div>

        <div className="mb-4">
          <TabBar active={tab} onChange={setTab} />
        </div>

        <div>
          {tab === "positions" && <PositionsTable rows={positions} />}
          {tab === "activity"  && <ActivityTable rows={activity} />}
          {tab === "ai"        && <AISummary paragraphs={aiSummaryParagraphs} />}
        </div>
      </main>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add app/dashboard/[address]/page.tsx
git commit -m "feat: add dashboard page that assembles all tabs"
```

---

## Task 12: Redirect root to the demo address

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace `app/page.tsx` with:**

```tsx
import { redirect } from "next/navigation";
import { DEMO_ADDRESS } from "@/lib/data";

export default function Home() {
  redirect(`/dashboard/${DEMO_ADDRESS}`);
}
```

- [ ] **Step 2: Commit**

```bash
git add app/page.tsx
git commit -m "feat: redirect root to demo dashboard address"
```

---

## Task 13: Run the full app end-to-end and verify visually

**Files:**
- None (verification only)

- [ ] **Step 1: Start dev server**

```bash
npm run dev
```

- [ ] **Step 2: Open http://localhost:3000 in a browser**

Expected flow:
1. Root URL redirects to `/dashboard/0x96a2e1Cb03128DC4cD2b5D9502F0AaB8E9a9e856`.
2. Page renders with dark background, TopNav at top (Morpho logo, nav links, wallet pill `0x96a2…e856` on right).
3. "Dashboard" heading, full address below, 4 summary cards (Net Worth $128,420, Supplied $142,100, Borrowed $13,680, Net APY +6.42% in green).
4. Three tabs visible. Positions is active by default and shows 3 rows (Steakhouse USDC, Gauntlet WETH Core, WETH/USDC borrow with red negative APY).
5. Click Activity — shows 6 transaction rows with Action/Asset/Amount/Chain/Date columns.
6. Click AI ✨ — shows Portfolio Summary header, Regenerate button, narrative block with 4 paragraphs and bolded key figures, small disclaimer at the bottom.

- [ ] **Step 3: If anything looks broken, list the fixes and apply them**

Common fixes:
- Tailwind classes not applying → confirm `content` globs in `tailwind.config.ts` cover `app/` and `components/`.
- Hydration warning on tab buttons → make sure the dashboard page has `"use client"` at the top.
- `params.address` type error in newer Next versions → if Next.js is v15+, params may be a Promise; adjust to `async` component and `await params`.

- [ ] **Step 4: Stop dev server and commit anything outstanding**

```bash
git status
# If there are uncommitted changes from Step 3, stage and commit them.
git add -A
git commit -m "fix: polish tweaks from end-to-end visual review" || true
```

- [ ] **Step 5: Record the run command in a brief note**

Append to the end of `docs/superpowers/specs/2026-04-20-morpho-dashboard-mockup-design.md`:

```markdown

## How to run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
```

Commit:

```bash
git add docs/superpowers/specs/2026-04-20-morpho-dashboard-mockup-design.md
git commit -m "docs: add run instructions"
```

---

## Self-Review Checklist

Run through this before marking the plan done.

**Spec coverage:**
- [x] Next.js + Tailwind + TypeScript — Task 1
- [x] `/dashboard/[address]` route — Task 11
- [x] `/` redirect — Task 12
- [x] TopNav with non-functional links and wallet pill — Task 5
- [x] Summary cards (Net Worth, Supplied, Borrowed, Net APY) — Task 6
- [x] Tab bar (Positions / Activity / AI) — Task 7
- [x] PositionsTable with 3 rows matching spec numbers — Task 8, data in Task 4
- [x] ActivityTable with ~6 rows — Task 9, data in Task 4
- [x] AISummary with header + narrative + disclaimer, bold emphasis — Task 10
- [x] Hardcoded data in `lib/data.ts` — Task 4
- [x] Dark theme tokens — Task 2
- [x] Client-side tab switching (no URL sync) — Task 11
- [x] Regenerate button is visual-only — Task 10 (no onClick handler)

**Out-of-scope items correctly absent:**
- No wallet connection, no Morpho MCP, no LLM integration, no tests, no responsive layout, no other pages.

**Type consistency:** `Position`, `ActivityRow`, `TabId` defined once and imported where used. `summary` object keys match `SummaryCards` props. `positions`, `activity`, `aiSummaryParagraphs` names match across data file and consumers.
