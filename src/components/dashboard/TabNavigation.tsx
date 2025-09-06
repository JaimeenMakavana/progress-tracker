"use client";
import React from "react";
import { motion } from "framer-motion";
import { BarChart3, Trophy, Users } from "lucide-react";

interface TabNavigationProps {
  activeTab: "overview" | "challenges" | "profile";
  onTabChange: (tab: "overview" | "challenges" | "profile") => void;
}

const tabs = [
  {
    id: "overview" as const,
    label: "Overview",
    icon: BarChart3,
    shortLabel: "Overview",
  },
  {
    id: "challenges" as const,
    label: "Challenges",
    icon: Trophy,
    shortLabel: "Challenges",
  },
  {
    id: "profile" as const,
    label: "Profile",
    icon: Users,
    shortLabel: "Profile",
  },
];

export const TabNavigation = ({
  activeTab,
  onTabChange,
}: TabNavigationProps) => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-3 sm:gap-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.5 }}
    >
      {tabs.map((tab, index) => (
        <motion.div
          key={tab.id}
          className="relative group flex-1 sm:flex-none"
          title={tab.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
        >
          <motion.button
            onClick={() => onTabChange(tab.id)}
            className={`relative w-full flex items-center justify-center gap-2 sm:gap-3 px-4 py-3  rounded-2xl border-2 transition-all duration-300 text-sm sm:text-base font-semibold whitespace-nowrap min-w-0 overflow-hidden ${
              activeTab === tab.id
                ? "border-[#2C3930] bg-gradient-to-r from-[#2C3930] to-[#2C3930]/90 text-white shadow-lg"
                : "border-gray-200 hover:border-[#2C3930]/50 hover:bg-gray-50 text-gray-700 hover:text-[#2C3930]"
            }`}
            whileHover={{
              scale: 1.05,
              y: -2,
            }}
            whileTap={{ scale: 0.95 }}
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

            <motion.div
              className="relative z-10"
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <tab.icon className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.div>
            <span className="hidden sm:inline relative z-10">{tab.label}</span>
            <span className="sm:hidden relative z-10">{tab.shortLabel}</span>

            {/* Ripple effect */}
            <motion.div
              className="absolute inset-0 rounded-2xl bg-white/20"
              initial={{ scale: 0, opacity: 0 }}
              whileTap={{ scale: 1.2, opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </motion.button>

          {/* Enhanced Mobile Tooltip */}
          <motion.div
            className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-3 px-3 py-2 bg-gray-900 text-white text-xs font-medium rounded-xl shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none sm:hidden z-20"
            initial={{ scale: 0.8, y: 5 }}
            whileHover={{ scale: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {tab.label}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-transparent border-t-gray-900"></div>
          </motion.div>
        </motion.div>
      ))}
    </motion.div>
  );
};
