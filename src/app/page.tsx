"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTrackers } from "../context/TrackersContext";
import { SyncButton } from "../components";
import { TrackerCard } from "../components/tasks";
import { StreakDashboard } from "../components/streak";
import { FloatingKeyboardShortcuts } from "../components/ui";
import GroupedTrackers from "../components/trackers/GroupedTrackers";
import GroupManager from "../components/groups/GroupManager";
import { calculateProgress } from "../utils/progress";
import {
  useKeyboardShortcuts,
  GLOBAL_SHORTCUTS,
} from "../hooks/useKeyboardShortcuts";

export default function Dashboard() {
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
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTrackerTitle, setNewTrackerTitle] = useState("");
  const [newTrackerDescription, setNewTrackerDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showGroupManager, setShowGroupManager] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "groups">("groups");

  // Set up keyboard shortcuts
  useKeyboardShortcuts(GLOBAL_SHORTCUTS);

  // Listen for custom keyboard shortcut events
  useEffect(() => {
    const handleNewTracker = () => setShowCreateForm(true);
    const handleEscape = () => {
      setShowCreateForm(false);
    };

    document.addEventListener("shortcut:new-tracker", handleNewTracker);
    document.addEventListener("shortcut:escape", handleEscape);

    return () => {
      document.removeEventListener("shortcut:new-tracker", handleNewTracker);
      document.removeEventListener("shortcut:escape", handleEscape);
    };
  }, []);

  // Filter and sort trackers (simplified)
  const filteredAndSortedTrackers = React.useMemo(() => {
    let filtered = Object.values(state.trackers);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (tracker) =>
          tracker.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tracker.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Sort by most recently updated (most useful default)
    filtered.sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );

    return filtered;
  }, [state.trackers, searchQuery]);

  const trackers = filteredAndSortedTrackers;
  const totalTrackers = trackers.length;
  const totalTasks = trackers.reduce(
    (sum, tracker) => sum + Object.keys(tracker.tasks).length,
    0
  );
  const completedTasks = trackers.reduce((sum, tracker) => {
    const progress = calculateProgress(tracker);
    return sum + progress.completed;
  }, 0);

  const handleCreateTracker = () => {
    if (newTrackerTitle.trim()) {
      createTracker({
        title: newTrackerTitle.trim(),
        description: newTrackerDescription.trim(),
      });
      setNewTrackerTitle("");
      setNewTrackerDescription("");
      setShowCreateForm(false);
    }
  };

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <h2 className="text-2xl sm:text-3xl font-bold text-black mb-2">
                  Your Progress Dashboard
                </h2>
                <p className="text-gray-600">
                  Manage and track all your projects in one place
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <SyncButton />
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-primary flex items-center justify-center gap-2 px-4 sm:px-6 py-3 whitespace-nowrap"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  <span className="hidden sm:inline">New Tracker</span>
                  <span className="sm:hidden">New</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards with Blue Theme */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="blue-card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-4 bg-primary rounded-xl">
                <svg
                  className="w-8 h-8 sm:w-8 sm:h-8 text-white"
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
              <div className="ml-3 sm:ml-4">
                <p className="text-xs sm:text-sm font-medium text-gray-600">
                  Active Trackers
                </p>
                <p className="text-xl sm:text-3xl font-bold text-primary">
                  {totalTrackers}
                </p>
              </div>
            </div>
          </div>

          <div className="blue-card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-4 bg-success rounded-xl">
                <svg
                  className="w-8 h-8 text-white"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Completed Tasks
                </p>
                <p className="text-3xl font-bold text-success">
                  {completedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="blue-card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-4 bg-gray-100 rounded-xl">
                <svg
                  className="w-8 h-8 text-gray-600"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-3xl font-bold text-black">{totalTasks}</p>
              </div>
            </div>
          </div>

          <div className="blue-card p-4 sm:p-6">
            <div className="flex items-center">
              <div className="p-4 bg-primary rounded-xl">
                <svg
                  className="w-8 h-8 text-white"
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
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Overall Progress
                </p>
                <p className="text-3xl font-bold text-primary">
                  {totalTasks > 0
                    ? Math.round((completedTasks / totalTasks) * 100)
                    : 0}
                  %
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="max-w-md">
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Search trackers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>
        </motion.div>

        {/* Streak Dashboard */}
        {trackers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-8"
          >
            <StreakDashboard
              trackers={trackers}
              onEnableStreak={enableStreakTracking}
              onViewTracker={(id) => (window.location.href = `/tracker/${id}`)}
            />
          </motion.div>
        )}

        {/* Trackers Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          {trackers.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-success/10 rounded-2xl flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-primary"
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
              <h3 className="text-2xl font-bold text-black mb-3">
                No trackers yet
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Create your first tracker to start organizing your progress and
                achieving your goals
              </p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary px-8 py-4 text-lg"
              >
                Create Your First Tracker
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <h2 className="text-lg font-semibold text-black">
                    {searchQuery
                      ? `Search Results (${trackers.length})`
                      : `All Trackers (${trackers.length})`}
                  </h2>
                </div>

                <div className="flex items-center gap-3">
                  {/* View Mode Toggle */}
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("groups")}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        viewMode === "groups"
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      Groups
                    </button>
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1 text-sm rounded-md transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-black shadow-sm"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      Grid
                    </button>
                  </div>

                  {/* Group Manager Button */}
                  <button
                    onClick={() => setShowGroupManager(true)}
                    className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                      />
                    </svg>
                    Manage Groups
                  </button>
                </div>
              </div>

              {viewMode === "groups" ? (
                <GroupedTrackers
                  trackers={state.trackers}
                  groups={state.trackerGroups || {}}
                  onMoveTrackerToGroup={moveTrackerToGroup}
                  onOpenTracker={(id) =>
                    (window.location.href = `/tracker/${id}`)
                  }
                  getProgress={calculateProgress}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {trackers.map((tracker, index) => (
                    <motion.div
                      key={tracker.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                    >
                      <TrackerCard
                        tracker={tracker}
                        variant="default"
                        onOpen={(id) =>
                          (window.location.href = `/tracker/${id}`)
                        }
                        onDelete={deleteTracker}
                        onEnableStreak={enableStreakTracking}
                        onActivateProtection={activateStreakProtection}
                        onCreateRecoveryPlan={createRecoveryPlan}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Create Tracker Modal */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-lg p-6 w-full max-w-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Create New Tracker
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newTrackerTitle}
                    onChange={(e) => setNewTrackerTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter tracker title"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (optional)
                  </label>
                  <textarea
                    value={newTrackerDescription}
                    onChange={(e) => setNewTrackerDescription(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                    placeholder="Enter tracker description"
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleCreateTracker}
                  className="flex-1 btn-primary"
                >
                  Create Tracker
                </button>
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Group Manager Modal */}
        {showGroupManager && (
          <GroupManager
            groups={state.trackerGroups || {}}
            onCreateGroup={createGroup}
            onUpdateGroup={updateGroup}
            onDeleteGroup={deleteGroup}
            onClose={() => setShowGroupManager(false)}
          />
        )}

        {/* Floating Keyboard Shortcuts */}
        <FloatingKeyboardShortcuts />
      </div>
    </div>
  );
}
