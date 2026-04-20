"use client";

import { useState, useEffect, useCallback } from "react";
import type { AgentEvent } from "./events";
import type { Spec } from "@json-render/core";

// ---------- module-scoped cache (LRU, cap 16, TTL 5 min) ----------

const CACHE_TTL = 5 * 60 * 1000;
const CACHE_CAP = 16;

type CacheEntry = { spec: Spec; events: AgentEvent[]; ts: number };
const cache = new Map<string, CacheEntry>();

function cacheRead(address: string): CacheEntry | null {
  const entry = cache.get(address);
  if (!entry) return null;
  if (Date.now() - entry.ts >= CACHE_TTL) { cache.delete(address); return null; }
  // LRU: re-insert to move to end
  cache.delete(address);
  cache.set(address, entry);
  return entry;
}

function cacheWrite(address: string, spec: Spec, events: AgentEvent[]) {
  if (cache.size >= CACHE_CAP) {
    cache.delete(cache.keys().next().value!);
  }
  cache.set(address, { spec, events, ts: Date.now() });
}

function cacheDelete(address: string) {
  cache.delete(address);
}

// ---------- hook ----------

export type GeneratedUiState = {
  status: "idle" | "loading" | "ready" | "error";
  events: AgentEvent[];
  spec: Spec | null;
  error: Error | null;
  regenerate: () => void;
};

export function useGeneratedUi(address: string): GeneratedUiState {
  const [events, setEvents] = useState<AgentEvent[]>([]);
  const [spec, setSpec] = useState<Spec | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [nonce, setNonce] = useState(0);

  const regenerate = useCallback(() => {
    cacheDelete(address);
    setNonce((n) => n + 1);
  }, [address]);

  useEffect(() => {
    if (!address) return;

    const abortController = new AbortController();

    const cached = cacheRead(address);
    if (cached) {
      // Cache hydration is the intended effect of address/nonce changing — not a cascade.
      /* eslint-disable react-hooks/set-state-in-effect */
      setEvents(cached.events);
      setSpec(cached.spec);
      setError(null);
      setStatus("ready");
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    setEvents([]);
    setSpec(null);
    setError(null);
    setStatus("loading");

    (async () => {
      const t0 = performance.now();

      let res: Response;
      try {
        res = await fetch("/api/ai/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address }),
          signal: abortController.signal,
        });
      } catch (e) {
        if (abortController.signal.aborted) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        setStatus("error");
        return;
      }

      if (!res.body) {
        if (abortController.signal.aborted) return;
        setError(new Error("No response body"));
        setStatus("error");
        return;
      }

      const decoder = new TextDecoder();
      let buf = "";
      let firstToolCall = true;
      // Local mirror of events — used for synchronous cache write in the complete handler
      // (setEvents is async; we cannot rely on it being flushed before cacheWrite runs)
      let localEvents: AgentEvent[] = [];

      function mergeIntoLocal(evt: AgentEvent): AgentEvent[] {
        if (evt.type === "tool-call") {
          const idx = localEvents.findIndex((e) => e.type === "tool-call" && e.id === evt.id);
          if (idx !== -1) {
            const next = [...localEvents];
            next[idx] = evt;
            localEvents = next;
            return localEvents;
          }
        }
        localEvents = [...localEvents, evt];
        return localEvents;
      }

      try {
        const reader = res.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (abortController.signal.aborted) return;

          buf += decoder.decode(value, { stream: true });
          const lines = buf.split("\n");
          buf = lines.pop() ?? "";

          for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed) continue;

            let evt: AgentEvent;
            try { evt = JSON.parse(trimmed) as AgentEvent; } catch { continue; }

            if (evt.type === "complete") {
              setSpec(evt.spec);
              setStatus("ready");
              cacheWrite(address, evt.spec, localEvents);
              continue;
            }

            if (evt.type === "error") {
              setError(new Error(evt.message));
              setStatus("error");
              continue;
            }

            const merged = mergeIntoLocal(evt);

            if (evt.type === "tool-call" && firstToolCall) {
              firstToolCall = false;
              console.debug("[useGeneratedUi] first tool-call latency:", performance.now() - t0, "ms");
            }

            setEvents(() => merged);
          }
        }
      } catch (e) {
        if (abortController.signal.aborted) return;
        setError(e instanceof Error ? e : new Error(String(e)));
        setStatus("error");
      }
    })();

    return () => {
      abortController.abort();
    };
  }, [address, nonce]);

  return { status, events, spec, error, regenerate };
}
