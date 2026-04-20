"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Item = {
  name: string;
  pct: number;
  color?: string;
};

type Props = {
  items: Item[];
};

const FALLBACK_COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#34d399"];

export function AllocationDonutAI({ items }: Props) {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="w-full" style={{ height: 110 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={items}
              dataKey="pct"
              nameKey="name"
              innerRadius={30}
              outerRadius={50}
              stroke="none"
              isAnimationActive={false}
            >
              {items.map((slice, index) => (
                <Cell
                  key={slice.name}
                  fill={slice.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 flex w-full justify-between text-[11px] text-muted">
        {items.map((slice, index) => {
          const color = slice.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length];

          return (
            <span key={slice.name}>
              <span
                className="mr-1 inline-block h-2 w-2 rounded-sm align-middle"
                style={{ backgroundColor: color }}
              />
              {slice.name.split(" ")[0]} {slice.pct}%
            </span>
          );
        })}
      </div>
    </div>
  );
}
