import { Link } from "react-router-dom";
import type { DecodeVinResult } from "../../types/vin";

interface DecodeResultsProps {
  vin: string;
  results: DecodeVinResult[];
}

export function DecodeResults({ vin, results }: DecodeResultsProps) {
  if (results.length === 0) {
    return (
      <p className="mt-6 text-text-muted">
        Для цього VIN-коду не знайдено заповнених характеристик.
      </p>
    );
  }

  return (
    <section className="mt-8" aria-label={`Результати розшифровки ${vin}`}>
      <h2 className="mb-4 text-lg font-semibold">
        Результат для{" "}
        <span className="font-mono tracking-wide text-accent">{vin}</span>
      </h2>
      <dl className="flex flex-col overflow-hidden rounded-lg border border-border">
        {results.map((item) => (
          <div
            className="grid grid-cols-[minmax(160px,1fr)_minmax(0,1.4fr)] gap-4 border-b border-border px-4 py-2.5 odd:bg-surface last:border-b-0 max-[560px]:grid-cols-1 max-[560px]:gap-0.5"
            key={item.VariableId}
          >
            <dt className="self-center text-sm text-text-muted">
              <Link
                to={`/variables/${item.VariableId}`}
                className="text-text-muted hover:text-accent"
              >
                {item.Variable}
              </Link>
            </dt>
            <dd className="m-0 self-center font-medium break-words">{item.Value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
