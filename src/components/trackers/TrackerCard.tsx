"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tracker, TrackerGroup, ProgressStats } from "../../types";
import { StreakCard } from "../streak";
import { ConfirmationModal } from "../ui";
import { FolderPlus, Trash2 } from "lucide-react";

interface TrackerCardProps {
  tracker: Tracker;
  group?: TrackerGroup;
  progress: ProgressStats;
  onMoveToGroup: (trackerId: string, groupId: string | null) => void;
  onOpenTracker: (trackerId: string) => void;
  availableGroups: TrackerGroup[];
  onEnableStreak?: (trackerId: string) => void;
  onDelete?: (trackerId: string) => void;
}

export default function TrackerCard({
  tracker,
  group,
  progress,
  onMoveToGroup,
  onOpenTracker,
  availableGroups,
  onEnableStreak,
  onDelete,
}: TrackerCardProps) {
  const [showGroupMenu, setShowGroupMenu] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const nextTask = Object.values(tracker.tasks).find(
    (task) => task.status === "todo"
  );

  const handleMoveToGroup = (groupId: string | null) => {
    onMoveToGroup(tracker.id, groupId);
    setShowGroupMenu(false);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    if (!onDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(tracker.id);
      setShowDeleteConfirmation(false);
    } catch (error) {
      console.error("Failed to delete tracker:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteConfirmation(false);
  };

  return (
    <motion.div
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {group && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: group.color }}
                title={group.name}
              />
            )}
            <h3 className="text-lg font-semibold text-gray-900">
              {tracker.title}
            </h3>
          </div>
          {tracker.description && (
            <p className="text-sm text-gray-600 mb-3">{tracker.description}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          {/* Group Menu */}
          <div className="relative">
            <button
              onClick={() => setShowGroupMenu(!showGroupMenu)}
              className="p-1 text-gray-400 hover:text-black transition-colors"
              title="Move to group"
            >
              <FolderPlus className="w-4 h-4" />
            </button>

            {showGroupMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-2 z-10 min-w-[200px]">
                <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b border-gray-100">
                  Move to group
                </div>
                <button
                  onClick={() => handleMoveToGroup(null)}
                  className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    !group ? "bg-gray-100 text-gray-900" : "text-gray-700"
                  }`}
                >
                  No Group
                </button>
                {availableGroups.map((g) => (
                  <button
                    key={g.id}
                    onClick={() => handleMoveToGroup(g.id)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${
                      group?.id === g.id
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-700"
                    }`}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: g.color }}
                    />
                    {g.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              title="Delete tracker"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">{progress.percent}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-black h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress.percent}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
        <span>{progress.completed} completed</span>
        <span>{progress.total} total</span>
      </div>

      {/* Next Task */}
      {nextTask && (
        <div className="mb-4">
          <div className="text-xs font-medium text-gray-500 mb-1">
            • NEXT TASK
          </div>
          <div className="text-sm text-gray-800">{nextTask.title}</div>
        </div>
      )}

      {/* Tags */}
      {tracker.tasks && Object.values(tracker.tasks).length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {Object.values(tracker.tasks)
            .flatMap((task) => task.tags)
            .filter((tag, index, arr) => arr.indexOf(tag) === index)
            .slice(0, 3)
            .map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-[#2C3930] text-white rounded-full"
              >
                {tag}
              </span>
            ))}
        </div>
      )}

      {/* Streak Tracking */}
      {tracker.settings.streakEnabled && tracker.streakData ? (
        <div className="mb-3 sm:mb-4">
          <StreakCard
            streakData={tracker.streakData}
            trackerTitle={tracker.title}
            className="border-0 shadow-none p-0"
          />
        </div>
      ) : (
        onEnableStreak && (
          <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm font-medium text-gray-900">
                  Enable Streak Tracking
                </div>
                <div className="text-xs text-gray-600">
                  Track your consistency and build habits
                </div>
              </div>
              <button
                onClick={() => onEnableStreak(tracker.id)}
                className="px-2 sm:px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors whitespace-nowrap flex-shrink-0"
              >
                Enable
              </button>
            </div>
          </div>
        )
      )}

      {/* Open Button */}
      <button
        onClick={() => onOpenTracker(tracker.id)}
        className="w-full bg-[#2C3930] text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors font-medium"
      >
        Open Tracker &gt;
      </button>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteConfirmation}
        title="Delete Tracker"
        message={`Are you sure you want to delete "${tracker.title}"? This action cannot be undone and will permanently remove all tasks and progress data.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        isLoading={isDeleting}
      />
    </motion.div>
  );
}
