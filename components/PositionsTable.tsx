import type { Position } from "@/lib/data";

type Props = { rows: Position[] };

function fmtBalance(kind: Position["kind"], balanceUsd: number): string {
  const sign = kind === "borrow" ? "-" : "";
  return `${sign}$${balanceUsd.toLocaleString("en-US")}`;
}

function fmtApy(apyPct: number): string {
  const sign = apyPct > 0 ? "+" : "";
  return `${sign}${apyPct.toFixed(1)}%`;
}

export function PositionsTable({ rows }: Props) {
  return (
    <div>
      <div className="bg-surface rounded-lg px-4 py-3 mb-2 grid grid-cols-[2fr_1fr_1fr_1fr] gap-3">
        <div className="text-[11px] uppercase tracking-wide text-muted">Vault / Market</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Balance</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">APY</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Chain</div>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div
            key={`${r.name}-${r.kind}`}
            className="bg-surface-2 rounded-lg px-4 py-3.5 grid grid-cols-[2fr_1fr_1fr_1fr] gap-3 items-center"
          >
            <div>{r.name}</div>
            <div>{fmtBalance(r.kind, r.balanceUsd)}</div>
            <div className={r.apyPct >= 0 ? "text-positive" : "text-negative"}>
              {fmtApy(r.apyPct)}
            </div>
            <div className="text-muted">{r.chain}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
