import { useCallback, useState } from "react";

/**
 * Persists a piece of state to localStorage under `key`.
 * Falls back gracefully (in-memory only) if localStorage is unavailable.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setStoredValue = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = next instanceof Function ? next(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          // Storage may be full or disabled — keep working in-memory.
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, setStoredValue] as const;
}
