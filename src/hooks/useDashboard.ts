import { useState, useEffect } from "react";
import { useTrackers } from "../context/TrackersContext";
import { calculateProgress } from "../utils/progress";
import { useKeyboardShortcuts, GLOBAL_SHORTCUTS } from "./useKeyboardShortcuts";

export const useDashboard = () => {
  const { state, isLoading, enableStreakTracking } = useTrackers();
  const [activeTab, setActiveTab] = useState<
    "overview" | "challenges" | "profile"
  >("overview");

  // Set up keyboard shortcuts
  useKeyboardShortcuts(GLOBAL_SHORTCUTS);

  // Listen for custom keyboard shortcut events
  useEffect(() => {
    const handleNewTracker = () => (window.location.href = "/tracker");
    const handleEscape = () => {
      // Handle escape if needed
    };

    document.addEventListener("shortcut:new-tracker", handleNewTracker);
    document.addEventListener("shortcut:escape", handleEscape);

    return () => {
      document.removeEventListener("shortcut:new-tracker", handleNewTracker);
      document.removeEventListener("shortcut:escape", handleEscape);
    };
  }, []);

  // Get all trackers for stats
  const trackers = Object.values(state.trackers);
  const totalTrackers = trackers.length;
  const completedTasks = trackers.reduce((sum, tracker) => {
    const progress = calculateProgress(tracker);
    return sum + progress.completed;
  }, 0);

  // v2 Gamification stats
  const userProfile = state.userProfile;
  const challenges = Object.values(state.challenges || {});
  const activeChallenges = challenges.filter(
    (c) => c.isActive && new Date(c.endDate) > new Date()
  );
  const totalPoints = userProfile?.totalPoints || 0;

  return {
    isLoading,
    activeTab,
    setActiveTab,
    trackers,
    totalTrackers,
    completedTasks,
    activeChallenges,
    totalPoints,
    enableStreakTracking,
  };
};
