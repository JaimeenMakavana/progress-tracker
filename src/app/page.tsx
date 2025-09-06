"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTrackers } from "../context/TrackersContext";
import { StreakDashboard } from "../components/streak";
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
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2C3930] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your progress trackers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6">
        {/* Header with Tabs */}
        <motion.div
          className="mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-4">
            <div className="text-center lg:text-left">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2C3930] mb-2">
                Progress Dashboard
              </h1>
              <p className="text-sm sm:text-base text-gray-600">
                Track your productivity journey with gamified features
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto overflow-x-auto">
              {[
                {
                  id: "overview",
                  label: "Overview",
                  icon: BarChart3,
                  shortLabel: "Overview",
                },
                {
                  id: "challenges",
                  label: "Challenges",
                  icon: Trophy,
                  shortLabel: "Challenges",
                },
                {
                  id: "profile",
                  label: "Profile",
                  icon: Users,
                  shortLabel: "Profile",
                },
              ].map((tab) => (
                <div
                  key={tab.id}
                  className="relative group flex-1 sm:flex-none"
                  title={tab.label}
                >
                  <motion.button
                    onClick={() =>
                      setActiveTab(
                        tab.id as "overview" | "challenges" | "profile"
                      )
                    }
                    className={`w-full flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-3 lg:px-4 py-2 sm:py-3 rounded-lg border-2 transition-all text-xs sm:text-sm lg:text-base whitespace-nowrap min-w-0 ${
                      activeTab === tab.id
                        ? "border-[#2C3930] bg-[#2C3930] text-white"
                        : "border-gray-200 hover:border-[#2C3930]"
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </motion.button>

                  {/* Mobile Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-black text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none sm:hidden z-10">
                    {tab.label}
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="bg-white rounded-xl border-2 border-[#2C3930] p-3 sm:p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                  Active Trackers
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#2C3930]">
                  {totalTrackers}
                </p>
              </div>
              <div className="p-2 bg-[#2C3930]/10 rounded-lg flex-shrink-0 ml-2">
                <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-[#2C3930]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#2C3930] p-3 sm:p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                  Completed Tasks
                </p>
                <p className="text-lg sm:text-xl font-bold text-green-600">
                  {completedTasks}
                </p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg flex-shrink-0 ml-2">
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#2C3930] p-3 sm:p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                  Total Points
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#2C3930]">
                  {totalPoints}
                </p>
              </div>
              <div className="p-2 bg-[#2C3930]/10 rounded-lg flex-shrink-0 ml-2">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-[#2C3930]" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border-2 border-[#2C3930] p-3 sm:p-4 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
                  Active Challenges
                </p>
                <p className="text-lg sm:text-xl font-bold text-[#2C3930]">
                  {activeChallenges.length}
                </p>
              </div>
              <div className="p-2 bg-[#2C3930]/10 rounded-lg flex-shrink-0 ml-2">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-[#2C3930]" />
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
          className="mb-4 sm:mb-6"
        >
          {activeTab === "overview" && (
            <div className="space-y-4 sm:space-y-6">
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
      </div>
    </div>
  );
}
