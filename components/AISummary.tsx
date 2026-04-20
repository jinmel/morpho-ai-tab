import { ChartCard } from "./charts/ChartCard";
import { HealthGauge } from "./charts/HealthGauge";
import { AllocationDonut } from "./charts/AllocationDonut";
import { RiskRadar } from "./charts/RiskRadar";
import { ApyContributionBar } from "./charts/ApyContributionBar";
import { ChainDistribution } from "./charts/ChainDistribution";
import { StressCurve } from "./charts/StressCurve";
import { healthFactor } from "@/lib/data";

type Props = { paragraphs: string[] };

function renderWithBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i} className="text-text">{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

export function AISummary({ paragraphs }: Props) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">✨</span>
          <div>
            <div className="text-base">Portfolio Summary</div>
            <div className="text-xs text-muted">Generated just now · AI-powered analysis</div>
          </div>
        </div>
        <button
          type="button"
          className="rounded-md border border-border-2 px-3 py-1.5 text-xs text-text"
        >
          Regenerate
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-3">
        <ChartCard label="Health Factor" className="h-44">
          <HealthGauge value={healthFactor} />
        </ChartCard>
        <ChartCard label="Allocation" className="h-44">
          <AllocationDonut />
        </ChartCard>
        <ChartCard label="Risk Profile" className="h-44">
          <RiskRadar />
        </ChartCard>
      </div>

      <div className="rounded-xl border border-border bg-surface-2 p-6 leading-[1.7] text-[14px] space-y-3 mb-3">
        {paragraphs.map((p, i) => (
          <p key={i} className="m-0">{renderWithBold(p)}</p>
        ))}
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-3 mb-3">
        <ChartCard label="Net APY contribution" className="h-28">
          <ApyContributionBar />
        </ChartCard>
        <ChartCard label="Chain" className="h-28">
          <ChainDistribution />
        </ChartCard>
      </div>

      <ChartCard label="Liquidation stress · Health factor vs ETH drop" className="h-48 mb-3">
        <StressCurve />
      </ChartCard>

      <p className="text-[11px] leading-relaxed text-muted opacity-60">
        AI-generated analysis based on on-chain position data. Not financial advice. Always do your own research before making decisions.
      </p>
    </div>
  );
}
