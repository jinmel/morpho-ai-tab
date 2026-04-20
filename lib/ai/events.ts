import type { Ui } from "@/lib/ai/schema";

export type AgentEvent =
  | { type: "tool-call";   id: string; name: string; argsSummary: string }
  | { type: "tool-result"; id: string; name: string; resultSummary: string; details?: string; ok: boolean }
  | { type: "status";      text: string }
  | { type: "complete";    ui: Ui }
  | { type: "error";       message: string };

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function safeJson(val: unknown, limit = 80): string {
  try {
    const s = JSON.stringify(val);
    return s.length > limit ? s.slice(0, limit) + "…" : s;
  } catch {
    return "[unserializable]";
  }
}

export function summarizeToolArgs(name: string, args: unknown): string {
  try {
    if (name === "morpho_get_positions") {
      const chain = isObj(args) && typeof args.chain === "string" ? args.chain : "unknown";
      return `chain=${chain}`;
    }
    if (name === "morpho_get_vault" || name === "morpho_get_market") {
      const chain = isObj(args) && typeof args.chain === "string" ? args.chain : "unknown";
      const rawId = isObj(args)
        ? (typeof args.id === "string" ? args.id
          : typeof args.vaultId === "string" ? args.vaultId
          : typeof args.marketId === "string" ? args.marketId
          : "")
        : "";
      const shortId = rawId.length > 8 ? rawId.slice(0, 6) + "…" : rawId;
      return `chain=${chain} id=${shortId}`;
    }
    return safeJson(args);
  } catch {
    return "[unserializable]";
  }
}

export function summarizeToolResult(name: string, output: unknown): string {
  try {
    if (name === "morpho_get_positions") {
      if (isObj(output)) {
        const chain = typeof output.chain === "string" ? output.chain : "unknown";
        const supplyCount = Array.isArray(output.supplyPositions) ? output.supplyPositions.length : 0;
        const borrowCount = Array.isArray(output.borrowPositions) ? output.borrowPositions.length : 0;
        if (supplyCount === 0 && borrowCount === 0) return `empty (no positions on ${chain})`;
        return `${supplyCount} supply, ${borrowCount} borrow on ${chain}`;
      }
      if (Array.isArray(output)) {
        const supply = output.filter((p) => isObj(p) && p.kind === "supply").length;
        const borrow = output.filter((p) => isObj(p) && p.kind === "borrow").length;
        if (supply === 0 && borrow === 0) return "empty (no positions)";
        return `${supply} supply, ${borrow} borrow`;
      }
      return safeJson(output);
    }
    if (name === "morpho_get_vault" || name === "morpho_get_market") {
      const kind = name === "morpho_get_vault" ? "vault" : "market";
      if (isObj(output)) {
        const symbol =
          typeof output.symbol === "string" ? output.symbol
          : isObj(output.asset) && typeof output.asset.symbol === "string" ? output.asset.symbol
          : null;
        const rawApy =
          typeof output.apy === "number" ? output.apy
          : typeof output.supplyApy === "number" ? output.supplyApy
          : typeof output.netApy === "number" ? output.netApy
          : null;
        // MCP returns APY as a decimal (0.0642) — multiply by 100
        const apyPct = rawApy !== null ? rawApy * 100 : null;
        if (symbol && apyPct !== null) return `${symbol} ${kind} · ${apyPct.toFixed(2)}% APY`;
        if (symbol) return `${symbol} ${kind}`;
      }
      return safeJson(output);
    }
    return safeJson(output);
  } catch {
    return "[unserializable]";
  }
}
