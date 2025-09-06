"use client";
import React from "react";
import { motion } from "framer-motion";
import { SpringContainer, BackgroundOrbs } from "../ui/animations";

interface ChallengeEmptyStateProps {
  activeTab: "active" | "completed" | "available";
}

const emptyStateConfig = {
  active: {
    emoji: "🎯",
    title: "No active challenges",
    description: "Join a challenge to get started!",
  },
  completed: {
    emoji: "🏆",
    title: "No completed challenges",
    description: "Complete some challenges to see them here!",
  },
  available: {
    emoji: "📋",
    title: "No available challenges",
    description: "Check back later for new challenges!",
  },
};

export const ChallengeEmptyState = ({
  activeTab,
}: ChallengeEmptyStateProps) => {
  const config = emptyStateConfig[activeTab];

  return (
    <SpringContainer
      className="relative text-center py-16 sm:py-20 text-gray-500"
      delay={1.6}
      stiffness={200}
      damping={25}
    >
      {/* Background decorative elements */}
      <BackgroundOrbs
        className="absolute inset-0"
        orbCount={1}
        size="medium"
        color="[#2C3930]"
      />

      <motion.div
        className="relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.7 }}
      >
        <motion.div
          className="text-6xl sm:text-7xl mb-6"
          animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {config.emoji}
        </motion.div>

        <motion.h3
          className="text-xl sm:text-2xl font-bold text-gray-700 mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          {config.title}
        </motion.h3>

        <motion.p
          className="text-sm sm:text-base text-gray-500 max-w-md mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
        >
          {config.description}
        </motion.p>
      </motion.div>
    </SpringContainer>
  );
};
