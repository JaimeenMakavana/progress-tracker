"use client";
import React, { useState } from "react";
import { StreakData, StreakStats, PersonalBest } from "../../types";
import { calculateStreakStats } from "../../utils/streak";
import { StreakProtection } from "./StreakProtection";

interface StreakDetailsProps {
  streakData: StreakData;
  trackerTitle: string;
  onClose: () => void;
  onActivateProtection?: (
    protectionType: "grace_period" | "recovery_mode" | "maintenance_mode"
  ) => void;
  onCreateRecoveryPlan?: (targetStreak: number, planName: string) => void;
}

export function StreakDetails({
  streakData,
  trackerTitle,
  onClose,
  onActivateProtection,
  onCreateRecoveryPlan,
}: StreakDetailsProps) {
  const [activeTab, setActiveTab] = useState<
    "history" | "achievements" | "protection"
  >("history");
  const stats = calculateStreakStats(streakData);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getAchievementIcon = (type: PersonalBest["type"]) => {
    switch (type) {
      case "longest_streak":
        return "🏆";
      case "most_tasks_day":
        return "⚡";
      case "most_effort_day":
        return "💪";
      case "fastest_completion":
        return "🚀";
      default:
        return "⭐";
    }
  };

  const getTrendIcon = (trend: StreakStats["streakTrend"]) => {
    switch (trend) {
      case "increasing":
        return "📈";
      case "decreasing":
        return "📉";
      case "stable":
        return "➡️";
      default:
        return "➡️";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b-2 border-[#2C3930]">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Streak Details</h2>
            <p className="text-gray-600">{trackerTitle}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b-2 border-[#2C3930]">
          {[
            { id: "history", label: "History", icon: "📊" },
            { id: "achievements", label: "Achievements", icon: "🏆" },
            { id: "protection", label: "Protection", icon: "🛡️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as "history" | "achievements" | "protection"
                )
              }
              className={`flex items-center space-x-2 px-6 py-3 font-medium ${
                activeTab === tab.id
                  ? "text-black border-b-2 border-black"
                  : "text-gray-600 hover:text-black"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === "history" && (
            <div className="space-y-6">
              {/* Overview Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-black">
                    {stats.currentStreak}
                  </div>
                  <div className="text-sm text-gray-600">Current Streak</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-black">
                    {stats.longestStreak}
                  </div>
                  <div className="text-sm text-gray-600">Longest Streak</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-black">
                    {stats.consistencyScore}%
                  </div>
                  <div className="text-sm text-gray-600">Consistency</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-2xl font-bold text-black">
                    {getTrendIcon(stats.streakTrend)}
                  </div>
                  <div className="text-sm text-gray-600">Trend</div>
                </div>
              </div>

              {/* Recent History */}
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-2">
                  {streakData.streakHistory
                    .slice(-14)
                    .reverse()
                    .map((entry) => (
                      <div
                        key={entry.date}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          entry.completed ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span
                            className={`text-lg ${
                              entry.completed
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {entry.completed ? "✅" : "❌"}
                          </span>
                          <div>
                            <div className="font-medium text-black">
                              {formatDate(entry.date)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {entry.tasksCompleted} tasks,{" "}
                              {entry.effortCompleted} effort
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600">
                          Streak: {entry.streakAtTime}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-black mb-4">
                  Personal Bests
                </h3>
                <div className="grid gap-4">
                  {streakData.personalBests.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <span className="text-2xl">
                        {getAchievementIcon(achievement.type)}
                      </span>
                      <div className="flex-1">
                        <div className="font-medium text-black">
                          {achievement.description}
                        </div>
                        <div className="text-sm text-gray-600">
                          Achieved on {formatDate(achievement.date)}
                        </div>
                      </div>
                      <div className="text-2xl font-bold text-black">
                        {achievement.value}
                      </div>
                    </div>
                  ))}
                  {streakData.personalBests.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="text-4xl mb-2">🎯</div>
                      <div>
                        No achievements yet. Keep going to unlock your first
                        personal best!
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "protection" && (
            <div className="space-y-6">
              {onActivateProtection && onCreateRecoveryPlan ? (
                <StreakProtection
                  streakData={streakData}
                  trackerTitle={trackerTitle}
                  onActivateProtection={onActivateProtection}
                  onCreateRecoveryPlan={onCreateRecoveryPlan}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-4xl mb-2">🛡️</div>
                  <div>Protection features not available</div>
                  <div className="text-sm mt-2">
                    Protection features require tracker context
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
