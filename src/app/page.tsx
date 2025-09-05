"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTrackers } from "../context/TrackersContext";
import TrackerCard from "../components/TrackerCard";
import SyncButton from "../components/SyncButton";
import { calculateProgress } from "../utils/progress";
import {
  useKeyboardShortcuts,
  GLOBAL_SHORTCUTS,
} from "../hooks/useKeyboardShortcuts";

export default function Dashboard() {
  const { state, isLoading, createTracker, deleteTracker, exportData } =
    useTrackers();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newTrackerTitle, setNewTrackerTitle] = useState("");
  const [newTrackerDescription, setNewTrackerDescription] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  // Set up keyboard shortcuts
  useKeyboardShortcuts(GLOBAL_SHORTCUTS);

  // Listen for custom keyboard shortcut events
  useEffect(() => {
    const handleNewTracker = () => setShowCreateForm(true);
    const handleHelp = () => setShowKeyboardHelp(true);
    const handleEscape = () => {
      setShowCreateForm(false);
      setShowKeyboardHelp(false);
    };

    document.addEventListener("shortcut:new-tracker", handleNewTracker);
    document.addEventListener("shortcut:help", handleHelp);
    document.addEventListener("shortcut:escape", handleEscape);

    return () => {
      document.removeEventListener("shortcut:new-tracker", handleNewTracker);
      document.removeEventListener("shortcut:help", handleHelp);
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

  const handleExport = () => {
    const data = exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `progress-tracker-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
      {/* Hero Section with Dominant Blue */}
      <div className="hero-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="max-w-4xl mx-auto">
              <h1 className="text-6xl font-bold text-white mb-6">
                PROGRESS
                <span className="block text-white">OS v2</span>
              </h1>
              <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Minimal, keyboard-first progress tracking for deep work and
                knowledge capture. Transform your goals into achievements with
                focused, distraction-free interface.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setShowCreateForm(true)}
                  className="btn-success flex items-center gap-2 px-8 py-4 text-lg font-semibold"
                >
                  <svg
                    className="w-6 h-6"
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
                  GET STARTED
                </button>
                <button
                  onClick={() => setShowKeyboardHelp(true)}
                  className="px-8 py-4 text-lg font-semibold text-white border-2 border-white rounded-lg hover:bg-white hover:text-black transition-all duration-300 flex items-center gap-2"
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  KEYBOARD SHORTCUTS
                </button>
                <button
                  onClick={handleExport}
                  className="px-8 py-4 text-lg font-semibold text-black bg-white border-2 border-white rounded-lg hover:bg-gray-50 hover:text-black transition-all duration-300"
                >
                  EXPORT DATA
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-black mb-2">
                Your Progress Dashboard
              </h2>
              <p className="text-gray-600">
                Manage and track all your projects in one place
              </p>
            </div>
            <div className="flex items-center gap-3">
              <SyncButton />
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn-primary flex items-center gap-2 px-6 py-3"
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
                New Tracker
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards with Blue Theme */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="blue-card p-6">
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
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">
                  Active Trackers
                </p>
                <p className="text-3xl font-bold text-primary">
                  {totalTrackers}
                </p>
              </div>
            </div>
          </div>

          <div className="blue-card p-6">
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

          <div className="blue-card p-6">
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

          <div className="blue-card p-6">
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
              </div>

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
                      onOpen={(id) => (window.location.href = `/tracker/${id}`)}
                      onDelete={deleteTracker}
                    />
                  </motion.div>
                ))}
              </div>
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

        {/* Keyboard Shortcuts Help Modal */}
        {showKeyboardHelp && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div
              className="bg-white rounded-lg p-8 w-full max-w-2xl"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-black mb-2">
                    Keyboard Shortcuts
                  </h3>
                  <p className="text-sm text-gray-600">
                    Navigate efficiently without touching the mouse
                  </p>
                </div>
                <button
                  onClick={() => setShowKeyboardHelp(false)}
                  className="text-gray-400 hover:text-black transition-colors p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              {/* Shortcuts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {GLOBAL_SHORTCUTS.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-black"></div>
                      <span className="text-sm font-medium text-black">
                        {shortcut.description}
                      </span>
                    </div>
                    <kbd className="px-3 py-1.5 bg-black text-white rounded-md text-sm font-mono font-semibold shadow-sm">
                      {shortcut.key === " " ? "Space" : shortcut.key}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              {/* Footer */}
              <div className="border-t border-gray-200 pt-6">
                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <span>Press</span>
                  <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono font-semibold">
                    ?
                  </kbd>
                  <span>anytime to show this help</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
