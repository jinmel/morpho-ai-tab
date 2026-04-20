import { NextRequest } from "next/server";
import { streamText, stepCountIs } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { createMorphoMCPSession } from "@/lib/ai/mcp";
import { SYSTEM_PROMPT } from "@/lib/ai/systemPrompt";
import { UiSchema } from "@/lib/ai/schema";
import { type AgentEvent, summarizeToolArgs, summarizeToolResult } from "@/lib/ai/events";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

function extractJson(text: string): unknown {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  const body = fenced ? fenced[1] : text;
  const first = body.indexOf("{");
  const last = body.lastIndexOf("}");
  if (first === -1 || last === -1) throw new Error("No JSON object in model output");
  return JSON.parse(body.slice(first, last + 1));
}

function safeStringify(v: unknown, max: number): string {
  try {
    const s = JSON.stringify(v);
    return s.length > max ? s.slice(0, max) + "…" : s;
  } catch {
    return "[unserializable]";
  }
}

export async function POST(req: NextRequest) {
  const internalAbort = new AbortController();
  const encoder = new TextEncoder();

  let address: string | undefined;
  try {
    const body = (await req.json()) as { address?: string };
    address = body.address;
  } catch {
    address = undefined;
  }

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const emit = (e: AgentEvent) =>
        controller.enqueue(encoder.encode(JSON.stringify(e) + "\n"));

      try {
        if (!process.env.ANTHROPIC_API_KEY) {
          emit({ type: "error", message: "missing-key: ANTHROPIC_API_KEY not set" });
          controller.close();
          return;
        }
        if (!address || !/^0x[a-fA-F0-9]{40}$/.test(address)) {
          emit({ type: "error", message: "invalid-address: must be 0x-prefixed 40 hex chars" });
          controller.close();
          return;
        }

        emit({ type: "status", text: "Connecting to Morpho MCP…" });

        const session = await createMorphoMCPSession();
        try {
          const userPrompt = `Wallet: ${address}
Chains to check: base, ethereum
Task: Produce the JSON UI describing this wallet's Morpho portfolio. Start by calling morpho_get_positions for each chain.`;

          const result = streamText({
            model: anthropic("claude-sonnet-4-6"),
            system: SYSTEM_PROMPT,
            prompt: userPrompt,
            tools: session.tools,
            stopWhen: stepCountIs(8),
            abortSignal: AbortSignal.any([req.signal, internalAbort.signal]),
          });

          // MUST iterate fullStream to completion before awaiting result.text — see Risk #2
          for await (const part of result.fullStream) {
            switch (part.type) {
              case "tool-input-start":
                emit({
                  type: "tool-call",
                  id: part.id,
                  name: part.toolName,
                  argsSummary: "…",
                });
                break;
              case "tool-call":
                emit({
                  type: "tool-call",
                  id: part.toolCallId,
                  name: part.toolName,
                  argsSummary: summarizeToolArgs(part.toolName, part.input),
                });
                break;
              case "tool-result":
                emit({
                  type: "tool-result",
                  id: part.toolCallId,
                  name: part.toolName,
                  resultSummary: summarizeToolResult(part.toolName, part.output),
                  details: safeStringify(part.output, 500),
                  ok: true,
                });
                break;
              case "tool-error":
                emit({
                  type: "tool-result",
                  id: part.toolCallId,
                  name: part.toolName,
                  resultSummary: String(part.error).slice(0, 120),
                  ok: false,
                });
                break;
              default:
                break;
            }
          }

          if (req.signal.aborted) return;

          emit({ type: "status", text: "Validating output…" });

          let text: string;
          try {
            text = await result.text;
          } catch (e) {
            emit({ type: "error", message: `model: ${(e as Error).message}` });
            return;
          }

          const finishReason = await Promise.resolve(result.finishReason).catch(() => undefined);
          if (!text || text.trim() === "") {
            emit({ type: "error", message: "step-budget: model exhausted 8 steps without valid JSON" });
            return;
          }

          if (finishReason === "tool-calls") {
            emit({ type: "error", message: "step-budget: model exhausted 8 steps without valid JSON" });
            return;
          }

          try {
            const parsed = extractJson(text);
            const validated = UiSchema.parse(parsed);
            emit({ type: "complete", ui: validated });
          } catch (e) {
            emit({ type: "error", message: `validation: ${(e as Error).message}` });
          }
        } finally {
          await session.close();
        }
      } catch (err) {
        try {
          emit({ type: "error", message: `internal: ${(err as Error).message}` });
        } catch { /* controller may already be closed */ }
      } finally {
        try { controller.close(); } catch { /* already closed */ }
      }
    },
    cancel(reason) {
      internalAbort.abort(reason);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson",
      "Cache-Control": "no-store, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
