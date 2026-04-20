"use client";

import { useAccount, useConnect, useDisconnect } from "wagmi";
import { useState, useRef, useEffect } from "react";

function truncate(addr: string): string {
  if (addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

export function ConnectWallet() {
  const { address, isConnected } = useAccount();
  const { connect, connectors, isPending } = useConnect();
  const { disconnect } = useDisconnect();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (isConnected && address) {
    return (
      <div ref={ref} className="relative">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="rounded-full border border-border-2 px-3 py-1 text-sm text-text hover:bg-surface-2"
        >
          {truncate(address)}
        </button>
        {open && (
          <div className="absolute right-0 mt-1 w-40 rounded-md border border-border bg-surface-2 shadow-lg text-sm z-10">
            <button
              type="button"
              onClick={() => { disconnect(); setOpen(false); }}
              className="block w-full text-left px-3 py-2 hover:bg-surface text-text"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  const injectedConnectors = connectors.filter(c => c.type === "injected" || c.id === "injected" || c.id === "metaMaskSDK");
  const visible = injectedConnectors.length ? injectedConnectors : connectors;

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        disabled={isPending}
        className="rounded-full border border-border-2 px-3 py-1 text-sm text-text hover:bg-surface-2 disabled:opacity-60"
      >
        {isPending ? "Connecting…" : "Connect Wallet"}
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 rounded-md border border-border bg-surface-2 shadow-lg text-sm z-10">
          {visible.length === 0 && (
            <div className="px-3 py-2 text-muted">No wallet detected</div>
          )}
          {visible.map(c => (
            <button
              key={c.uid}
              type="button"
              onClick={() => { connect({ connector: c }); setOpen(false); }}
              className="block w-full text-left px-3 py-2 hover:bg-surface text-text"
            >
              {c.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
