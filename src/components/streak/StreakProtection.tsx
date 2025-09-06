"use client";
import React, { useState } from "react";
import { StreakData } from "../../types";
import { calculateStreakInvestment } from "../../utils/streak";

interface StreakProtectionProps {
  streakData: StreakData;
  trackerTitle: string;
  onActivateProtection: (
    protectionType: "grace_period" | "recovery_mode" | "maintenance_mode"
  ) => void;
  onCreateRecoveryPlan: (targetStreak: number, planName: string) => void;
}

export function StreakProtection({
  streakData,
  onActivateProtection,
  onCreateRecoveryPlan,
}: StreakProtectionProps) {
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryTarget, setRecoveryTarget] = useState(30);
  const [recoveryPlanName, setRecoveryPlanName] = useState("Streak Recovery");

  const investment = calculateStreakInvestment(streakData);
  const { streakProtection } = streakData;

  const getProtectionStatus = () => {
    if (!streakProtection.isActive) {
      return {
        status: "inactive",
        message: "Protection mode is not active",
        color: "text-gray-500",
        bgColor: "bg-gray-50",
      };
    }

    switch (streakProtection.protectionType) {
      case "grace_period":
        return {
          status: "grace",
          message: "Grace period active - one more chance!",
          color: "text-yellow-600",
          bgColor: "bg-yellow-50",
        };
      case "recovery_mode":
        return {
          status: "recovery",
          message: "Recovery mode - building back stronger!",
          color: "text-blue-600",
          bgColor: "bg-blue-50",
        };
      case "maintenance_mode":
        return {
          status: "maintenance",
          message: "Maintenance mode - preserving your progress",
          color: "text-green-600",
          bgColor: "bg-green-50",
        };
      default:
        return {
          status: "unknown",
          message: "Protection status unknown",
          color: "text-gray-500",
          bgColor: "bg-gray-50",
        };
    }
  };

  const protectionStatus = getProtectionStatus();

  const handleCreateRecoveryPlan = () => {
    onCreateRecoveryPlan(recoveryTarget, recoveryPlanName);
    setShowRecoveryModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Investment Value */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Investment Value
          </h3>
          <span className="text-2xl">💰</span>
        </div>
        <div className="text-3xl font-bold text-blue-600 mb-2">
          {investment}
        </div>
        <p className="text-sm text-gray-700">
          This represents your psychological investment in this streak.
          Don&apos;t waste your progress!
        </p>
      </div>

      {/* Protection Status */}
      <div className={`p-4 rounded-lg border ${protectionStatus.bgColor}`}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-900">
            Protection Status
          </h3>
          <span className="text-2xl">🛡️</span>
        </div>
        <div className={`text-lg font-medium ${protectionStatus.color} mb-2`}>
          {protectionStatus.message}
        </div>
        {streakProtection.isActive && (
          <div className="text-sm text-gray-600">
            Days remaining: {streakProtection.daysRemaining}
            {streakProtection.lastBreakDate && (
              <span>
                {" "}
                • Last break:{" "}
                {new Date(streakProtection.lastBreakDate).toLocaleDateString()}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Recovery Plan */}
      {streakProtection.recoveryPlan && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Recovery Plan
            </h3>
            <span className="text-2xl">📋</span>
          </div>
          <div className="mb-3">
            <div className="font-medium text-gray-900">
              {streakProtection.recoveryPlan.name}
            </div>
            <div className="text-sm text-gray-600">
              {streakProtection.recoveryPlan.description}
            </div>
          </div>
          <div className="space-y-2">
            {streakProtection.recoveryPlan.milestones.map((milestone) => (
              <div
                key={milestone.id}
                className={`flex items-center space-x-2 text-sm ${
                  milestone.achieved ? "text-green-700" : "text-gray-700"
                }`}
              >
                <span>{milestone.achieved ? "✅" : "⏳"}</span>
                <span>{milestone.targetDays} days</span>
                {milestone.reward && <span>- {milestone.reward}</span>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Protection Actions */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Protection Actions
        </h3>

        {!streakProtection.isActive && (
          <div className="grid gap-3">
            <button
              onClick={() => onActivateProtection("grace_period")}
              className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg hover:bg-yellow-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-yellow-800">
                  Activate Grace Period
                </div>
                <div className="text-sm text-yellow-700">
                  Get one extra day to save your streak
                </div>
              </div>
              <span className="text-2xl">⏰</span>
            </button>

            <button
              onClick={() => onActivateProtection("recovery_mode")}
              className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-blue-800">
                  Enter Recovery Mode
                </div>
                <div className="text-sm text-blue-700">
                  Start a structured recovery plan
                </div>
              </div>
              <span className="text-2xl">🔄</span>
            </button>

            <button
              onClick={() => onActivateProtection("maintenance_mode")}
              className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-left">
                <div className="font-medium text-green-800">
                  Maintenance Mode
                </div>
                <div className="text-sm text-green-700">
                  Preserve progress with reduced goals
                </div>
              </div>
              <span className="text-2xl">🔧</span>
            </button>
          </div>
        )}

        <button
          onClick={() => setShowRecoveryModal(true)}
          className="w-full p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
        >
          <div className="flex items-center justify-center space-x-2">
            <span className="text-2xl">📋</span>
            <span className="font-medium text-purple-800">
              Create Custom Recovery Plan
            </span>
          </div>
        </button>
      </div>

      {/* Recovery Plan Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create Recovery Plan
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan Name
                </label>
                <input
                  type="text"
                  value={recoveryPlanName}
                  onChange={(e) => setRecoveryPlanName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter plan name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Target Streak (days)
                </label>
                <input
                  type="number"
                  value={recoveryTarget}
                  onChange={(e) =>
                    setRecoveryTarget(parseInt(e.target.value) || 30)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  min="7"
                  max="365"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowRecoveryModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRecoveryPlan}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
