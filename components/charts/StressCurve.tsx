"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import { stressCurve } from "@/lib/data";

export function StressCurve() {
  return (
    <div className="h-full" style={{ minHeight: 140 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={stressCurve}
          margin={{ top: 10, right: 16, bottom: 18, left: 0 }}
        >
          <XAxis
            dataKey="ethDropPct"
            tick={{ fill: "#8a8f9c", fontSize: 10 }}
            tickFormatter={(v) => `-${v}%`}
            stroke="#232634"
            label={{
              value: "ETH price drop",
              position: "insideBottom",
              offset: -10,
              fill: "#8a8f9c",
              fontSize: 10,
            }}
          />
          <YAxis
            dataKey="hf"
            tick={{ fill: "#8a8f9c", fontSize: 10 }}
            stroke="#232634"
            domain={[0.8, 2.0]}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <ReferenceLine
            y={1}
            stroke="#f87171"
            strokeDasharray="3 3"
            label={{ value: "HF = 1.0", position: "insideBottomRight", fill: "#f87171", fontSize: 10 }}
          />
          <Line
            type="monotone"
            dataKey="hf"
            stroke="#4ade80"
            strokeWidth={2}
            dot={{ fill: "#4ade80", r: 3 }}
            isAnimationActive={false}
          />
          <ReferenceDot x={30} y={1.28} r={4} fill="#fbbf24" stroke="none" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
