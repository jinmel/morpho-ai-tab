import type { Block, Ui } from "@/lib/ai/schema";
import { ChartCard } from "@/components/charts/ChartCard";
import { AllocationDonutAI } from "@/components/charts/ai/AllocationDonutAI";
import { ChainBarAI } from "@/components/charts/ai/ChainBarAI";
import { ApyBarAI } from "@/components/charts/ai/ApyBarAI";
import { HealthGaugeAI } from "@/components/charts/ai/HealthGaugeAI";

const toneBg: Record<string, string> = {
  positive: "border-emerald-500/30 bg-emerald-500/5",
  neutral:  "border-border bg-surface-2",
  warning:  "border-amber-500/40 bg-amber-500/5",
};

const toneText: Record<string, string> = {
  positive: "text-emerald-400",
  neutral:  "text-text",
  warning:  "text-amber-400",
};

function usd(n?: number) {
  if (typeof n !== "number") return "—";
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function pct(n?: number) {
  if (typeof n !== "number") return "—";
  return `${n >= 0 ? "" : "-"}${Math.abs(n).toFixed(2)}%`;
}

function Heading({ text, level }: { text: string; level?: 1 | 2 | 3 }) {
  const cls = level === 1 ? "text-2xl" : level === 3 ? "text-sm text-muted" : "text-lg";
  if (level === 1) return <h1 className={`${cls} font-medium`}>{text}</h1>;
  if (level === 3) return <h3 className={`${cls} font-medium`}>{text}</h3>;
  return <h2 className={`${cls} font-medium`}>{text}</h2>;
}

function Paragraph({ text }: { text: string }) {
  return <p className="text-[14px] leading-relaxed text-text/90">{text}</p>;
}

function Callout({ tone, title, text }: { tone: "positive" | "neutral" | "warning"; title?: string; text: string }) {
  return (
    <div className={`rounded-xl border p-4 ${toneBg[tone]}`}>
      {title && <div className={`text-sm font-medium mb-1 ${toneText[tone]}`}>{title}</div>}
      <div className="text-[14px] leading-relaxed text-text/90">{text}</div>
    </div>
  );
}

function MetricGrid({ items }: { items: { label: string; value: string; hint?: string; tone?: "positive" | "neutral" | "warning" }[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {items.map((m, i) => (
        <div key={i} className={`rounded-xl border p-4 ${toneBg[m.tone ?? "neutral"]}`}>
          <div className="text-xs text-muted">{m.label}</div>
          <div className={`text-xl mt-1 ${toneText[m.tone ?? "neutral"]}`}>{m.value}</div>
          {m.hint && <div className="text-[11px] text-muted mt-1">{m.hint}</div>}
        </div>
      ))}
    </div>
  );
}

function List({ items, style }: { items: string[]; style?: "bullet" | "check" }) {
  return (
    <ul className="space-y-1.5">
      {items.map((it, i) => (
        <li key={i} className="text-[14px] text-text/90 flex gap-2">
          <span className={style === "check" ? "text-emerald-400" : "text-muted"}>
            {style === "check" ? "✓" : "•"}
          </span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function KeyValue({ items }: { items: { key: string; value: string }[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 divide-y divide-border">
      {items.map((kv, i) => (
        <div key={i} className="flex justify-between px-4 py-2 text-sm">
          <span className="text-muted">{kv.key}</span>
          <span className="text-text">{kv.value}</span>
        </div>
      ))}
    </div>
  );
}

function Positions({ title, items }: { title?: string; items: { name: string; kind: "supply" | "borrow"; chain?: string; balanceUsd?: number; apyPct?: number }[] }) {
  return (
    <div className="rounded-xl border border-border bg-surface-2 overflow-hidden">
      {title && <div className="px-4 py-2 text-xs text-muted border-b border-border">{title}</div>}
      <div className="divide-y divide-border">
        {items.map((p, i) => (
          <div key={i} className="px-4 py-3 flex items-center justify-between text-sm">
            <div className="min-w-0">
              <div className="text-text truncate">{p.name}</div>
              <div className="text-xs text-muted">
                <span className={p.kind === "borrow" ? "text-amber-400" : "text-emerald-400"}>
                  {p.kind}
                </span>
                {p.chain && <span> · {p.chain}</span>}
              </div>
            </div>
            <div className="text-right">
              <div className="text-text">{usd(p.balanceUsd)}</div>
              <div className={`text-xs ${(p.apyPct ?? 0) >= 0 ? "text-emerald-400" : "text-amber-400"}`}>
                {pct(p.apyPct)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function renderBlock(b: Block, i: number) {
  switch (b.type) {
    case "heading":    return <Heading key={i} text={b.text} level={b.level} />;
    case "paragraph":  return <Paragraph key={i} text={b.text} />;
    case "callout":    return <Callout key={i} tone={b.tone} title={b.title} text={b.text} />;
    case "metricGrid": return <MetricGrid key={i} items={b.items} />;
    case "list":       return <List key={i} items={b.items} style={b.style} />;
    case "keyValue":   return <KeyValue key={i} items={b.items} />;
    case "positions":  return <Positions key={i} title={b.title} items={b.items} />;
    case "divider":    return <hr key={i} className="border-border my-2" />;
    case "allocationDonut":
      return (
        <ChartCard key={i} label={b.title ?? "Allocation"}>
          {b.items.length === 0 ? (
            <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted">
              No data
            </div>
          ) : (
            <AllocationDonutAI items={b.items} />
          )}
        </ChartCard>
      );
    case "chainBar":
      return (
        <ChartCard key={i} label={b.title ?? "Chains"}>
          {b.items.length === 0 ? (
            <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted">
              No data
            </div>
          ) : (
            <ChainBarAI items={b.items} />
          )}
        </ChartCard>
      );
    case "apyBar":
      return (
        <ChartCard key={i} label={b.title ?? "APY contribution"}>
          {b.items.length === 0 ? (
            <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted">
              No data
            </div>
          ) : (
            <ApyBarAI items={b.items} netLabel={b.netLabel} />
          )}
        </ChartCard>
      );
    case "healthGauge":
      return (
        <ChartCard key={i} label={b.title ?? "Health factor"}>
          <HealthGaugeAI value={b.value} hint={b.hint} />
        </ChartCard>
      );
  }
}

export function JsonRender({ ui }: { ui: Ui }) {
  return <div className="space-y-3">{ui.blocks.map((b, i) => renderBlock(b, i))}</div>;
}
