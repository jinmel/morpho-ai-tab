"use client";

import { useAccount } from "wagmi";
import { JsonRender } from "./JsonRender";
import { AgentTimeline } from "./AgentTimeline";
import { useGeneratedUi } from "@/lib/ai/useGeneratedUi";

type Props = { fallbackAddress: string };

export function GenerativeAI({ fallbackAddress }: Props) {
  const { address: walletAddress, isConnected } = useAccount();
  const target = isConnected && walletAddress ? walletAddress : fallbackAddress;

  const { status, events, ui, error, regenerate } = useGeneratedUi(target);

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">✨</span>
          <div>
            <div className="text-base">Portfolio Summary</div>
            <div className="text-xs text-muted">
              {status === "loading" && "Generating via Claude + Morpho MCP…"}
              {status === "ready"   && "Generated just now · Claude + Morpho MCP"}
              {status === "error"   && "Generation failed"}
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={regenerate}
          disabled={status === "loading"}
          className="rounded-md border border-border-2 px-3 py-1.5 text-xs text-text hover:bg-surface-2 disabled:opacity-60"
        >
          {status === "loading" ? "Running…" : "Regenerate"}
        </button>
      </div>

      <div className="text-[11px] text-muted mb-3">
        Target address: <span className="text-text/80">{target}</span>
        {isConnected ? " (connected wallet)" : " (demo address — connect wallet to analyze yours)"}
      </div>

      {status === "loading" && (
        <AgentTimeline events={events} status="loading" />
      )}

      {status === "error" && (
        <>
          <AgentTimeline events={events} status="error" />
          <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-4 text-sm text-amber-400 mt-3">
            <div className="font-medium mb-1">Could not generate UI</div>
            <div className="text-amber-300/90 text-[13px]">
              {error instanceof Error ? error.message : String(error)}
            </div>
            <div className="text-amber-300/70 text-[11px] mt-2">
              Check that <code className="font-mono">ANTHROPIC_API_KEY</code> is set in <code className="font-mono">.env.local</code> and the server can reach <code className="font-mono">https://mcp.morpho.org</code>.
            </div>
          </div>
        </>
      )}

      {status === "ready" && ui && (
        <>
          <JsonRender ui={ui} />
          <details className="mt-3">
            <summary className="cursor-pointer text-[11px] text-muted hover:text-text/70 select-none">
              Show reasoning · {events.length} steps
            </summary>
            <div className="mt-2">
              <AgentTimeline events={events} status="ready" />
            </div>
          </details>
        </>
      )}

      <p className="text-[11px] leading-relaxed text-muted opacity-60 mt-4">
        AI-generated UI produced on the fly by Claude via the Morpho MCP server. Not financial advice.
      </p>
    </div>
  );
}
