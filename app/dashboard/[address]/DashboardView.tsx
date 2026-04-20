"use client";

import { useState } from "react";
import { TopNav } from "@/components/TopNav";
import { SummaryCards } from "@/components/SummaryCards";
import { TabBar, type TabId } from "@/components/TabBar";
import { PositionsTable } from "@/components/PositionsTable";
import { ActivityTable } from "@/components/ActivityTable";
import { GenerativeAI } from "@/components/GenerativeAI";
import { positions, activity, summary } from "@/lib/data";

export function DashboardView({ address }: { address: string }) {
  const [tab, setTab] = useState<TabId>("positions");

  return (
    <div>
      <TopNav />

      <main className="mx-auto max-w-6xl px-6 py-6">
        <div className="mb-5">
          <div className="text-xl">Dashboard</div>
          <div className="text-xs text-muted mt-0.5">{address}</div>
        </div>

        <div className="mb-6">
          <SummaryCards {...summary} />
        </div>

        <div className="mb-4">
          <TabBar active={tab} onChange={setTab} />
        </div>

        <div>
          {tab === "positions" && <PositionsTable rows={positions} />}
          {tab === "activity"  && <ActivityTable rows={activity} />}
          {tab === "ai"        && <GenerativeAI fallbackAddress={address} />}
        </div>
      </main>
    </div>
  );
}
