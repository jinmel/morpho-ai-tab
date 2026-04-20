type Item = {
  name: string;
  pct: number;
  color?: string;
};

type Props = {
  items: Item[];
};

const FALLBACK_COLORS = ["#4ade80", "#60a5fa", "#fbbf24", "#f472b6", "#a78bfa", "#34d399"];

export function ChainBarAI({ items }: Props) {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex h-3.5 overflow-hidden rounded bg-bg">
        {items.map((item, index) => (
          <div
            key={item.name}
            style={{
              backgroundColor: item.color ?? FALLBACK_COLORS[index % FALLBACK_COLORS.length],
              width: `${item.pct}%`,
            }}
            className="h-full"
            title={`${item.name} ${item.pct}%`}
          />
        ))}
      </div>
      <div className="mt-2 text-[11px] text-muted">
        {items.map((item, index) => (
          <span key={item.name}>
            {index > 0 && " · "}
            {item.name} {item.pct}%
          </span>
        ))}
      </div>
    </div>
  );
}
