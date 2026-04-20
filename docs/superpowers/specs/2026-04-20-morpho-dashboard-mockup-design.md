# Morpho Dashboard Mockup with AI Tab — Design Spec

**Date:** 2026-04-20
**Status:** Approved, ready for implementation plan

## Purpose

Build a **non-functional scaffolding mockup** of the Morpho dashboard page (modeled on `app.morpho.org/dashboard/0x96a2e1Cb03128DC4cD2b5D9502F0AaB8E9a9e856`) to showcase a proposed new **AI tab** to a designer colleague at Morpho.

The mockup is a static visual artifact. No wallet connection, no real on-chain data, no LLM integration. Its value is letting a Morpho designer see the existing dashboard structure with a new AI tab dropped into it, so they can react to the idea in a realistic visual context.

## Success Criteria

- A Morpho designer can open the mockup in a browser, click between the three tabs, and immediately understand the existing structure plus the proposed AI tab.
- Visual fidelity is close enough to Morpho's real dashboard that the AI tab feels like a plausible addition to the product.
- Zero runtime logic: opening the page and switching tabs works without any backend, wallet, or API.

## Tech Stack

- **Next.js** (App Router) + **TypeScript**
- **Tailwind CSS** for styling
- **Single static data file** (`data.ts`) with hardcoded placeholder positions, activity rows, and AI summary prose
- No state management library, no server components for data, no external API calls

## Routes

- `/` — redirects to `/dashboard/0x96a2e1Cb03128DC4cD2b5D9502F0AaB8E9a9e856` (or renders it directly)
- `/dashboard/[address]` — the single page in scope. Address segment is displayed but not parsed or validated.

Nav links (Earn, Borrow, Explore) are rendered but non-functional (no `href` or `href="#"`).

## Page Structure

The page is composed of the following regions, top to bottom:

1. **Top navigation bar** — Morpho logo, nav links (Earn, Borrow, Explore, Dashboard — Dashboard highlighted), truncated wallet address pill on the right.
2. **Page header** — "Dashboard" title, full address displayed below.
3. **Summary metric cards** — 4-column grid: Net Worth, Supplied, Borrowed, Net APY.
4. **Tab bar** — three tabs: Positions, Activity, AI ✨. Client-side `useState` controls the active tab. No URL sync.
5. **Tab content area** — renders one of three components based on active tab.

## Tab Contents

### Positions tab (default)

A table with columns: Vault / Market, Balance, APY, Chain.
Rows are hardcoded to match the wallet's illustrative portfolio:
- Steakhouse USDC — $60,000 — 8.1% — Base
- Gauntlet WETH Core — $82,100 — 4.8% — Ethereum
- WETH / USDC market (borrow) — -$13,680 — -5.2% — Base

Positive APY in green, negative in red. Borrow row shows negative balance.

**Summary metrics are derived from these values** to stay internally consistent:
- Supplied = $60,000 + $82,100 = **$142,100**
- Borrowed = **$13,680**
- Net Worth = Supplied − Borrowed = **$128,420**
- Net APY = **+6.42%** (hardcoded; does not need to be computed)

The implementer can either compute Supplied / Borrowed / Net Worth in code from the positions array, or hardcode them — either is fine as long as the displayed numbers match the rows.

### Activity tab

A table with columns: Action, Asset, Amount, Chain, Date.
~6 hardcoded rows showing a plausible transaction history (Supply, Borrow, Withdraw, Repay actions across Base and Ethereum, dates within the last ~30 days relative to 2026-04-20).

### AI tab (the new idea)

Layout (top to bottom):

1. **Header row** — sparkle icon + "Portfolio Summary" title + subtitle "Generated just now · AI-powered analysis", with a visual-only "Regenerate" button on the right.
2. **Narrative summary block** — a single styled content card containing ~4 paragraphs of hardcoded prose that references the Positions-tab data (specific dollar amounts, vault names, health factor, concentration observations, hypothetical risk scenarios). Prose is written to read like analyst output.
3. **Disclaimer** — small-print text: "AI-generated analysis based on on-chain position data. Not financial advice."

**Reference prose** (implementer should use this or lightly edit; numbers must match the Positions rows):

> Your wallet holds **$142K in supplied assets** across two vaults, with a moderate **$13.7K borrow** against WETH collateral on Base. Your overall net APY of **+6.42%** is driven primarily by Steakhouse USDC, which accounts for roughly 42% of your deployed capital.
>
> The portfolio is **concentrated in stablecoin yield**, which has historically been lower-variance but exposes you to stablecoin-specific risks (peg deviation, underlying collateral composition of vaults). Your ETH exposure is primarily indirect through Gauntlet WETH Core.
>
> **Risk exposure is currently healthy.** Your borrow position on Base has a health factor of 1.82 — comfortable but worth monitoring if ETH moves sharply downward. A 30% drop in ETH would push health factor below 1.3.
>
> Consider diversifying across additional vault curators or chains if you want to reduce concentration risk. Your current setup is well-suited for a moderate-risk yield profile.

Visual treatment: slightly elevated card, generous padding (~28px), line-height 1.7, bold emphasis on key numbers.

## Component Breakdown

Suggested files (may be adjusted during planning):

- `app/layout.tsx` — root layout, dark theme, font setup
- `app/page.tsx` — redirect to the demo address dashboard
- `app/dashboard/[address]/page.tsx` — the dashboard page (client component for tab state)
- `components/TopNav.tsx` — header nav bar with wallet pill
- `components/SummaryCards.tsx` — 4-card metric grid
- `components/TabBar.tsx` — tab switcher
- `components/PositionsTable.tsx` — positions tab content
- `components/ActivityTable.tsx` — activity tab content
- `components/AISummary.tsx` — AI tab content
- `lib/data.ts` — all hardcoded placeholder data (positions, activity, AI prose, summary metrics)

Each component takes its data as props from the page — no global state, no data-fetching hooks.

## Visual Style

- **Dark theme** matching Morpho's app: near-black background (`#0f1117`-ish), elevated surfaces (`#181b24`-ish), subtle borders (`#232634`-ish), soft off-white text.
- **Accent colors:** green (`#4ade80`) for positive APY / net APY, red (`#f87171`) for negative/borrow.
- **Typography:** sans-serif, tight but readable. Metric values larger and semi-bold, labels small uppercase with reduced opacity.
- **Rounded corners** on cards and table rows (~8px), generous spacing.

Exact hex values and fonts are implementation details — the implementer should inspect the live Morpho dashboard and pick close matches rather than over-engineering a design token system.

## Scope Boundaries

### In scope

- Next.js + Tailwind project scaffold
- Single dashboard route with 3 working tabs (visual switching only)
- Hardcoded placeholder data in `lib/data.ts`
- High-fidelity styling matching Morpho's dark theme
- Desktop layout only

### Out of scope

- Wallet connection (WalletConnect, RainbowKit, etc.)
- Real on-chain data or Morpho MCP calls
- Functional Regenerate button — it's a visual element only
- Actual LLM integration
- Other pages (Earn, Borrow, Explore) — nav links are non-functional
- Responsive / mobile layout
- Theme toggle, settings, user preferences
- Analytics, routing to sub-pages, deep-linking to tabs
- Accessibility audit (basic semantic HTML only; no screen-reader testing pass)
- Tests (this is a throwaway mockup; no unit or e2e tests required)

## Handoff

The deliverable is a Next.js project that can be run locally (`npm run dev`) and shown in a browser. Optionally deployable to Vercel for easier sharing with the designer, but that's not required.

## Open Questions

None. All decisions resolved during brainstorm.

## How to run

```bash
npm install
npm run dev
```

Then open http://localhost:3000.
