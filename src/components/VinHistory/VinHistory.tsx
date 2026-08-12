import type { DecodeHistoryEntry } from "../../types/vin";

interface VinHistoryProps {
  history: DecodeHistoryEntry[];
  activeVin?: string;
  onSelect: (entry: DecodeHistoryEntry) => void;
}

export function VinHistory({ history, activeVin, onSelect }: VinHistoryProps) {
  if (history.length === 0) {
    return null;
  }

  return (
    <section className="mt-6" aria-label="Останні розшифровані VIN-коди">
      <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-text-muted">
        Останні запити
      </h2>
      <ul className="flex flex-wrap gap-2">
        {history.map((entry) => (
          <li key={entry.vin}>
            <button
              type="button"
              className={[
                "flex flex-col items-start gap-0.5 rounded border px-3 py-2 transition-colors",
                entry.vin === activeVin
                  ? "border-accent bg-surface-raised"
                  : "border-border bg-surface hover:border-accent-dim",
              ].join(" ")}
              onClick={() => onSelect(entry)}
            >
              <span className="font-mono text-sm tracking-wide text-text">{entry.vin}</span>
              <span className="text-[0.72rem] text-text-muted">
                {new Date(entry.decodedAt).toLocaleString("uk-UA", {
                  day: "2-digit",
                  month: "2-digit",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
