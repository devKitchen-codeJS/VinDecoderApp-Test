import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getVehicleVariableById, VinApiError } from "../../api/vinApi";
import type { VehicleVariable } from "../../types/vin";

interface VariableDetailsProps {
  variableId: string;
}

/**
 * Fetches and renders a single variable. Mounted fresh (via `key`) whenever
 * `variableId` changes, so its state never needs to be reset imperatively
 * from inside the effect — the effect only calls setState from the async
 * callback once the request settles, which is the pattern React recommends.
 */
function VariableDetails({ variableId }: VariableDetailsProps) {
  const numericId = Number(variableId);
  const isValidId = variableId.length > 0 && !Number.isNaN(numericId);

  const [variable, setVariable] = useState<VehicleVariable | null | undefined>(
    undefined,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isValidId) return;

    let cancelled = false;

    getVehicleVariableById(numericId)
      .then((found) => {
        if (!cancelled) setVariable(found ?? null);
      })
      .catch((err) => {
        if (!cancelled) {
          setError(
            err instanceof VinApiError
              ? err.message
              : "Не вдалося завантажити змінну.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [numericId, isValidId]);

  if (!isValidId) {
    return <p>Змінну з ідентифікатором «{variableId}» не знайдено.</p>;
  }

  return (
    <>
      {error && (
        <p
          className='rounded border border-danger bg-danger/10 px-3.5 py-2.5 text-sm text-danger'
          role='alert'>
          {error}
        </p>
      )}

      {variable === undefined && !error && <p>Завантаження…</p>}

      {variable === null && !error && (
        <p>Змінну з ідентифікатором «{variableId}» не знайдено.</p>
      )}

      {variable && (
        <article className='card max-w-[68ch]'>
          <p className='mb-2 font-mono text-sm text-accent'>#{variable.ID}</p>
          <h1 className='mb-4 text-2xl'>{variable.Name}</h1>
          <p className='whitespace-pre-line leading-relaxed text-text-muted'>
            {variable.Description || "Опис для цієї змінної відсутній."}
          </p>
        </article>
      )}
    </>
  );
}

export function VariableDetailsPage() {
  const { variableId } = useParams<{ variableId: string }>();

  return (
    <div>
      <Link
        to='/variables'
        className='mb-6 inline-block text-sm text-text-muted hover:text-accent'>
        ← Усі змінні
      </Link>

      {/* key remounts VariableDetails on every param change, replacing the
          manual "reset state in effect" pattern. */}
      {variableId && (
        <VariableDetails key={variableId} variableId={variableId} />
      )}
    </div>
  );
}
