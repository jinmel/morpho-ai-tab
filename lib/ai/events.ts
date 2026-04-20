import type { Spec } from "@json-render/core";

export type AgentEvent =
  | { type: "tool-call";   id: string; name: string; argsSummary: string }
  | { type: "tool-result"; id: string; name: string; resultSummary: string; details?: string; ok: boolean }
  | { type: "status";      text: string }
  | { type: "complete";    spec: Spec }
  | { type: "error";       message: string };

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

// MCP tool results arrive as { content: [{ type: "text", text: "<JSON string>" }] }.
// Unwrap to the inner payload object, or return the input unchanged if the shape is different.
function unwrapMcp(output: unknown): unknown {
  if (!isObj(output)) return output;
  const content = output.content;
  if (!Array.isArray(content) || content.length === 0) return output;
  const first = content[0];
  if (!isObj(first) || typeof first.text !== "string") return output;
  try { return JSON.parse(first.text); } catch { return output; }
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
      const payload = unwrapMcp(output);
      if (isObj(payload)) {
        const chain = typeof payload.chain === "string" ? payload.chain : "unknown";
        const vaultCount = Array.isArray(payload.vaultPositions) ? payload.vaultPositions.length : 0;
        const marketCount = Array.isArray(payload.marketPositions) ? payload.marketPositions.length : 0;
        if (vaultCount === 0 && marketCount === 0) return `empty (no positions on ${chain})`;
        return `${vaultCount} vault, ${marketCount} market on ${chain}`;
      }
      return safeJson(output);
    }
    if (name === "morpho_get_vault" || name === "morpho_get_market") {
      const kind = name === "morpho_get_vault" ? "vault" : "market";
      const payload = unwrapMcp(output);
      if (isObj(payload)) {
        const symbol =
          typeof payload.symbol === "string" ? payload.symbol
          : isObj(payload.asset) && typeof payload.asset.symbol === "string" ? payload.asset.symbol
          : null;
        const rawApy =
          typeof payload.apy === "number" ? payload.apy
          : typeof payload.supplyApy === "number" ? payload.supplyApy
          : typeof payload.netApy === "number" ? payload.netApy
          : null;
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
