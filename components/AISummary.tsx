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

      <div className="rounded-xl border border-border bg-surface-2 p-7 leading-[1.7] text-[15px] space-y-3.5">
        {paragraphs.map((p, i) => (
          <p key={i} className="m-0">{renderWithBold(p)}</p>
        ))}
      </div>

      <p className="mt-4 text-[11px] leading-relaxed text-muted opacity-60">
        AI-generated analysis based on on-chain position data. Not financial advice. Always do your own research before making decisions.
      </p>
    </div>
  );
}
