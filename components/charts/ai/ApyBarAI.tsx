type Item = {
  name: string;
  pts: number;
  color?: string;
};

type Props = {
  items: Item[];
  netLabel?: string;
};

const FALLBACK_COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#34d399"];

export function ApyBarAI({ items, netLabel }: Props) {
  const totalMagnitude = items.reduce((sum, item) => sum + Math.abs(item.pts), 0);
  const net = items.reduce((sum, item) => sum + item.pts, 0);
  const netClassName = net >= 0 ? "text-positive" : "text-negative";
  const defaultNetValue = `${net > 0 ? "+" : ""}${net.toFixed(2)}%`;

  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex h-7 items-center overflow-hidden rounded bg-bg">
        {items.map((item, index) => {
          const widthPct = totalMagnitude === 0 ? 0 : (Math.abs(item.pts) / totalMagnitude) * 100;
          const sign = item.pts > 0 ? "+" : "";
          const shortName = item.name.split(" ")[0];

          return (
            <div
              key={item.name}
              style={{
                backgroundColor: item.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
                width: `${widthPct}%`,
              }}
              className="flex h-full items-center overflow-hidden whitespace-nowrap px-2 text-[10px] font-medium text-bg"
              title={`${item.name} ${sign}${item.pts}`}
            >
              {shortName} {sign}
              {item.pts}
            </div>
          );
        })}
      </div>
      <div className="mt-2 text-[11px] text-muted">
        {netLabel ? (
          <strong className={netClassName}>{netLabel}</strong>
        ) : (
          <>
            Net: <strong className={netClassName}>{defaultNetValue}</strong>
          </>
        )}
      </div>
    </div>
  );
}
