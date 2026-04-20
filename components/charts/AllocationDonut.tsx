"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { allocationData } from "@/lib/data";

export function AllocationDonut() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-full" style={{ height: 110 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={allocationData}
              dataKey="pct"
              nameKey="name"
              innerRadius={30}
              outerRadius={50}
              stroke="none"
              isAnimationActive={false}
            >
              {allocationData.map((slice) => (
                <Cell key={slice.name} fill={slice.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 w-full flex justify-between text-[11px] text-muted">
        {allocationData.map((slice) => (
          <span key={slice.name}>
            <span
              className="inline-block w-2 h-2 rounded-sm mr-1 align-middle"
              style={{ backgroundColor: slice.color }}
            />
            {slice.name.split(" ")[0]} {slice.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}
