"use client";
import React from "react";
import { motion } from "framer-motion";
import { StreakData } from "../../types";

interface MountainVisualizationProps {
  streakData: StreakData;
  className?: string;
}

export default function MountainVisualization({
  streakData,
  className = "",
}: MountainVisualizationProps) {
  const { currentStreak } = streakData;

  // Calculate progress up the mountain
  const getMountainProgress = (streak: number) => {
    if (streak === 0) return 0;
    if (streak < 7) return (streak / 7) * 0.2; // Base camp
    if (streak < 30) return 0.2 + ((streak - 7) / 23) * 0.4; // Mid mountain
    if (streak < 100) return 0.6 + ((streak - 30) / 70) * 0.3; // High altitude
    return 0.9 + Math.min((streak - 100) / 100, 0.1); // Summit approach
  };

  const mountainProgress = getMountainProgress(currentStreak);
  const climberY = 180 - mountainProgress * 120; // 180 is base, 60 is summit

  const getMountainColor = (progress: number) => {
    if (progress < 0.2) return "#6b7280"; // Gray base
    if (progress < 0.4) return "#4b5563"; // Darker gray
    if (progress < 0.6) return "#374151"; // Even darker
    if (progress < 0.8) return "#1f2937"; // Dark
    return "#111827"; // Darkest
  };

  const getClimberEmoji = (progress: number) => {
    if (progress < 0.2) return "🥾"; // Boots
    if (progress < 0.4) return "🧗"; // Climbing
    if (progress < 0.6) return "⛰️"; // Mountain
    if (progress < 0.8) return "🏔️"; // Snow mountain
    return "🏆"; // Trophy at summit
  };

  return (
    <div className={`relative ${className}`}>
      <svg
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="overflow-visible"
      >
        {/* Mountain silhouette */}
        <motion.path
          d="M 0 180 L 50 120 L 100 80 L 150 100 L 200 180 Z"
          fill={getMountainColor(mountainProgress)}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Mountain layers for depth */}
        <motion.path
          d="M 20 180 L 70 130 L 120 90 L 170 110 L 200 180 Z"
          fill={getMountainColor(mountainProgress + 0.1)}
          opacity={0.7}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        <motion.path
          d="M 40 180 L 90 140 L 140 100 L 190 120 L 200 180 Z"
          fill={getMountainColor(mountainProgress + 0.2)}
          opacity={0.5}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Snow cap for high altitudes */}
        {mountainProgress > 0.6 && (
          <motion.path
            d="M 80 80 L 100 60 L 120 80 L 140 100 L 120 90 L 100 70 L 80 90 Z"
            fill="#ffffff"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          />
        )}

        {/* Progress path */}
        <motion.path
          d="M 20 180 Q 60 160 100 140 Q 140 120 180 100"
          fill="none"
          stroke="#fbbf24"
          strokeWidth="3"
          strokeDasharray="5,5"
          opacity={0.6}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: mountainProgress }}
          transition={{ duration: 2, delay: 0.8 }}
        />

        {/* Base camps */}
        {mountainProgress >= 0.2 && (
          <motion.circle
            cx="60"
            cy="160"
            r="4"
            fill="#3b82f6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
          />
        )}

        {mountainProgress >= 0.5 && (
          <motion.circle
            cx="100"
            cy="120"
            r="4"
            fill="#3b82f6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.2 }}
          />
        )}

        {mountainProgress >= 0.8 && (
          <motion.circle
            cx="140"
            cy="100"
            r="4"
            fill="#3b82f6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.4 }}
          />
        )}

        {/* Climber */}
        <motion.g
          initial={{ y: 180 }}
          animate={{ y: climberY }}
          transition={{ duration: 1.5, delay: 1 }}
        >
          <motion.circle
            cx="100"
            cy="0"
            r="8"
            fill="#fbbf24"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 1.5 }}
          />
          <motion.text
            x="100"
            y="5"
            textAnchor="middle"
            fontSize="12"
            fill="white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, delay: 1.7 }}
          >
            {getClimberEmoji(mountainProgress)}
          </motion.text>
        </motion.g>

        {/* Summit flag */}
        {mountainProgress >= 0.9 && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2 }}
          >
            <motion.line
              x1="100"
              y1="60"
              x2="100"
              y2="40"
              stroke="#8b4513"
              strokeWidth="2"
            />
            <motion.rect x="100" y="40" width="15" height="10" fill="#ef4444" />
            <motion.text
              x="107"
              y="48"
              fontSize="8"
              fill="white"
              textAnchor="middle"
            >
              🏆
            </motion.text>
          </motion.g>
        )}

        {/* Clouds for atmosphere */}
        {mountainProgress > 0.3 && (
          <>
            <motion.ellipse
              cx="30"
              cy="50"
              rx="20"
              ry="8"
              fill="#e5e7eb"
              opacity={0.7}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 0.7 }}
              transition={{
                duration: 3,
                delay: 1.5,
                repeat: Infinity,
                repeatDelay: 5,
              }}
            />
            <motion.ellipse
              cx="170"
              cy="60"
              rx="25"
              ry="10"
              fill="#e5e7eb"
              opacity={0.5}
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 0.5 }}
              transition={{
                duration: 4,
                delay: 2,
                repeat: Infinity,
                repeatDelay: 6,
              }}
            />
          </>
        )}
      </svg>

      {/* Status text */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <motion.div
          className="text-sm font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.2 }}
        >
          <div className="font-bold text-gray-700">
            {getClimberEmoji(mountainProgress)} {currentStreak} days
          </div>
          <div className="text-xs text-gray-600">
            {mountainProgress < 0.2
              ? "Base camp"
              : mountainProgress < 0.4
              ? "Lower slopes"
              : mountainProgress < 0.6
              ? "Mid mountain"
              : mountainProgress < 0.8
              ? "High altitude"
              : mountainProgress < 0.9
              ? "Summit approach"
              : "Peak conquered!"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
