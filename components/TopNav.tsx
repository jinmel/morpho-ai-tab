import { ConnectWallet } from "./ConnectWallet";

export function TopNav() {
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
        <ConnectWallet />
      </div>
    </header>
  );
}
