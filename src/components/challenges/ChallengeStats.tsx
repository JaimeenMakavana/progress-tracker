"use client";
import React from "react";
import { motion } from "framer-motion";
import { Trophy, Target, Users } from "lucide-react";
import { SpringContainer, HoverEffects } from "../ui/animations";

interface ChallengeStatsProps {
  completedCount: number;
  activeCount: number;
  totalPoints: number;
}

const stats = [
  {
    title: "Completed",
    icon: Trophy,
    color: "blue",
    bgColor: "bg-blue-50",
    iconColor: "text-blue-600",
    textColor: "text-blue-800",
    delay: 0.6,
  },
  {
    title: "Active",
    icon: Target,
    color: "green",
    bgColor: "bg-green-50",
    iconColor: "text-green-600",
    textColor: "text-green-800",
    delay: 0.7,
  },
  {
    title: "Points Earned",
    icon: Users,
    color: "purple",
    bgColor: "bg-purple-50",
    iconColor: "text-purple-600",
    textColor: "text-purple-800",
    delay: 0.8,
  },
];

export const ChallengeStats = ({
  completedCount,
  activeCount,
  totalPoints,
}: ChallengeStatsProps) => {
  const values = [completedCount, activeCount, totalPoints];

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {stats.map((stat, index) => (
        <SpringContainer
          key={stat.title}
          className="relative group"
          delay={stat.delay}
          stiffness={200}
          damping={25}
        >
          <HoverEffects effect="glow" intensity="medium">
            <div
              className={`relative flex justify-between items-center text-center p-4 ${stat.bgColor} rounded-2xl border border-gray-200/50 hover:border-[#2C3930]/30 transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden`}
            >
              {/* Background gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent rounded-2xl"></div>

              {/* Hover glow effect */}
              <motion.div
                className="absolute inset-0 bg-[#2C3930]/5 rounded-2xl opacity-0 group-hover:opacity-100"
                transition={{ duration: 0.3 }}
              />

              <motion.div
                className={`${stat.iconColor}`}
                initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{
                  delay: stat.delay + 0.2,
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
                <stat.icon className="w-6 h-6 sm:w-8 sm:h-8" />
              </motion.div>
              <div className="flex flex-col items-center justify-center">
                <motion.div
                  className={`text-2xl sm:text-3xl font-bold ${stat.textColor} mb-1`}
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
                </motion.div>

                <motion.div
                  className={`text-sm sm:text-base font-semibold ${stat.iconColor}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: stat.delay + 0.4,
                    duration: 0.4,
                  }}
                >
                  {stat.title}
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
          </HoverEffects>
        </SpringContainer>
      ))}
    </motion.div>
  );
};
