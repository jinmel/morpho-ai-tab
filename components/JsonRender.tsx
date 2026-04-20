"use client";

import { Renderer, JSONUIProvider, type ComponentRegistry, type ComponentRenderer } from "@json-render/react";
import type { Spec } from "@json-render/core";
import type { ComponentProps } from "@/lib/ai/schema";
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

function EmptyChart() {
  return (
    <div className="flex h-full min-h-40 items-center justify-center text-sm text-muted">
      No data
    </div>
  );
}

const Root: ComponentRenderer<ComponentProps["Root"]> = ({ children }) => (
  <div className="space-y-3">{children}</div>
);

const Heading: ComponentRenderer<ComponentProps["Heading"]> = ({ element }) => {
  const { text, level } = element.props;
  if (level === 1) return <h1 className="text-2xl font-medium">{text}</h1>;
  if (level === 3) return <h3 className="text-sm text-muted font-medium">{text}</h3>;
  return <h2 className="text-lg font-medium">{text}</h2>;
};

const Paragraph: ComponentRenderer<ComponentProps["Paragraph"]> = ({ element }) => (
  <p className="text-[14px] leading-relaxed text-text/90">{element.props.text}</p>
);

const Callout: ComponentRenderer<ComponentProps["Callout"]> = ({ element }) => {
  const { tone, title, text } = element.props;
  return (
    <div className={`rounded-xl border p-4 ${toneBg[tone]}`}>
      {title && <div className={`text-sm font-medium mb-1 ${toneText[tone]}`}>{title}</div>}
      <div className="text-[14px] leading-relaxed text-text/90">{text}</div>
    </div>
  );
};

const MetricGrid: ComponentRenderer<ComponentProps["MetricGrid"]> = ({ element }) => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
    {element.props.items.map((m, i) => (
      <div key={i} className={`rounded-xl border p-4 ${toneBg[m.tone ?? "neutral"]}`}>
        <div className="text-xs text-muted">{m.label}</div>
        <div className={`text-xl mt-1 ${toneText[m.tone ?? "neutral"]}`}>{m.value}</div>
        {m.hint && <div className="text-[11px] text-muted mt-1">{m.hint}</div>}
      </div>
    ))}
  </div>
);

const List: ComponentRenderer<ComponentProps["List"]> = ({ element }) => {
  const { style, items } = element.props;
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
};

const KeyValue: ComponentRenderer<ComponentProps["KeyValue"]> = ({ element }) => (
  <div className="rounded-xl border border-border bg-surface-2 divide-y divide-border">
    {element.props.items.map((kv, i) => (
      <div key={i} className="flex justify-between px-4 py-2 text-sm">
        <span className="text-muted">{kv.key}</span>
        <span className="text-text">{kv.value}</span>
      </div>
    ))}
  </div>
);

const Positions: ComponentRenderer<ComponentProps["Positions"]> = ({ element }) => {
  const { title, items } = element.props;
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
};

const Divider: ComponentRenderer<ComponentProps["Divider"]> = () => (
  <hr className="border-border my-2" />
);

const AllocationDonut: ComponentRenderer<ComponentProps["AllocationDonut"]> = ({ element }) => {
  const { title, items } = element.props;
  return (
    <ChartCard label={title ?? "Allocation"}>
      {items.length === 0 ? <EmptyChart /> : <AllocationDonutAI items={items} />}
    </ChartCard>
  );
};

const ChainBar: ComponentRenderer<ComponentProps["ChainBar"]> = ({ element }) => {
  const { title, items } = element.props;
  return (
    <ChartCard label={title ?? "Chains"}>
      {items.length === 0 ? <EmptyChart /> : <ChainBarAI items={items} />}
    </ChartCard>
  );
};

const ApyBar: ComponentRenderer<ComponentProps["ApyBar"]> = ({ element }) => {
  const { title, netLabel, items } = element.props;
  return (
    <ChartCard label={title ?? "APY contribution"}>
      {items.length === 0 ? <EmptyChart /> : <ApyBarAI items={items} netLabel={netLabel} />}
    </ChartCard>
  );
};

const HealthGauge: ComponentRenderer<ComponentProps["HealthGauge"]> = ({ element }) => {
  const { title, value, hint } = element.props;
  return (
    <ChartCard label={title ?? "Health factor"}>
      <HealthGaugeAI value={value} hint={hint} />
    </ChartCard>
  );
};

const registry: ComponentRegistry = {
  Root,
  Heading,
  Paragraph,
  Callout,
  MetricGrid,
  List,
  KeyValue,
  Positions,
  Divider,
  AllocationDonut,
  ChainBar,
  ApyBar,
  HealthGauge,
};

export function JsonRender({ spec }: { spec: Spec }) {
  return (
    // Registry must be passed to both JSONUIProvider (for context) and Renderer (required by type signature)
    <JSONUIProvider registry={registry}>
      <Renderer spec={spec} registry={registry} />
    </JSONUIProvider>
  );
}
