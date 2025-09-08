"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C3930] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading my progress trackers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6">
        {/* Search Bar */}
        <div className="mb-4 sm:mb-6">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onClearSearch={handleClearSearch}
            resultCount={trackerStats.totalTrackers}
            hasSearchQuery={!!searchQuery.trim()}
            onCreateTracker={handleOpenCreateForm}
            onAITasksCreated={(trackerId) => {
              console.log("New AI-generated tracker created:", trackerId);
              // You can add navigation logic here
            }}
          />
        </div>

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
              <div className="mb-4 sm:mb-6">
                <ViewControls
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onOpenGroupManager={() => setShowGroupManager(true)}
                  resultCount={trackerStats.totalTrackers}
                  hasSearchQuery={!!searchQuery.trim()}
                />
              </div>

              {/* Trackers Content */}
              {viewMode === "groups" ? (
                <div className="bg-white/30 backdrop-blur-sm rounded-2xl sm:rounded-3xl">
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
      </div>
    </div>
  );
}
