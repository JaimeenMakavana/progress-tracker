"use client";
import React from "react";
import { motion } from "framer-motion";
import { StreakDashboard } from "../streak";
import { DisciplineVisualization } from "../progress";
import { ChallengeDashboard } from "../challenges";
import { UserProfile } from "../profile";
import { Tracker } from "../../types";

interface TabContentProps {
  activeTab: "overview" | "challenges" | "profile";
  trackers: Tracker[];
  enableStreakTracking: (trackerId: string) => void;
}

export const TabContent = ({
  activeTab,
  trackers,
  enableStreakTracking,
}: TabContentProps) => {
  const renderOverviewContent = () => (
    <motion.div
      className="space-y-6 sm:space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      {/* Streak Dashboard */}
      {trackers.length > 0 && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="relative bg-white  border-gray-200/50 overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/30"></div>

            {/* Content */}
            <div className="relative z-10">
              <StreakDashboard
                trackers={trackers}
                onEnableStreak={enableStreakTracking}
                onViewTracker={(id) =>
                  (window.location.href = `/tracker/${id}`)
                }
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Discipline Visualization */}
      {trackers.length > 0 && trackers.some((t) => t.streakData) && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="relative bg-white">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/30"></div>

            {/* Content */}
            <div className="relative z-10">
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
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );

  const renderChallengesContent = () => (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="relative bg-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/30"></div>

        {/* Content */}
        <div className="relative z-10">
          <ChallengeDashboard />
        </div>
      </div>
    </motion.div>
  );

  const renderProfileContent = () => (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="relative bg-white">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/30"></div>

        {/* Content */}
        <div className="relative z-10">
          <UserProfile />
        </div>
      </div>
    </motion.div>
  );

  return (
    <motion.div
      key={activeTab}
      initial={{ opacity: 0, y: 30, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.8,
        delay: 0.2,
        ease: [0.4, 0, 0.2, 1],
      }}
      className="mb-6 sm:mb-8"
    >
      {activeTab === "overview" && renderOverviewContent()}
      {activeTab === "challenges" && renderChallengesContent()}
      {activeTab === "profile" && renderProfileContent()}
    </motion.div>
  );
};
