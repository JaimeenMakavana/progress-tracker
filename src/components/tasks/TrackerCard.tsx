"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tracker } from "../../types";
import { calculateProgress, getNextTask } from "../../utils/progress";
import { ProgressBar } from "../progress";
import { StreakCard, StreakDetails } from "../streak";

interface TrackerCardProps {
  tracker: Tracker;
  onOpen: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onEnableStreak?: (id: string) => void;
  onActivateProtection?: (
    trackerId: string,
    protectionType: "grace_period" | "recovery_mode" | "maintenance_mode"
  ) => void;
  onCreateRecoveryPlan?: (
    trackerId: string,
    targetStreak: number,
    planName: string
  ) => void;
  variant?: "default" | "compact" | "featured";
}

export default function TrackerCard({
  tracker,
  onOpen,
  onEdit,
  onDelete,
  onEnableStreak,
  onActivateProtection,
  onCreateRecoveryPlan,
  variant = "default",
}: TrackerCardProps) {
  const [showStreakDetails, setShowStreakDetails] = useState(false);
  const progress = calculateProgress(tracker);
  const nextTask = getNextTask(tracker);
  const recentActivity = tracker.activityLog.slice(0, 2);

  const getCardStyles = () => {
    switch (variant) {
      case "compact":
        return "p-4 minimal-card";
      case "featured":
        return "p-6 bg-black text-white border-0";
      default:
        return "p-6 minimal-card";
    }
  };

  const getProgressSize = () => {
    switch (variant) {
      case "compact":
        return "sm" as const;
      case "featured":
        return "lg" as const;
      default:
        return "md" as const;
    }
  };

  return (
    <motion.div
      className={`card ${getCardStyles()} group cursor-pointer`}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={() => onOpen(tracker.id)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${
                variant === "featured" ? "bg-white" : "bg-black"
              }`}
            ></div>
            <h3
              className={`text-lg font-bold truncate ${
                variant === "featured" ? "text-white" : "text-black"
              }`}
            >
              {tracker.title}
            </h3>
          </div>
          {tracker.description && variant !== "compact" && (
            <p
              className={`text-sm line-clamp-2 mb-3 ${
                variant === "featured" ? "text-white/90" : "text-gray-600"
              }`}
            >
              {tracker.description}
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(tracker.id);
              }}
              className="p-2 text-gray-400 hover:text-primary transition-colors rounded-lg hover:bg-primary/10"
              title="Edit tracker"
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
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(tracker.id);
              }}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
              title="Delete tracker"
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
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Progress Section */}
      <div className="mb-4">
        <ProgressBar
          percent={progress.percent}
          size={getProgressSize()}
          showLabel={variant !== "compact"}
          animated={true}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-black"></div>
            {progress.completed} completed
          </span>
          <span className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-gray-300"></div>
            {progress.total} total
          </span>
        </div>
      </div>

      {/* Next Task */}
      {nextTask && variant !== "compact" && (
        <div
          className={`mb-4 p-3 rounded-lg border ${
            variant === "featured"
              ? "bg-white/10 border-white/20"
              : "bg-gradient-to-r from-primary/5 to-success/5 border-primary/10"
          }`}
        >
          <div className="flex items-center gap-2 mb-1">
            <div
              className={`w-2 h-2 rounded-full animate-pulse ${
                variant === "featured" ? "bg-white" : "bg-black"
              }`}
            ></div>
            <p
              className={`text-xs font-semibold uppercase tracking-wide ${
                variant === "featured" ? "text-white" : "text-black"
              }`}
            >
              Next Task
            </p>
          </div>
          <p
            className={`text-sm font-medium line-clamp-1 ${
              variant === "featured" ? "text-white" : "text-black"
            }`}
          >
            {nextTask.title}
          </p>
          {nextTask.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {nextTask.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className={`px-2 py-1 text-xs rounded-full ${
                    variant === "featured"
                      ? "bg-white/20 text-white"
                      : "bg-black/10 text-black"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      {recentActivity.length > 0 && variant === "featured" && (
        <div className="mb-4">
          <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
            Recent Activity
          </p>
          <div className="space-y-2">
            {recentActivity.map((activity) => (
              <div
                key={`${activity.type}-${activity.at}-${
                  activity.taskId || "no-task"
                }`}
                className="flex items-center gap-2 text-xs"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === "complete" ? "bg-white" : "bg-gray-400"
                  }`}
                />
                <span className="text-gray-600">
                  {activity.type === "complete" ? "Completed" : "Opened"} task
                </span>
                <span className="text-gray-400 ml-auto">
                  {new Date(activity.at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Streak Tracking */}
      {tracker.settings.streakEnabled &&
      tracker.streakData &&
      variant !== "compact" ? (
        <div className="mb-4">
          <StreakCard
            streakData={tracker.streakData}
            trackerTitle={tracker.title}
            onViewDetails={() => setShowStreakDetails(true)}
            className="border-0 shadow-none p-0"
          />
        </div>
      ) : (
        onEnableStreak &&
        variant !== "compact" && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  Enable Streak Tracking
                </div>
                <div className="text-xs text-gray-600">
                  Track your consistency and build habits
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEnableStreak(tracker.id);
                }}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Enable
              </button>
            </div>
          </div>
        )
      )}

      {/* Action Button */}
      {variant !== "compact" && (
        <motion.button
          className={`w-full flex items-center justify-center gap-2 ${
            variant === "featured"
              ? "bg-white text-black hover:bg-gray-100 font-semibold py-3 rounded-lg transition-all"
              : "btn-primary"
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={(e) => {
            e.stopPropagation();
            onOpen(tracker.id);
          }}
        >
          <span>Open Tracker</span>
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
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.button>
      )}

      {/* Streak Details Modal */}
      {showStreakDetails && tracker.streakData && (
        <StreakDetails
          streakData={tracker.streakData}
          trackerTitle={tracker.title}
          onClose={() => setShowStreakDetails(false)}
          onActivateProtection={
            onActivateProtection
              ? (type) => onActivateProtection(tracker.id, type)
              : undefined
          }
          onCreateRecoveryPlan={
            onCreateRecoveryPlan
              ? (target, name) => onCreateRecoveryPlan(tracker.id, target, name)
              : undefined
          }
        />
      )}
    </motion.div>
  );
}
