import { useState, useEffect } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    try {
      if (typeof window === "undefined") return initialValue;
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch (e) {
      console.error("useLocalStorage read error", e);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(key, JSON.stringify(state));
      }
    } catch (e) {
      console.error("useLocalStorage write error", e);
    }
  }, [key, state]);

  return [state, setState] as const;
}
