import { useEffect, useMemo, useState } from "react";
import { getVehicleVariablesList, VinApiError } from "../../api/vinApi";
import { VariableCard } from "../../components/VariableCard/VariableCard";
import type { VehicleVariable } from "../../types/vin";

export function VariablesPage() {
  const [variables, setVariables] = useState<VehicleVariable[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;

    getVehicleVariablesList()
      .then((list) => {
        if (!cancelled) setVariables(list);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err instanceof VinApiError ? err.message : "Не вдалося завантажити список змінних.");
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = useMemo(() => {
    if (!variables) return [];
    const normalized = query.trim().toLowerCase();
    if (!normalized) return variables;
    return variables.filter((item) => item.Name.toLowerCase().includes(normalized));
  }, [variables, query]);

  return (
    <div>
      <h1 className="mb-2 text-2xl">Змінні vPIC</h1>
      <p className="mb-6 max-w-[60ch] text-text-muted">
        Повний перелік характеристик, які може повернути сервіс NHTSA при розшифровці VIN-коду.
      </p>

      {error && (
        <p
          className="rounded border border-danger bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
          role="alert"
        >
          {error}
        </p>
      )}

      {!error && !variables && <p className="text-text-muted">Завантаження…</p>}

      {variables && (
        <>
          <label
            className="mb-2 block text-sm font-semibold uppercase tracking-wider text-text-muted"
            htmlFor="variables-search"
          >
            Пошук за назвою
          </label>
          <input
            id="variables-search"
            className="mb-2 w-full rounded border border-border bg-surface px-3.5 py-2.5 text-sm text-text focus-visible:border-accent focus-visible:outline-none"
            type="search"
            placeholder="напр. Model Year"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />

          <p className="mb-4 text-xs text-text-muted">Знайдено: {filtered.length}</p>

          <ul className="card max-h-[70vh] overflow-y-auto p-0">
            {filtered.map((variable) => (
              <VariableCard key={variable.ID} variable={variable} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
