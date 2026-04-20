import type { ActivityRow } from "@/lib/data";

type Props = { rows: ActivityRow[] };

function fmtUsd(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

export function ActivityTable({ rows }: Props) {
  return (
    <div>
      <div className="bg-surface rounded-lg px-4 py-3 mb-2 grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3">
        <div className="text-[11px] uppercase tracking-wide text-muted">Action</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Asset</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Amount</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Chain</div>
        <div className="text-[11px] uppercase tracking-wide text-muted">Date</div>
      </div>
      <div className="space-y-1.5">
        {rows.map((r, i) => (
          <div
            key={i}
            className="bg-surface-2 rounded-lg px-4 py-3.5 grid grid-cols-[1fr_1fr_1fr_1fr_1fr] gap-3 items-center"
          >
            <div>{r.action}</div>
            <div>{r.asset}</div>
            <div>{fmtUsd(r.amountUsd)}</div>
            <div className="text-muted">{r.chain}</div>
            <div className="text-muted">{r.date}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
