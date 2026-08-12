import { DecodeResults } from "../../components/DecodeResults/DecodeResults";
import { VinForm } from "../../components/VinForm/VinForm";
import { VinHistory } from "../../components/VinHistory/VinHistory";
import { useVinDecoder } from "../../hooks/useVinDecoder";

export function HomePage() {
  const { results, currentVin, isLoading, error, history, decode, applyHistoryEntry } =
    useVinDecoder();

  return (
    <div>
      <section className="mb-6 flex flex-col gap-2">
        <h1 className="text-3xl max-[480px]:text-2xl">VIN Decoder</h1>
        <p className="max-w-[60ch] text-text-muted">
          Введіть 17-значний VIN-код автомобіля, щоб отримати розшифровку його
          характеристик за даними NHTSA.
        </p>
      </section>

      <div className="card">
        <VinForm onSubmit={decode} isLoading={isLoading} />

        {error && (
          <p
            className="mt-4 rounded border border-danger bg-danger/10 px-3.5 py-2.5 text-sm text-danger"
            role="alert"
          >
            {error}
          </p>
        )}

        <VinHistory history={history} activeVin={currentVin} onSelect={applyHistoryEntry} />
      </div>

      {results && <DecodeResults vin={currentVin} results={results} />}
    </div>
  );
}
