"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FloatingKeyboardShortcuts } from "../../components/ui";
import GroupedTrackers from "../../components/trackers/GroupedTrackers";
import GroupManager from "../../components/groups/GroupManager";
import { calculateProgress } from "../../utils/progress";
import {
  useKeyboardShortcuts,
  GLOBAL_SHORTCUTS,
} from "../../hooks/useKeyboardShortcuts";
import { useTrackerOperations } from "../../hooks/useTrackerOperations";
import { useTrackerForm } from "../../hooks/useTrackerForm";
import {
  SearchBar,
  ViewControls,
  CreateTrackerModal,
  EmptyState,
  TrackerGrid,
} from "../../components/tracker";

export default function TrackerPage() {
  // Custom hooks for state management
  const {
    state,
    isLoading,
    searchQuery,
    viewMode,
    filteredAndSortedTrackers,
    trackerStats,
    createTracker,
    deleteTracker,
    createGroup,
    updateGroup,
    deleteGroup,
    moveTrackerToGroup,
    enableStreakTracking,
    activateStreakProtection,
    createRecoveryPlan,
    setSearchQuery,
    setViewMode,
    handleOpenTracker,
    handleClearSearch,
  } = useTrackerOperations();

  const {
    showCreateForm,
    formData,
    handleFormChange,
    handleCreateTracker: handleFormCreateTracker,
    handleCloseCreateForm,
    handleOpenCreateForm,
  } = useTrackerForm();

  const [showGroupManager, setShowGroupManager] = useState(false);

  // Set up keyboard shortcuts
  useKeyboardShortcuts(GLOBAL_SHORTCUTS);

  // Memoized event handlers
  const handleNewTracker = useCallback(() => {
    handleOpenCreateForm();
  }, [handleOpenCreateForm]);

  const handleEscape = useCallback(() => {
    handleCloseCreateForm();
  }, [handleCloseCreateForm]);

  // Listen for custom keyboard shortcut events
  useEffect(() => {
    document.addEventListener("shortcut:new-tracker", handleNewTracker);
    document.addEventListener("shortcut:escape", handleEscape);

    return () => {
      document.removeEventListener("shortcut:new-tracker", handleNewTracker);
      document.removeEventListener("shortcut:escape", handleEscape);
    };
  }, [handleNewTracker, handleEscape]);

  // Wrapper for create tracker with form data
  const handleCreateTracker = useCallback(() => {
    handleFormCreateTracker(createTracker);
  }, [handleFormCreateTracker, createTracker]);

  const handleCloseGroupManager = useCallback(() => {
    setShowGroupManager(false);
  }, []);

  // Wrapper for activateStreakProtection to match TrackerCard interface
  const handleActivateProtection = useCallback(
    (id: string) => {
      activateStreakProtection(id, "grace_period");
    },
    [activateStreakProtection]
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading my progress trackers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full ">
      <div className="max-w-7xl mx-auto p-4">
        {/* Search Bar */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onClearSearch={handleClearSearch}
          resultCount={trackerStats.totalTrackers}
          hasSearchQuery={!!searchQuery.trim()}
          onCreateTracker={handleOpenCreateForm}
        />

        {/* Trackers Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {trackerStats.totalTrackers === 0 ? (
            <EmptyState onCreateTracker={handleOpenCreateForm} />
          ) : (
            <>
              {/* View Controls */}
              <ViewControls
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onOpenGroupManager={() => setShowGroupManager(true)}
                resultCount={trackerStats.totalTrackers}
                hasSearchQuery={!!searchQuery.trim()}
              />

              {/* Trackers Content */}
              {viewMode === "groups" ? (
                <div className="bg-white/30 backdrop-blur-sm border border-gray-200/50 rounded-3xl p-6">
                  <GroupedTrackers
                    trackers={state.trackers}
                    groups={state.trackerGroups || {}}
                    onMoveTrackerToGroup={moveTrackerToGroup}
                    onOpenTracker={handleOpenTracker}
                    onDeleteTracker={deleteTracker}
                    getProgress={calculateProgress}
                  />
                </div>
              ) : (
                <TrackerGrid
                  trackers={filteredAndSortedTrackers}
                  onOpenTracker={handleOpenTracker}
                  onDeleteTracker={deleteTracker}
                  onEnableStreak={enableStreakTracking}
                  onActivateProtection={handleActivateProtection}
                  onCreateRecoveryPlan={createRecoveryPlan}
                />
              )}
            </>
          )}
        </motion.div>

        {/* Create Tracker Modal */}
        <CreateTrackerModal
          isOpen={showCreateForm}
          formData={formData}
          onFormChange={handleFormChange}
          onCreateTracker={handleCreateTracker}
          onClose={handleCloseCreateForm}
        />

        {/* Group Manager Modal */}
        {showGroupManager && (
          <GroupManager
            groups={state.trackerGroups || {}}
            onCreateGroup={createGroup}
            onUpdateGroup={updateGroup}
            onDeleteGroup={deleteGroup}
            onClose={handleCloseGroupManager}
          />
        )}

        {/* Floating Keyboard Shortcuts */}
        <FloatingKeyboardShortcuts />
      </div>
    </div>
  );
}
