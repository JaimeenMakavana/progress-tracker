"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  CheckCircle,
  Sparkles,
  Target,
  CheckSquare,
} from "lucide-react";
import { TodoStats } from "../../types";

interface StatsOverviewProps {
  totalTrackers: number;
  completedTasks: number;
  totalPoints: number;
  activeChallenges: number;
  todoStats: TodoStats;
}

const stats = [
  {
    title: "Active Trackers",
    icon: BarChart3,
    color: "[#2C3930]",
    bgColor: "bg-[#2C3930]/10",
    delay: 0.8,
  },
  {
    title: "Completed Tasks",
    icon: CheckCircle,
    color: "green-600",
    bgColor: "bg-green-100",
    delay: 0.9,
  },
  {
    title: "Total Points",
    icon: Sparkles,
    color: "[#2C3930]",
    bgColor: "bg-[#2C3930]/10",
    delay: 1.0,
  },
  {
    title: "Active Challenges",
    icon: Target,
    color: "[#2C3930]",
    bgColor: "bg-[#2C3930]/10",
    delay: 1.1,
  },
  {
    title: "Todos Completed",
    icon: CheckSquare,
    color: "blue-600",
    bgColor: "bg-blue-100",
    delay: 1.2,
  },
  {
    title: "Todo Streak",
    icon: Target,
    color: "orange-600",
    bgColor: "bg-orange-100",
    delay: 1.3,
  },
];

export const StatsOverview = ({
  totalTrackers,
  completedTasks,
  totalPoints,
  activeChallenges,
  todoStats,
}: StatsOverviewProps) => {
  const values = [
    totalTrackers,
    completedTasks,
    totalPoints,
    activeChallenges,
    todoStats.completedTodos,
    todoStats.currentStreak,
  ];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-6 mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
    >
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          className="relative group"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            delay: stat.delay,
            type: "spring",
            stiffness: 200,
            damping: 25,
          }}
        >
          <div className="relative bg-white rounded-2xl border-2 border-gray-200 hover:border-[#2C3930]/50 p-4 sm:p-6 transition-all duration-500 shadow-lg hover:shadow-2xl overflow-hidden">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-white to-gray-50/50 rounded-2xl"></div>

            {/* Hover glow effect */}
            <motion.div
              className="absolute inset-0 bg-[#2C3930]/5 rounded-2xl opacity-0 group-hover:opacity-100"
              transition={{ duration: 0.3 }}
            />

            <div className="relative flex items-center justify-between z-10">
              <div className="min-w-0 flex-1">
                <motion.p
                  className="text-sm sm:text-base font-semibold text-gray-600 mb-2 truncate"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: stat.delay + 0.2, duration: 0.4 }}
                >
                  {stat.title}
                </motion.p>
                <motion.p
                  className={`text-2xl sm:text-3xl font-bold text-${stat.color}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    delay: stat.delay + 0.3,
                    duration: 0.5,
                    type: "spring",
                    stiffness: 300,
                    damping: 25,
                  }}
                >
                  {values[index]}
                </motion.p>
              </div>
              <motion.div
                className={`p-3 ${stat.bgColor} rounded-2xl flex-shrink-0 ml-4 shadow-md`}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: stat.delay + 0.4,
                  duration: 0.5,
                  type: "spring",
                  stiffness: 300,
                  damping: 25,
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: 5,
                }}
              >
                <stat.icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 text-${stat.color}`}
                />
              </motion.div>
            </div>

            {/* Decorative corner */}
            <motion.div
              className="absolute top-2 right-2 w-2 h-2 bg-[#2C3930]/20 rounded-full"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: stat.delay + 0.5, duration: 0.3 }}
            />
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};
