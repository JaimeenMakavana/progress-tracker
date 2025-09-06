"use client";
import React from "react";
import { motion } from "framer-motion";

interface ProgressRingProps {
  progress: number; // 0-100
  size?: "sm" | "md" | "lg";
  showAnimation?: boolean;
  showReward?: boolean;
  rewardType?:
    | "streak_bonus"
    | "effort_bonus"
    | "consistency_bonus"
    | "milestone_bonus";
  className?: string;
}

export default function ProgressRing({
  progress,
  size = "md",
  showAnimation = true,
  showReward = false,
  rewardType = "streak_bonus",
  className = "",
}: ProgressRingProps) {
  const sizeClasses = {
    sm: { size: 24, stroke: 2 },
    md: { size: 32, stroke: 3 },
    lg: { size: 40, stroke: 4 },
  };

  const { size: ringSize, stroke } = sizeClasses[size];
  const radius = (ringSize - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  const getRewardEmoji = (type: string) => {
    switch (type) {
      case "streak_bonus":
        return "🔥";
      case "effort_bonus":
        return "💪";
      case "consistency_bonus":
        return "⚡";
      case "milestone_bonus":
        return "🏆";
      default:
        return "✨";
    }
  };

  const getRingColor = (progress: number) => {
    if (progress < 25) return "#ef4444"; // red
    if (progress < 50) return "#f97316"; // orange
    if (progress < 75) return "#eab308"; // yellow
    if (progress < 100) return "#22c55e"; // green
    return "#3b82f6"; // blue for 100%
  };

  return (
    <div className={`relative ${className}`}>
      <svg width={ringSize} height={ringSize} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />

        {/* Progress circle */}
        <motion.circle
          cx={ringSize / 2}
          cy={ringSize / 2}
          r={radius}
          stroke={getRingColor(progress)}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={
            showAnimation
              ? { strokeDashoffset: circumference }
              : { strokeDashoffset }
          }
          animate={{ strokeDashoffset }}
          transition={{
            duration: showAnimation ? 1.2 : 0,
            ease: "easeOut",
            delay: showAnimation ? 0.2 : 0,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {showReward && progress === 100 ? (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 10,
              delay: 0.5,
            }}
            className="text-lg"
          >
            {getRewardEmoji(rewardType)}
          </motion.div>
        ) : (
          <span className="text-xs font-semibold text-gray-600">
            {Math.round(progress)}%
          </span>
        )}
      </div>

      {/* Completion sparkle effect */}
      {showReward && progress === 100 && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-yellow-400 rounded-full"
              style={{
                left: "50%",
                top: "50%",
                transformOrigin: "0 0",
              }}
              initial={{
                x: 0,
                y: 0,
                scale: 0,
              }}
              animate={{
                x: Math.cos((i * 60 * Math.PI) / 180) * 20,
                y: Math.sin((i * 60 * Math.PI) / 180) * 20,
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                delay: 0.8 + i * 0.1,
                ease: "easeOut",
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
