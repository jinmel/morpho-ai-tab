import type { ReactNode } from "react";

type Props = {
  label: string;
  className?: string;
  children: ReactNode;
};

export function ChartCard({ label, className, children }: Props) {
  return (
    <div
      className={`bg-surface-2 border border-border rounded-lg p-3 flex flex-col ${className ?? ""}`}
    >
      <div className="text-[11px] uppercase tracking-wide text-muted mb-2">
        {label}
      </div>
      <div className="flex-1 min-h-0 h-full">{children}</div>
    </div>
  );
}
