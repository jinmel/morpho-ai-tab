"use client";
import { useEffect, useRef } from "react";
import type { AgentEvent } from "@/lib/ai/events";

type Props = { events: AgentEvent[]; status: "loading" | "ready" | "error" };

export function AgentTimeline({ events, status }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const prevLen = useRef(0);
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    if (events.length > prevLen.current) {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
      if (nearBottom) el.scrollTop = el.scrollHeight;
    }
    prevLen.current = events.length;
  }, [events.length]);

  const headerText = status === "loading" ? "Generating" : `Reasoning · ${events.length} steps`;

  return (
    <div className="rounded-xl border border-border bg-surface-2 p-4 font-mono text-[12px]">
      <div className="text-xs text-muted mb-2">{headerText}</div>
      <div ref={scrollRef} className="max-h-64 overflow-y-auto space-y-0.5 pr-1">
        {events.map((e, i) => {
          const isLast = i === events.length - 1;
          if (e.type === "tool-call") {
            return <div key={i} className="text-text/90 fade-in-up">● {e.name}({e.argsSummary})</div>;
          }
          if (e.type === "tool-result") {
            const tone = e.ok ? "text-emerald-400" : "text-amber-400";
            return <div key={i} className={`pl-3 ${tone} fade-in-up`}>→ {e.resultSummary}</div>;
          }
          if (e.type === "status") {
            const cls = `text-muted fade-in-up ${status === "loading" && isLast ? "animate-pulse" : ""}`;
            return <div key={i} className={cls}>◌ {e.text}</div>;
          }
          if (e.type === "error") {
            return <div key={i} className="text-amber-400 fade-in-up">✕ {e.message}</div>;
          }
          if (e.type === "complete") {
            return <div key={i} className="text-emerald-400 fade-in-up">✓ UI ready</div>;
          }
          return null;
        })}
      </div>
    </div>
  );
}
