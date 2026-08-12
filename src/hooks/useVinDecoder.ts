import { useCallback, useState } from "react";
import { decodeVin, VinApiError } from "../api/vinApi";
import type { DecodeHistoryEntry, DecodeVinResult } from "../types/vin";
import { validateVin } from "../utils/vinValidation";
import { useLocalStorage } from "./useLocalStorage";

const HISTORY_KEY = "vin-decoder:history";
const HISTORY_LIMIT = 3;

export function useVinDecoder() {
  const [results, setResults] = useState<DecodeVinResult[] | null>(null);
  const [currentVin, setCurrentVin] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useLocalStorage<DecodeHistoryEntry[]>(
    HISTORY_KEY,
    []
  );

  const pushToHistory = useCallback(
    (entry: DecodeHistoryEntry) => {
      setHistory((prev) => {
        const withoutDuplicate = prev.filter((item) => item.vin !== entry.vin);
        return [entry, ...withoutDuplicate].slice(0, HISTORY_LIMIT);
      });
    },
    [setHistory]
  );

  const decode = useCallback(
    async (rawVin: string) => {
      const { isValid, error: validationError } = validateVin(rawVin);
      if (!isValid) {
        setError(validationError);
        setResults(null);
        return;
      }

      const vin = rawVin.trim().toUpperCase();
      setIsLoading(true);
      setError(null);

      try {
        const response = await decodeVin(vin);

        const hasErrorCode = /^\s*Error/i.test(response.Message ?? "") &&
          !/successful/i.test(response.Message ?? "");

        if (!response.Results || response.Results.length === 0 || hasErrorCode) {
          setError(response.Message || "Не вдалося розшифрувати VIN-код.");
          setResults(null);
          return;
        }

        const filled = response.Results.filter(
          (item) => item.Value !== null && item.Value !== "" && item.Value !== "Not Applicable"
        );

        setResults(filled);
        setCurrentVin(vin);
        pushToHistory({
          vin,
          decodedAt: new Date().toISOString(),
          results: filled,
        });
      } catch (err) {
        setResults(null);
        setError(err instanceof VinApiError ? err.message : "Сталася невідома помилка.");
      } finally {
        setIsLoading(false);
      }
    },
    [pushToHistory]
  );

  const applyHistoryEntry = useCallback((entry: DecodeHistoryEntry) => {
    setResults(entry.results);
    setCurrentVin(entry.vin);
    setError(null);
  }, []);

  return {
    results,
    currentVin,
    isLoading,
    error,
    history,
    decode,
    applyHistoryEntry,
  };
}
