import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { z } from "zod";

const tone = z.enum(["positive", "neutral", "warning"]);

const allocationItem = z.object({
  name: z.string(),
  pct: z.number(),
  color: z.string().optional(),
});

export const componentSchemas = {
  Root: z.object({}),
  Heading: z.object({
    text: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  }),
  Paragraph: z.object({ text: z.string() }),
  Callout: z.object({
    tone,
    title: z.string().optional(),
    text: z.string(),
  }),
  MetricGrid: z.object({
    items: z.array(z.object({
      label: z.string(),
      value: z.string(),
      hint: z.string().optional(),
      tone: tone.optional(),
    })),
  }),
  List: z.object({
    style: z.enum(["bullet", "check"]).optional(),
    items: z.array(z.string()),
  }),
  KeyValue: z.object({
    items: z.array(z.object({ key: z.string(), value: z.string() })),
  }),
  Positions: z.object({
    title: z.string().optional(),
    items: z.array(z.object({
      name: z.string(),
      kind: z.enum(["supply", "borrow"]),
      chain: z.string().optional(),
      balanceUsd: z.number().optional(),
      apyPct: z.number().optional(),
    })),
  }),
  Divider: z.object({}),
  AllocationDonut: z.object({
    title: z.string().optional(),
    items: z.array(allocationItem),
  }),
  ChainBar: z.object({
    title: z.string().optional(),
    items: z.array(allocationItem),
  }),
  ApyBar: z.object({
    title: z.string().optional(),
    netLabel: z.string().optional(),
    items: z.array(z.object({
      name: z.string(),
      pts: z.number(),
      color: z.string().optional(),
    })),
  }),
  HealthGauge: z.object({
    title: z.string().optional(),
    value: z.number(),
    hint: z.string().optional(),
  }),
} as const;

export type ComponentProps = { [K in keyof typeof componentSchemas]: z.infer<typeof componentSchemas[K]> };

export const catalog = defineCatalog(schema, {
  // Components that render children must declare slots: ["default"] to ensure child content is rendered.
  components: {
    Root: {
      props: componentSchemas.Root,
      slots: ["default"],
      description: "Top-level container. Must be the spec root; lists all top-level blocks as children.",
    },
    Heading: {
      props: componentSchemas.Heading,
      description: "Section heading. Level 2 is the default.",
    },
    Paragraph: {
      props: componentSchemas.Paragraph,
      description: "Short paragraph of explanatory copy.",
    },
    Callout: {
      props: componentSchemas.Callout,
      description: "Highlighted notice. Use tone=warning when health factor is low, positive when strong, neutral otherwise.",
    },
    MetricGrid: {
      props: componentSchemas.MetricGrid,
      description: "Grid of 3–5 high-signal metric tiles (e.g. Net worth, Net APY, Health factor).",
    },
    List: {
      props: componentSchemas.List,
      description: "Bullet or check list of short strings.",
    },
    KeyValue: {
      props: componentSchemas.KeyValue,
      description: "Two-column key/value rows.",
    },
    Positions: {
      props: componentSchemas.Positions,
      description: "Table of supply/borrow positions with balance and APY.",
    },
    Divider: {
      props: componentSchemas.Divider,
      description: "Horizontal rule between sections.",
    },
    AllocationDonut: {
      props: componentSchemas.AllocationDonut,
      description: "Donut chart of supply allocation by market share. Emit when ≥2 supply positions have USD balances.",
    },
    ChainBar: {
      props: componentSchemas.ChainBar,
      description: "Stacked bar of wallet distribution across chains. Emit when positions exist on both Base and Ethereum.",
    },
    ApyBar: {
      props: componentSchemas.ApyBar,
      description: "Per-position APY contribution bars. pts = balanceUsd × apyPct / totalSupply.",
    },
    HealthGauge: {
      props: componentSchemas.HealthGauge,
      description: "Borrow health factor gauge. Emit only when a borrow exists and MCP returned a health factor.",
    },
  },
  actions: {},
});
