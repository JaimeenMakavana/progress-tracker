import { useState, useEffect } from "react";
import { get, set, del } from "idb-keyval";

export function useIndexedDB<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (typeof window === "undefined") {
          setState(initialValue);
          setIsLoading(false);
          return;
        }

        const stored = await get(key);
        if (stored !== undefined) {
          setState(stored);
        } else {
          setState(initialValue);
        }
      } catch (e) {
        console.error("useIndexedDB read error", e);
        setState(initialValue);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [key, initialValue]);

  const setValue = async (value: T) => {
    try {
      setState(value);
      if (typeof window !== "undefined") {
        await set(key, value);
      }
    } catch (e) {
      console.error("useIndexedDB write error", e);
    }
  };

  const deleteValue = async () => {
    try {
      setState(initialValue);
      if (typeof window !== "undefined") {
        await del(key);
      }
    } catch (e) {
      console.error("useIndexedDB delete error", e);
    }
  };

  return [state, setValue, deleteValue, isLoading] as const;
}
