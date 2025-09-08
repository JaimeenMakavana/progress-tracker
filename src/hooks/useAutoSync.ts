"use client";

import { useEffect, useRef } from "react";
import { useTrackers } from "../context/TrackersContext";
import multiGistSync from "../services/multiGistSync";

interface UseAutoSyncOptions {
  uploadDebounceMs?: number;
  pollIntervalMs?: number;
}

export function useAutoSync(options: UseAutoSyncOptions = {}) {
  const { uploadDebounceMs = 2000, pollIntervalMs = 30000 } = options;
  const { state, isGitHubConnected, syncWithGitHub } = useTrackers();

  const debounceTimerRef = useRef<number | null>(null);
  const pollingTimerRef = useRef<number | null>(null);
  const lastSerializedRef = useRef<string>("");
  const syncingRef = useRef<boolean>(false);

  // Debounced upload when local state changes
  useEffect(() => {
    if (!isGitHubConnected()) return;

    const nextSerialized = JSON.stringify(state);
    if (nextSerialized === lastSerializedRef.current) return;
    lastSerializedRef.current = nextSerialized;

    if (debounceTimerRef.current) window.clearTimeout(debounceTimerRef.current);
    debounceTimerRef.current = window.setTimeout(async () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      try {
        await syncWithGitHub();
      } finally {
        syncingRef.current = false;
      }
    }, uploadDebounceMs) as unknown as number;

    return () => {
      if (debounceTimerRef.current)
        window.clearTimeout(debounceTimerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, isGitHubConnected, syncWithGitHub, uploadDebounceMs]);

  // Event-driven sync on focus and regaining connectivity
  useEffect(() => {
    if (!isGitHubConnected()) return;

    const triggerSync = async () => {
      if (syncingRef.current) return;
      syncingRef.current = true;
      try {
        await syncWithGitHub();
      } finally {
        syncingRef.current = false;
      }
    };

    const onFocus = () => triggerSync();
    const onOnline = () => triggerSync();

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "visible") onFocus();
    });
    window.addEventListener("online", onOnline);

    return () => {
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("online", onOnline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGitHubConnected, syncWithGitHub]);

  // Periodic polling with visibility-aware backoff
  useEffect(() => {
    if (!isGitHubConnected()) return;

    const stopPolling = () => {
      if (pollingTimerRef.current)
        window.clearInterval(pollingTimerRef.current);
      pollingTimerRef.current = null;
    };

    const startPolling = () => {
      stopPolling();
      const interval =
        document.visibilityState === "visible"
          ? pollIntervalMs
          : pollIntervalMs * 4;
      pollingTimerRef.current = window.setInterval(async () => {
        if (!multiGistSync.isSyncNeeded()) return;
        if (syncingRef.current) return;
        syncingRef.current = true;
        try {
          await syncWithGitHub();
        } finally {
          syncingRef.current = false;
        }
      }, interval) as unknown as number;
    };

    startPolling();
    const onVis = () => startPolling();
    document.addEventListener("visibilitychange", onVis);

    return () => {
      stopPolling();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGitHubConnected, syncWithGitHub, pollIntervalMs]);
}
