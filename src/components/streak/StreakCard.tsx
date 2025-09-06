import React from "react";
import { StreakData } from "../../types";
import {
  calculateStreakStats,
  getStreakMotivation,
  calculateStreakInvestment,
} from "../../utils/streak";

interface StreakCardProps {
  streakData: StreakData;
  trackerTitle: string;
  onViewDetails?: () => void;
  className?: string;
}

export function StreakCard({
  streakData,
  onViewDetails,
  className = "",
}: StreakCardProps) {
  const stats = calculateStreakStats(streakData);
  const motivation = getStreakMotivation(streakData);
  const investment = calculateStreakInvestment(streakData);

  const getStreakEmoji = (streak: number) => {
    if (streak === 0) return "🌱";
    if (streak < 7) return "🔥";
    if (streak < 30) return "⚡";
    if (streak < 100) return "💎";
    return "🏆";
  };

  const getStreakColor = (streak: number) => {
    if (streak === 0) return "text-gray-500";
    if (streak < 7) return "text-gray-700";
    if (streak < 30) return "text-black";
    if (streak < 100) return "text-black";
    return "text-black";
  };

  return (
    <div
      className={`bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">
            {getStreakEmoji(streakData.currentStreak)}
          </span>
          <h3 className="text-lg font-semibold text-black">Streak</h3>
        </div>
        {onViewDetails && (
          <button
            onClick={onViewDetails}
            className="text-sm text-black hover:text-gray-700 font-medium"
          >
            View Details
          </button>
        )}
      </div>

      {/* Current Streak */}
      <div className="text-center mb-4">
        <div
          className={`text-4xl font-bold ${getStreakColor(
            streakData.currentStreak
          )}`}
        >
          {streakData.currentStreak}
        </div>
        <div className="text-sm text-gray-600">days in a row</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-black">
            {stats.longestStreak}
          </div>
          <div className="text-xs text-gray-600">Best Streak</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-black">
            {stats.consistencyScore}%
          </div>
          <div className="text-xs text-gray-600">Consistency</div>
        </div>
      </div>

      {/* Investment Value */}
      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-black">
            Investment Value
          </span>
          <span className="text-lg font-bold text-black">{investment}</span>
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Don&apos;t waste your progress!
        </div>
      </div>

      {/* Motivation */}
      <div className="text-sm text-gray-700 italic mb-4">
        &ldquo;{motivation}&rdquo;
      </div>

      {/* Next Milestone */}
      {stats.nextMilestone && (
        <div className="text-center">
          <div className="text-sm text-gray-600">
            {stats.daysToNextMilestone} days to {stats.nextMilestone}-day
            milestone
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-black h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  (streakData.currentStreak / stats.nextMilestone) * 100
                }%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Protection Mode */}
      {streakData.streakProtection.isActive && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">🛡️</span>
            <div>
              <div className="text-sm font-medium text-black">
                Protection Mode
              </div>
              <div className="text-xs text-gray-600">
                {streakData.streakProtection.daysRemaining} days remaining
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
