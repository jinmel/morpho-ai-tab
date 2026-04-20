type Props = {
  netWorthUsd: number;
  suppliedUsd: number;
  borrowedUsd: number;
  netApyPct: number;
};

function fmtUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

function Card({ label, value, valueClassName }: { label: string; value: string; valueClassName?: string }) {
  return (
    <div className="bg-surface rounded-lg px-4 py-3">
      <div className="text-[11px] uppercase tracking-wide text-muted">{label}</div>
      <div className={`mt-1.5 text-lg font-medium ${valueClassName ?? ""}`}>{value}</div>
    </div>
  );
}

export function SummaryCards({ netWorthUsd, suppliedUsd, borrowedUsd, netApyPct }: Props) {
  return (
    <div className="grid grid-cols-4 gap-3">
      <Card label="Net Worth" value={fmtUsd(netWorthUsd)} />
      <Card label="Supplied" value={fmtUsd(suppliedUsd)} />
      <Card label="Borrowed" value={fmtUsd(borrowedUsd)} />
      <Card
        label="Net APY"
        value={`+${netApyPct.toFixed(2)}%`}
        valueClassName="text-positive"
      />
    </div>
  );
}
