"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useTrackers } from "../context/TrackersContext";
import { SyncButton } from "../components";
import { StreakDashboard } from "../components/streak";
import { FloatingKeyboardShortcuts } from "../components/ui";
import { calculateProgress } from "../utils/progress";
import {
  useKeyboardShortcuts,
  GLOBAL_SHORTCUTS,
} from "../hooks/useKeyboardShortcuts";

export default function Dashboard() {
  const { state, isLoading, enableStreakTracking } = useTrackers();

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
  const totalTasks = trackers.reduce(
    (sum, tracker) => sum + Object.keys(tracker.tasks).length,
    0
  );
  const completedTasks = trackers.reduce((sum, tracker) => {
    const progress = calculateProgress(tracker);
    return sum + progress.completed;
  }, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress trackers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gray-50">
      <div className="max-w-7xl mx-auto p-4">
        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Active Trackers
                </p>
                <p className="text-xl font-bold text-primary">
                  {totalTrackers}
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Completed Tasks
                </p>
                <p className="text-xl font-bold text-green-600">
                  {completedTasks}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Tasks
                </p>
                <p className="text-xl font-bold text-gray-900">{totalTasks}</p>
              </div>
              <div className="p-2 bg-gray-100 rounded-lg">
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Overall Progress
                </p>
                <p className="text-xl font-bold text-primary">
                  {totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0}
                  %
                </p>
              </div>
              <div className="p-2 bg-primary/10 rounded-lg">
                <svg
                  className="w-5 h-5 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Streak Dashboard */}
        {trackers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-6"
          >
            <div className="rounded-xl  shadow-sm">
              <StreakDashboard
                trackers={trackers}
                onEnableStreak={enableStreakTracking}
                onViewTracker={(id) =>
                  (window.location.href = `/tracker/${id}`)
                }
              />
            </div>
          </motion.div>
        )}

        {/* Floating GitHub Sync Button */}
        <div className="fixed bottom-20 right-6 z-[100]">
          <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full aspect-square shadow-lg flex items-center justify-center p-[6px]">
            <SyncButton />
          </div>
        </div>

        {/* Floating Keyboard Shortcuts */}
        <FloatingKeyboardShortcuts />
      </div>
    </div>
  );
}
