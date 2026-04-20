export type TabId = "positions" | "activity" | "ai";

type Tab = { id: TabId; label: string };

const TABS: Tab[] = [
  { id: "positions", label: "Positions" },
  { id: "activity",  label: "Activity" },
  { id: "ai",        label: "AI ✨" },
];

type Props = {
  active: TabId;
  onChange: (id: TabId) => void;
};

export function TabBar({ active, onChange }: Props) {
  return (
    <div className="flex gap-1 border-b border-border">
      {TABS.map((t) => {
        const isActive = t.id === active;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className={`px-4 py-2.5 text-sm transition-colors ${
              isActive
                ? "border-b-2 border-text text-text"
                : "text-muted hover:text-text"
            }`}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
