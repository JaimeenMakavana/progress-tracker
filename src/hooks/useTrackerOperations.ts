import { useState, useCallback, useMemo } from "react";
import { useTrackers } from "../context/TrackersContext";
import { calculateProgress } from "../utils/progress";

export interface TrackerFormData {
  title: string;
  description: string;
}

export type ViewMode = "grid" | "groups";

export function useTrackerOperations() {
  const {
    state,
    isLoading,
    createTracker,
    deleteTracker,
    createGroup,
    updateGroup,
    deleteGroup,
    moveTrackerToGroup,
    enableStreakTracking,
    activateStreakProtection,
    createRecoveryPlan,
  } = useTrackers();

  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("groups");

  // Memoized filtered and sorted trackers
  const filteredAndSortedTrackers = useMemo(() => {
    const trackers = Object.values(state.trackers);

    if (!searchQuery.trim()) {
      return trackers.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
    }

    const query = searchQuery.toLowerCase();
    return trackers
      .filter(
        (tracker) =>
          tracker.title.toLowerCase().includes(query) ||
          tracker.description.toLowerCase().includes(query)
      )
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      );
  }, [state.trackers, searchQuery]);

  // Memoized tracker statistics
  const trackerStats = useMemo(() => {
    const totalTrackers = filteredAndSortedTrackers.length;
    const totalTasks = filteredAndSortedTrackers.reduce(
      (sum, tracker) => sum + Object.keys(tracker.tasks).length,
      0
    );
    const completedTasks = filteredAndSortedTrackers.reduce((sum, tracker) => {
      const progress = calculateProgress(tracker);
      return sum + progress.completed;
    }, 0);

    return { totalTrackers, totalTasks, completedTasks };
  }, [filteredAndSortedTrackers]);

  // Memoized handlers
  const handleOpenTracker = useCallback((id: string) => {
    window.location.href = `/tracker/${id}`;
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  return {
    // State
    state,
    isLoading,
    searchQuery,
    viewMode,
    filteredAndSortedTrackers,
    trackerStats,

    // Actions
    createTracker,
    deleteTracker,
    createGroup,
    updateGroup,
    deleteGroup,
    moveTrackerToGroup,
    enableStreakTracking,
    activateStreakProtection,
    createRecoveryPlan,

    // Handlers
    setSearchQuery,
    setViewMode,
    handleOpenTracker,
    handleClearSearch,
  };
}
