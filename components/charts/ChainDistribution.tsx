import { chainDistribution } from "@/lib/data";

export function ChainDistribution() {
  return (
    <div className="flex flex-col justify-center h-full">
      <div className="flex h-3.5 rounded overflow-hidden bg-bg">
        {chainDistribution.map((s) => (
          <div
            key={s.name}
            style={{ backgroundColor: s.color, width: `${s.pct}%` }}
            className="h-full"
            title={`${s.name} ${s.pct}%`}
          />
        ))}
      </div>
      <div className="mt-2 text-[11px] text-muted">
        {chainDistribution.map((s, i) => (
          <span key={s.name}>
            {i > 0 && " · "}
            {s.name} {s.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}
