"use client";
import React, { useState } from "react";
import { Tracker, PersonalBest } from "../../types";
import { calculateStreakStats, getStreakMotivation } from "../../utils/streak";

interface StreakDashboardProps {
  trackers: Tracker[];
  onEnableStreak: (trackerId: string) => void;
  onViewTracker: (trackerId: string) => void;
}

export function StreakDashboard({
  trackers,
  onEnableStreak,
  onViewTracker,
}: StreakDashboardProps) {
  const [activeTab, setActiveTab] = useState<
    "overview" | "competition" | "achievements"
  >("overview");

  // Get all trackers with streak data
  const trackersWithStreaks = trackers.filter(
    (tracker) => tracker.settings.streakEnabled && tracker.streakData
  );

  // Calculate overall stats
  const overallStats = React.useMemo(() => {
    if (trackersWithStreaks.length === 0) {
      return {
        totalCurrentStreaks: 0,
        totalLongestStreaks: 0,
        averageConsistency: 0,
        totalPersonalBests: 0,
        activeStreaks: 0,
      };
    }

    const totalCurrentStreaks = trackersWithStreaks.reduce(
      (sum, tracker) => sum + (tracker.streakData?.currentStreak || 0),
      0
    );

    const totalLongestStreaks = trackersWithStreaks.reduce(
      (sum, tracker) => sum + (tracker.streakData?.longestStreak || 0),
      0
    );

    const totalConsistency = trackersWithStreaks.reduce((sum, tracker) => {
      const stats = calculateStreakStats(tracker.streakData!);
      return sum + stats.consistencyScore;
    }, 0);

    const totalPersonalBests = trackersWithStreaks.reduce(
      (sum, tracker) => sum + (tracker.streakData?.personalBests.length || 0),
      0
    );

    const activeStreaks = trackersWithStreaks.filter(
      (tracker) => (tracker.streakData?.currentStreak || 0) > 0
    ).length;

    return {
      totalCurrentStreaks,
      totalLongestStreaks,
      averageConsistency: Math.round(
        totalConsistency / trackersWithStreaks.length
      ),
      totalPersonalBests,
      activeStreaks,
    };
  }, [trackersWithStreaks]);

  // Get all personal bests across trackers
  const allPersonalBests = React.useMemo(() => {
    const bests: (PersonalBest & { trackerTitle: string })[] = [];

    trackersWithStreaks.forEach((tracker) => {
      if (tracker.streakData?.personalBests) {
        tracker.streakData.personalBests.forEach((best) => {
          bests.push({
            ...best,
            trackerTitle: tracker.title,
          });
        });
      }
    });

    return bests.sort((a, b) => b.value - a.value);
  }, [trackersWithStreaks]);

  // Get streak leaders
  const streakLeaders = React.useMemo(() => {
    return trackersWithStreaks
      .map((tracker) => ({
        ...tracker,
        stats: calculateStreakStats(tracker.streakData!),
      }))
      .sort((a, b) => b.stats.currentStreak - a.stats.currentStreak)
      .slice(0, 5);
  }, [trackersWithStreaks]);

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

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "🌱";
    if (streak < 7) return "🔥";
    if (streak < 30) return "⚡";
    if (streak < 100) return "💎";
    return "🏆";
  };

  return (
    <div className="bg-white rounded-lg border-2 border-[#2C3930] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-black">Streak Dashboard</h2>
          <p className="text-gray-600">
            Track your consistency and compete with yourself
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🔥</span>
          <span className="text-lg font-semibold text-black">
            {overallStats.activeStreaks} Active Streaks
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2  mb-6">
        {[
          { id: "overview", label: "Overview", icon: "📊" },
          { id: "competition", label: "Self-Competition", icon: "🏆" },
          { id: "achievements", label: "Achievements", icon: "⭐" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() =>
              setActiveTab(
                tab.id as "overview" | "competition" | "achievements"
              )
            }
            className={`flex items-center space-x-2 px-4 py-2 font-medium ${
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
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Overall Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-black">
                {overallStats.totalCurrentStreaks}
              </div>
              <div className="text-sm text-gray-600">Total Current Streaks</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-black">
                {overallStats.totalLongestStreaks}
              </div>
              <div className="text-sm text-gray-600">Total Best Streaks</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-black">
                {overallStats.averageConsistency}%
              </div>
              <div className="text-sm text-gray-600">Avg Consistency</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-black">
                {overallStats.totalPersonalBests}
              </div>
              <div className="text-sm text-gray-600">Personal Bests</div>
            </div>
          </div>

          {/* Trackers without streaks */}
          {trackers.filter((t) => !t.settings.streakEnabled).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-black mb-4">
                Enable Streak Tracking
              </h3>
              <div className="grid gap-4">
                {trackers
                  .filter((t) => !t.settings.streakEnabled)
                  .map((tracker) => (
                    <div
                      key={tracker.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div>
                        <div className="font-medium text-black">
                          {tracker.title}
                        </div>
                        <div className="text-sm text-gray-600">
                          {tracker.description}
                        </div>
                      </div>
                      <button
                        onClick={() => onEnableStreak(tracker.id)}
                        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Enable Streaks
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === "competition" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">
              Streak Leaders
            </h3>
            <div className="space-y-3">
              {streakLeaders.map((tracker, index) => (
                <div
                  key={tracker.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => onViewTracker(tracker.id)}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {index === 0
                        ? "🥇"
                        : index === 1
                        ? "🥈"
                        : index === 2
                        ? "🥉"
                        : "🏅"}
                    </div>
                    <div>
                      <div className="font-medium text-black">
                        {tracker.title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {tracker.stats.consistencyScore}% consistency
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">
                      {getStreakEmoji(tracker.stats.currentStreak)}
                    </span>
                    <div className="text-right">
                      <div className="text-xl font-bold text-black">
                        {tracker.stats.currentStreak}
                      </div>
                      <div className="text-xs text-gray-600">days</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Motivation Section */}
          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-black mb-2">
              Today&apos;s Challenge
            </h4>
            <p className="text-gray-700">
              {trackersWithStreaks.length > 0
                ? getStreakMotivation(trackersWithStreaks[0].streakData!)
                : "Enable streak tracking to start your consistency journey!"}
            </p>
          </div>
        </div>
      )}

      {activeTab === "achievements" && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-black mb-4">
              Personal Bests
            </h3>
            {allPersonalBests.length > 0 ? (
              <div className="grid gap-4">
                {allPersonalBests.map((achievement) => (
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
                        {achievement.trackerTitle} •{" "}
                        {new Date(achievement.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-2xl font-bold text-black">
                      {achievement.value}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <div className="text-4xl mb-2">🎯</div>
                <div>
                  No achievements yet. Keep going to unlock your first personal
                  best!
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
