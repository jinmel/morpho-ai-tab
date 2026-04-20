import { riskScores } from "@/lib/data";

const AXES: { key: keyof typeof riskScores; label: string }[] = [
  { key: "concentration",  label: "Concentration" },
  { key: "liquidation",    label: "Liq Risk" },
  { key: "yieldQuality",   label: "Yield" },
  { key: "chainDiversity", label: "Chains" },
  { key: "assetDiversity", label: "Assets" },
];

export function RiskRadar() {
  const cx = 70;
  const cy = 60;
  const maxR = 40;
  const n = AXES.length;

  const axisAngle = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;

  const outerPts = AXES.map((_, i) => {
    const a = axisAngle(i);
    return [cx + Math.cos(a) * maxR, cy + Math.sin(a) * maxR] as const;
  });

  const scorePts = AXES.map((ax, i) => {
    const r = (riskScores[ax.key] / 10) * maxR;
    const a = axisAngle(i);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as const;
  });

  const polygon = (pts: readonly (readonly [number, number])[]) =>
    pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");

  const labelOffset = 10;
  const labelPts = AXES.map((_, i) => {
    const a = axisAngle(i);
    return [cx + Math.cos(a) * (maxR + labelOffset), cy + Math.sin(a) * (maxR + labelOffset)] as const;
  });

  return (
    <div className="flex items-center justify-center h-full">
      <svg viewBox="0 0 150 120" className="w-full" style={{ maxHeight: 130 }}>
        <polygon points={polygon(outerPts)} fill="none" stroke="#232634" strokeWidth="1" />
        <polygon
          points={polygon(scorePts)}
          fill="rgba(74,222,128,0.18)"
          stroke="#4ade80"
          strokeWidth="1.5"
        />
        {AXES.map((ax, i) => {
          const [lx, ly] = labelPts[i];
          const anchor = lx < cx - 2 ? "end" : lx > cx + 2 ? "start" : "middle";
          return (
            <text
              key={ax.key}
              x={lx}
              y={ly}
              fill="#8a8f9c"
              fontSize="7"
              textAnchor={anchor}
              dominantBaseline="middle"
            >
              {ax.label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
