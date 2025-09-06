"use client";
import React from "react";
import { motion } from "framer-motion";
import { SpringContainer, HoverEffects } from "../ui/animations";
import { Challenge } from "../../types";

interface ChallengeTabsProps {
  activeTab: "active" | "completed" | "available";
  onTabChange: (tab: "active" | "completed" | "available") => void;
  activeChallenges: Challenge[];
  completedChallenges: Challenge[];
  availableChallenges: Challenge[];
}

const tabs = [
  {
    id: "active" as const,
    label: "Active",
    shortLabel: "Active",
    delay: 1.2,
  },
  {
    id: "completed" as const,
    label: "Completed",
    shortLabel: "Done",
    delay: 1.3,
  },
  {
    id: "available" as const,
    label: "Available",
    shortLabel: "New",
    delay: 1.4,
  },
];

export const ChallengeTabs = ({
  activeTab,
  onTabChange,
  activeChallenges,
  completedChallenges,
  availableChallenges,
}: ChallengeTabsProps) => {
  const challengeCounts = {
    active: activeChallenges.length,
    completed: completedChallenges.length,
    available: availableChallenges.length,
  };

  return (
    <motion.div
      className="relative flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8 "
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.9 }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-[#2C3930]/5 via-transparent to-[#2C3930]/5 rounded-2xl blur-xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 1.0 }}
      />

      {tabs.map((tab) => (
        <SpringContainer
          key={tab.id}
          className="relative group flex-1 sm:flex-none z-10"
          delay={tab.delay}
          stiffness={150}
          damping={20}
        >
          <HoverEffects effect="glow" intensity="medium">
            <motion.button
              onClick={() => onTabChange(tab.id)}
              className={`relative w-full p-3 sm:p-4 rounded-2xl border-2 transition-all duration-500 min-w-0 overflow-hidden backdrop-blur-sm ${
                activeTab === tab.id
                  ? "border-[#2C3930] bg-gradient-to-r from-[#2C3930] to-[#2C3930]/90 text-white shadow-2xl"
                  : "border-gray-200/50 hover:border-[#2C3930]/50 hover:bg-white/80 text-gray-700 hover:text-[#2C3930] shadow-lg hover:shadow-xl"
              }`}
            >
              {/* Background glow for active state */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute inset-0 bg-white/10 rounded-2xl"
                  animate={{
                    scale: [1, 1.02, 1],
                    opacity: [0.3, 0.6, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-[#2C3930]/5 rounded-2xl opacity-0"
                whileHover={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              />

              <div className="relative z-10">
                <motion.div
                  className="font-bold text-sm sm:text-base whitespace-nowrap mb-1"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </motion.div>
                <motion.div
                  className="text-xs sm:text-sm opacity-75"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {challengeCounts[tab.id]} challenges
                </motion.div>
              </div>

              {/* Ripple effect */}
              <motion.div
                className="absolute inset-0 rounded-2xl bg-white/20"
                initial={{ scale: 0, opacity: 0 }}
                whileTap={{ scale: 1.2, opacity: 1 }}
                transition={{ duration: 0.2 }}
              />

              {/* Active state indicator */}
              {activeTab === tab.id && (
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full shadow-lg"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    duration: 0.4,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                />
              )}
            </motion.button>
          </HoverEffects>

          {/* Enhanced Mobile Tooltip */}
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white text-xs font-medium rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none sm:hidden z-20 backdrop-blur-md border border-gray-600/30"
            initial={{ scale: 0.7, y: 10, opacity: 0 }}
            whileHover={{ scale: 1, y: 0, opacity: 1 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 300,
              damping: 25,
            }}
          >
            {/* Tooltip glow effect */}
            <motion.div
              className="absolute inset-0 bg-white/10 rounded-xl blur-sm"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <span className="relative z-10">
              {tab.label} ({challengeCounts[tab.id]} challenges)
            </span>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
          </motion.div>
        </SpringContainer>
      ))}
    </motion.div>
  );
};
