import { z } from "zod";

export const BlockSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("heading"),
    text: z.string(),
    level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),
  }),
  z.object({
    type: z.literal("paragraph"),
    text: z.string(),
  }),
  z.object({
    type: z.literal("callout"),
    tone: z.enum(["positive", "neutral", "warning"]),
    title: z.string().optional(),
    text: z.string(),
  }),
  z.object({
    type: z.literal("metricGrid"),
    items: z.array(
      z.object({
        label: z.string(),
        value: z.string(),
        hint: z.string().optional(),
        tone: z.enum(["positive", "neutral", "warning"]).optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("list"),
    style: z.enum(["bullet", "check"]).optional(),
    items: z.array(z.string()),
  }),
  z.object({
    type: z.literal("keyValue"),
    items: z.array(z.object({ key: z.string(), value: z.string() })),
  }),
  z.object({
    type: z.literal("positions"),
    title: z.string().optional(),
    items: z.array(
      z.object({
        name: z.string(),
        kind: z.enum(["supply", "borrow"]),
        chain: z.string().optional(),
        balanceUsd: z.number().optional(),
        apyPct: z.number().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("divider"),
  }),
  z.object({
    type: z.literal("allocationDonut"),
    title: z.string().optional(),
    items: z.array(
      z.object({
        name: z.string(),
        pct: z.number(),
        color: z.string().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("chainBar"),
    title: z.string().optional(),
    items: z.array(
      z.object({
        name: z.string(),
        pct: z.number(),
        color: z.string().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("apyBar"),
    title: z.string().optional(),
    netLabel: z.string().optional(),
    items: z.array(
      z.object({
        name: z.string(),
        pts: z.number(),
        color: z.string().optional(),
      }),
    ),
  }),
  z.object({
    type: z.literal("healthGauge"),
    title: z.string().optional(),
    value: z.number(),
    hint: z.string().optional(),
  }),
]);

export const UiSchema = z.object({
  blocks: z.array(BlockSchema),
});

export type Block = z.infer<typeof BlockSchema>;
export type Ui = z.infer<typeof UiSchema>;
