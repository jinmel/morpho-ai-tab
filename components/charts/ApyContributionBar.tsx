import { apyContribution } from "@/lib/data";

export function ApyContributionBar() {
  const totalMagnitude = apyContribution.reduce((sum, s) => sum + Math.abs(s.pts), 0);
  const net = apyContribution.reduce((sum, s) => sum + s.pts, 0);

  return (
    <div className="flex flex-col justify-center h-full">
      <div className="flex items-center h-7 rounded overflow-hidden bg-bg">
        {apyContribution.map((s) => {
          const widthPct = (Math.abs(s.pts) / totalMagnitude) * 100;
          const sign = s.pts > 0 ? "+" : "";
          const short = s.name.split(" ")[0];
          return (
            <div
              key={s.name}
              style={{ backgroundColor: s.color, width: `${widthPct}%` }}
              className="h-full flex items-center px-2 text-[10px] text-bg font-medium whitespace-nowrap overflow-hidden"
              title={`${s.name} ${sign}${s.pts}`}
            >
              {short} {sign}{s.pts}
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-[11px] text-muted">
        Net: <strong className="text-positive">+{net.toFixed(2)}%</strong>
      </div>
    </div>
  );
}
