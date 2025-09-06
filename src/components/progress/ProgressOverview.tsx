"use client";

import React from "react";
import { motion } from "framer-motion";
import { Tracker } from "../../types";
import {
  calculateProgress,
  getNextTask,
  getRecentActivity,
} from "../../utils/progress";
import ProgressBar from "./ProgressBar";
import {
  Target,
  CheckCircle,
  Clock,
  TrendingUp,
  Zap,
  Star,
  ArrowRight,
  Calendar,
  Activity,
} from "lucide-react";

interface ProgressOverviewProps {
  tracker: Tracker;
}

export default function ProgressOverview({ tracker }: ProgressOverviewProps) {
  const progress = calculateProgress(tracker);
  const nextTask = getNextTask(tracker);
  const recentActivity = getRecentActivity(tracker, 5);

  // Calculate streak and motivation metrics
  const streakDays = 7; // This would come from streak data
  const motivationLevel =
    progress.percent > 50 ? "high" : progress.percent > 25 ? "medium" : "low";

  const getMotivationColor = () => {
    switch (motivationLevel) {
      case "high":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-red-600";
    }
  };

  const getMotivationIcon = () => {
    switch (motivationLevel) {
      case "high":
        return <Zap className="w-5 h-5" />;
      case "medium":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Target className="w-5 h-5" />;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {/* Main Progress - Enhanced */}
      <motion.div
        className="lg:col-span-2 bg-gradient-to-br from-white via-gray-50 to-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border-2 border-[#2C3930] shadow-lg hover:shadow-xl transition-all duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header with Icon */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#2C3930] rounded-xl">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-black">
              Progress Overview
            </h2>
          </div>
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-full bg-white border-2 border-[#2C3930] ${getMotivationColor()}`}
          >
            {getMotivationIcon()}
            <span className="text-sm font-medium capitalize">
              {motivationLevel} Energy
            </span>
          </div>
        </div>

        {/* Enhanced Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">
              Overall Progress
            </span>
            <span className="text-lg font-bold text-[#2C3930]">
              {progress.percent}%
            </span>
          </div>
          <ProgressBar percent={progress.percent} size="lg" showLabel />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div
            className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2C3930] transition-colors"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-black">
              {progress.completed}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              Completed
            </div>
          </motion.div>

          <motion.div
            className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2C3930] transition-colors"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-black">
              {progress.total}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              Total Tasks
            </div>
          </motion.div>

          <motion.div
            className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2C3930] transition-colors"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-black">
              {streakDays}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              Day Streak
            </div>
          </motion.div>

          <motion.div
            className="text-center p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2C3930] transition-colors"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-center mb-2">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-black">
              {Math.round(progress.percent / 10)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 font-medium">
              Level
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Next Task & Activity - Enhanced */}
      <div className="space-y-4 sm:space-y-6">
        {/* Next Task */}
        {nextTask && (
          <motion.div
            className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-[#2C3930] shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#2C3930] rounded-xl">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-black">
                Next Task
              </h3>
            </div>

            <motion.div
              className="p-4 bg-white rounded-xl border border-gray-200 hover:border-[#2C3930] transition-all duration-200"
              whileHover={{ scale: 1.02 }}
            >
              <h4 className="font-semibold text-black mb-2 text-sm sm:text-base leading-tight">
                {nextTask.title}
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  Effort: {nextTask.effort}
                </span>
              </div>
              {nextTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {nextTask.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-[#2C3930] text-white rounded-full font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl sm:rounded-3xl p-4 sm:p-6 border-2 border-[#2C3930] shadow-lg hover:shadow-xl transition-all duration-300"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#2C3930] rounded-xl">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-black">
              Recent Activity
            </h3>
          </div>

          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-gray-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  No recent activity
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Start completing tasks to see activity here!
                </p>
              </div>
            ) : (
              recentActivity.map((activity, index) => (
                <motion.div
                  key={`${activity.type}-${activity.at}-${
                    activity.taskId || "no-task"
                  }`}
                  className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-100 hover:border-[#2C3930] transition-colors"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      activity.type === "complete"
                        ? "bg-green-500"
                        : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">
                      {activity.type === "complete" ? "Completed" : "Opened"}{" "}
                      task
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.at).toLocaleDateString()}
                    </p>
                  </div>
                  {activity.type === "complete" && (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  )}
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
