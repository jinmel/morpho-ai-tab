type Props = {
  value: number;
  hint?: string;
};

const MIN = 1.0;
const MAX = 3.0;

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

function polar(cx: number, cy: number, r: number, angleDeg: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function HealthGaugeAI({ value, hint }: Props) {
  const cx = 70;
  const cy = 70;
  const r = 55;

  const fraction = clamp((value - MIN) / (MAX - MIN), 0, 1);
  const needleAngle = -180 + 180 * fraction;
  const [nx, ny] = polar(cx, cy, r - 10, needleAngle);

  const arc = (startDeg: number, endDeg: number) => {
    const [sx, sy] = polar(cx, cy, r, startDeg);
    const [ex, ey] = polar(cx, cy, r, endDeg);
    const largeArc = Math.abs(endDeg - startDeg) > 180 ? 1 : 0;
    return `M ${sx} ${sy} A ${r} ${r} 0 ${largeArc} 1 ${ex} ${ey}`;
  };

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <svg viewBox="0 0 140 90" className="w-full" style={{ maxHeight: 110 }}>
        <path d={arc(-180, 0)} fill="none" stroke="#232634" strokeWidth="12" strokeLinecap="round" />
        <path d={arc(-180, -120)} fill="none" stroke="#f87171" strokeWidth="12" strokeLinecap="round" />
        <path d={arc(-120, -60)} fill="none" stroke="#fbbf24" strokeWidth="12" strokeLinecap="round" />
        <path d={arc(-60, 0)} fill="none" stroke="#4ade80" strokeWidth="12" strokeLinecap="round" />
        <line x1={cx} y1={cy} x2={nx} y2={ny} stroke="#e8e8ea" strokeWidth="2" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="3" fill="#e8e8ea" />
      </svg>
      <div className="mt-1 text-lg font-medium">{value.toFixed(2)}</div>
      {hint ? <div className="mt-1 text-[11px] text-muted">{hint}</div> : null}
    </div>
  );
}
