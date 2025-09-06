"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tracker, TrackerGroup, ProgressStats } from "../../types";
import TrackerCardGrid from "./TrackerCard";

interface GroupedTrackersProps {
  trackers: Record<string, Tracker>;
  groups: Record<string, TrackerGroup>;
  onMoveTrackerToGroup: (trackerId: string, groupId: string | null) => void;
  onOpenTracker: (trackerId: string) => void;
  onDeleteTracker?: (trackerId: string) => void;
  getProgress: (tracker: Tracker) => ProgressStats;
}

export default function GroupedTrackers({
  trackers,
  groups,
  onMoveTrackerToGroup,
  onOpenTracker,
  onDeleteTracker,
  getProgress,
}: GroupedTrackersProps) {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Organize trackers by group
  const groupedTrackers = React.useMemo(() => {
    const grouped: Record<string, Tracker[]> = {};
    const ungrouped: Tracker[] = [];

    Object.values(trackers).forEach((tracker) => {
      if (tracker.groupId && groups[tracker.groupId]) {
        if (!grouped[tracker.groupId]) {
          grouped[tracker.groupId] = [];
        }
        grouped[tracker.groupId].push(tracker);
      } else {
        ungrouped.push(tracker);
      }
    });

    return { grouped, ungrouped };
  }, [trackers, groups]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  };

  const sortedGroups = Object.values(groups).sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {/* Grouped Trackers */}
      {sortedGroups.map((group) => {
        const groupTrackers = groupedTrackers.grouped[group.id] || [];
        const isExpanded = expandedGroups.has(group.id);
        const groupProgress = groupTrackers.reduce(
          (acc, tracker) => {
            const progress = getProgress(tracker);
            return {
              total: acc.total + progress.total,
              completed: acc.completed + progress.completed,
              percent: 0, // Will calculate below
            };
          },
          { total: 0, completed: 0, percent: 0 }
        );
        groupProgress.percent =
          groupProgress.total > 0
            ? Math.round((groupProgress.completed / groupProgress.total) * 100)
            : 0;

        return (
          <motion.div
            key={group.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gray-50 rounded-lg p-4"
          >
            {/* Group Header */}
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleGroup(group.id)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: group.color }}
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {group.name}
                  </h3>
                  {group.description && (
                    <p className="text-sm text-gray-600">{group.description}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">
                    {groupTrackers.length} tracker
                    {groupTrackers.length !== 1 ? "s" : ""}
                  </div>
                  <div className="text-xs text-gray-600">
                    {groupProgress.completed}/{groupProgress.total} tasks
                    completed
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${groupProgress.percent}%`,
                        backgroundColor: group.color,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {groupProgress.percent}%
                  </span>
                </div>

                <button className="p-1 text-gray-400 hover:text-black transition-colors">
                  <svg
                    className={`w-5 h-5 transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Group Trackers */}
            <AnimatePresence>
              {isExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupTrackers.map((tracker) => (
                      <TrackerCardGrid
                        key={tracker.id}
                        tracker={tracker}
                        group={group}
                        progress={getProgress(tracker)}
                        onMoveToGroup={onMoveTrackerToGroup}
                        onOpenTracker={onOpenTracker}
                        onDelete={onDeleteTracker}
                        availableGroups={sortedGroups}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}

      {/* Ungrouped Trackers */}
      {groupedTrackers.ungrouped.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-50 rounded-lg p-4"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-4 h-4 rounded-full bg-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">
              Other Trackers
            </h3>
            <span className="text-sm text-gray-600">
              ({groupedTrackers.ungrouped.length} tracker
              {groupedTrackers.ungrouped.length !== 1 ? "s" : ""})
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groupedTrackers.ungrouped.map((tracker) => (
              <TrackerCardGrid
                key={tracker.id}
                tracker={tracker}
                progress={getProgress(tracker)}
                onMoveToGroup={onMoveTrackerToGroup}
                onOpenTracker={onOpenTracker}
                onDelete={onDeleteTracker}
                availableGroups={sortedGroups}
              />
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
