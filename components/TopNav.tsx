type Props = { address: string };

function truncate(addr: string): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function TopNav({ address }: Props) {
  return (
    <header className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold tracking-tight">Morpho</span>
          <nav className="flex items-center gap-5 text-sm">
            <span className="text-muted">Earn</span>
            <span className="text-muted">Borrow</span>
            <span className="text-muted">Explore</span>
            <span className="text-text">Dashboard</span>
          </nav>
        </div>
        <div className="rounded-full border border-border-2 px-3 py-1 text-sm text-text">
          {truncate(address)}
        </div>
      </div>
    </header>
  );
}
