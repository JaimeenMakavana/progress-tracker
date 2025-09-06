"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTrackers } from "../context/TrackersContext";
import { SyncButton } from "../components";
import { StreakDashboard } from "../components/streak";
import { FloatingKeyboardShortcuts } from "../components/ui";
import { DisciplineVisualization } from "../components/progress";
import { ChallengeDashboard } from "../components/challenges";
import { UserProfile } from "../components/profile";
import { calculateProgress } from "../utils/progress";
import {
  useKeyboardShortcuts,
  GLOBAL_SHORTCUTS,
} from "../hooks/useKeyboardShortcuts";
import {
  BarChart3,
  CheckCircle,
  Trophy,
  Target,
  Users,
  Sparkles,
} from "lucide-react";

export default function Dashboard() {
  const { state, isLoading, enableStreakTracking } = useTrackers();
  const [activeTab, setActiveTab] = useState<
    "overview" | "challenges" | "profile"
  >("overview");

  // Set up keyboard shortcuts
  useKeyboardShortcuts(GLOBAL_SHORTCUTS);

  // Listen for custom keyboard shortcut events
  useEffect(() => {
    const handleNewTracker = () => (window.location.href = "/tracker");
    const handleEscape = () => {
      // Handle escape if needed
    };

    document.addEventListener("shortcut:new-tracker", handleNewTracker);
    document.addEventListener("shortcut:escape", handleEscape);

    return () => {
      document.removeEventListener("shortcut:new-tracker", handleNewTracker);
      document.removeEventListener("shortcut:escape", handleEscape);
    };
  }, []);

  // Get all trackers for stats
  const trackers = Object.values(state.trackers);
  const totalTrackers = trackers.length;
  // const totalTasks = trackers.reduce(
  //   (sum, tracker) => sum + Object.keys(tracker.tasks).length,
  //   0
  // );
  const completedTasks = trackers.reduce((sum, tracker) => {
    const progress = calculateProgress(tracker);
    return sum + progress.completed;
  }, 0);

  // v2 Gamification stats
  const userProfile = state.userProfile;
  const challenges = Object.values(state.challenges || {});
  const activeChallenges = challenges.filter(
    (c) => c.isActive && new Date(c.endDate) > new Date()
  );
  // const completedChallenges = challenges.filter(
  //   (c) => c.progress >= c.target || new Date(c.endDate) <= new Date()
  // );
  const totalPoints = userProfile?.totalPoints || 0;

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress trackers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="max-w-7xl mx-auto">
        {/* Header with Tabs */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-[#2C3930] mb-2">
                Progress Dashboard
              </h1>
              <p className="text-gray-600">
                Track your productivity journey with gamified features
              </p>
            </div>
            <div className="flex gap-2">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "challenges", label: "Challenges", icon: Trophy },
                { id: "profile", label: "Profile", icon: Users },
              ].map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() =>
                    setActiveTab(
                      tab.id as "overview" | "challenges" | "profile"
                    )
                  }
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 transition-all ${
                    activeTab === tab.id
                      ? "border-[#2C3930] bg-[#2C3930] text-white"
                      : "border-gray-200 hover:border-[#2C3930]"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl border-2 border-[#2C3930] p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Active Trackers
                </p>
                <p className="text-xl font-bold text-[#2C3930]">
                  {totalTrackers}
                </p>
              </div>
              <div className="p-2 bg-[#2C3930]/10 rounded-lg">
                <BarChart3 className="w-5 h-5 text-[#2C3930]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#2C3930] p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Completed Tasks
                </p>
                <p className="text-xl font-bold text-green-600">
                  {completedTasks}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#2C3930] p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Total Points
                </p>
                <p className="text-xl font-bold text-[#2C3930]">
                  {totalPoints}
                </p>
              </div>
              <div className="p-2 bg-[#2C3930]/10 rounded-lg">
                <Sparkles className="w-5 h-5 text-[#2C3930]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#2C3930] p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">
                  Active Challenges
                </p>
                <p className="text-xl font-bold text-[#2C3930]">
                  {activeChallenges.length}
                </p>
              </div>
              <div className="p-2 bg-[#2C3930]/10 rounded-lg">
                <Target className="w-5 h-5 text-[#2C3930]" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-6"
        >
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Streak Dashboard */}
              {trackers.length > 0 && (
                <div className="rounded-xl shadow-sm">
                  <StreakDashboard
                    trackers={trackers}
                    onEnableStreak={enableStreakTracking}
                    onViewTracker={(id) =>
                      (window.location.href = `/tracker/${id}`)
                    }
                  />
                </div>
              )}

              {/* Discipline Visualization */}
              {trackers.length > 0 && trackers.some((t) => t.streakData) && (
                <DisciplineVisualization
                  streakData={
                    trackers.find((t) => t.streakData)?.streakData || {
                      currentStreak: 0,
                      longestStreak: 0,
                      totalDaysActive: 0,
                      streakHistory: [],
                      personalBests: [],
                      streakProtection: {
                        isActive: false,
                        protectionType: "grace_period" as const,
                        daysRemaining: 0,
                      },
                    }
                  }
                />
              )}
            </div>
          )}

          {activeTab === "challenges" && <ChallengeDashboard />}

          {activeTab === "profile" && <UserProfile />}
        </motion.div>

        {/* Floating GitHub Sync Button */}
        <div className="fixed bottom-20 right-6 z-[100]">
          <div className="bg-white/90 backdrop-blur-sm border-2 border-[#2C3930] rounded-full flex items-center justify-center p-2 min-w-[48px] min-h-[48px]">
            <SyncButton className="w-8 h-8" />
          </div>
        </div>

        {/* Floating Keyboard Shortcuts */}
        <FloatingKeyboardShortcuts />
      </div>
    </div>
  );
}
