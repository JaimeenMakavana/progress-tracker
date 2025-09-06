"use client";
import React from "react";
import { motion } from "framer-motion";
import { StreakData } from "../../types";

interface TreeVisualizationProps {
  streakData: StreakData;
  className?: string;
}

export default function TreeVisualization({
  streakData,
  className = "",
}: TreeVisualizationProps) {
  const { currentStreak, longestStreak } = streakData;

  // Calculate tree growth based on streak
  const getTreeSize = (streak: number) => {
    if (streak === 0) return 0.3;
    if (streak < 7) return 0.4 + (streak / 7) * 0.2;
    if (streak < 30) return 0.6 + ((streak - 7) / 23) * 0.3;
    if (streak < 100) return 0.9 + ((streak - 30) / 70) * 0.1;
    return 1;
  };

  const getTreeHealth = (streak: number) => {
    if (streak === 0) return "sick";
    if (streak < 3) return "struggling";
    if (streak < 7) return "growing";
    if (streak < 30) return "healthy";
    if (streak < 100) return "thriving";
    return "ancient";
  };

  const treeSize = getTreeSize(currentStreak);
  const treeHealth = getTreeHealth(currentStreak);

  const getTreeColor = (health: string) => {
    switch (health) {
      case "sick":
        return "#ef4444"; // red
      case "struggling":
        return "#f97316"; // orange
      case "growing":
        return "#eab308"; // yellow
      case "healthy":
        return "#22c55e"; // green
      case "thriving":
        return "#16a34a"; // dark green
      case "ancient":
        return "#15803d"; // forest green
      default:
        return "#22c55e";
    }
  };

  const getLeavesCount = (streak: number) => {
    if (streak === 0) return 0;
    if (streak < 7) return Math.min(streak * 2, 12);
    if (streak < 30) return 12 + Math.min((streak - 7) * 1.5, 30);
    if (streak < 100) return 42 + Math.min((streak - 30) * 0.5, 35);
    return 77;
  };

  const leavesCount = getLeavesCount(currentStreak);

  return (
    <div className={`relative ${className}`}>
      <svg
        width="200"
        height="250"
        viewBox="0 0 200 250"
        className="overflow-visible"
      >
        {/* Ground */}
        <motion.rect
          x="80"
          y="200"
          width="40"
          height="50"
          fill="#8b5cf6"
          rx="5"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Tree trunk */}
        <motion.rect
          x="95"
          y={200 - 80 * treeSize}
          width="10"
          height={80 * treeSize}
          fill="#8b4513"
          rx="2"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Tree canopy */}
        <motion.ellipse
          cx="100"
          cy={200 - 80 * treeSize - 30 * treeSize}
          rx={40 * treeSize}
          ry={30 * treeSize}
          fill={getTreeColor(treeHealth)}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Leaves */}
        {[...Array(leavesCount)].map((_, i) => {
          const angle = (i / leavesCount) * 2 * Math.PI;
          const radius = 25 * treeSize + Math.random() * 15 * treeSize;
          const x = 100 + Math.cos(angle) * radius;
          const y =
            200 -
            80 * treeSize -
            30 * treeSize +
            Math.sin(angle) * radius * 0.6;

          return (
            <motion.circle
              key={i}
              cx={x}
              cy={y}
              r={2 + Math.random() * 2}
              fill={getTreeColor(treeHealth)}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: 0.8 + i * 0.02,
              }}
            />
          );
        })}

        {/* Falling leaves animation when streak is broken */}
        {currentStreak === 0 && longestStreak > 0 && (
          <>
            {[...Array(5)].map((_, i) => (
              <motion.circle
                key={`falling-${i}`}
                cx={100 + (i - 2) * 20}
                cy={200 - 80 * treeSize - 30 * treeSize}
                r={2}
                fill="#ef4444"
                initial={{ y: 0, opacity: 1 }}
                animate={{
                  y: 100,
                  opacity: 0,
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              />
            ))}
          </>
        )}

        {/* Growth rings for milestones */}
        {currentStreak >= 7 && (
          <motion.circle
            cx="100"
            cy={200 - 80 * treeSize - 30 * treeSize}
            r={45 * treeSize}
            fill="none"
            stroke="#fbbf24"
            strokeWidth="2"
            strokeDasharray="5,5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.6 }}
            transition={{ duration: 1, delay: 1.2 }}
          />
        )}

        {currentStreak >= 30 && (
          <motion.circle
            cx="100"
            cy={200 - 80 * treeSize - 30 * treeSize}
            r={50 * treeSize}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="3,3"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1, delay: 1.4 }}
          />
        )}

        {currentStreak >= 100 && (
          <motion.circle
            cx="100"
            cy={200 - 80 * treeSize - 30 * treeSize}
            r={55 * treeSize}
            fill="none"
            stroke="#d97706"
            strokeWidth="3"
            strokeDasharray="2,2"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 1.6 }}
          />
        )}
      </svg>

      {/* Status text */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <motion.div
          className="text-sm font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8 }}
        >
          <div
            className={`font-bold ${
              treeHealth === "sick"
                ? "text-red-500"
                : treeHealth === "struggling"
                ? "text-orange-500"
                : treeHealth === "growing"
                ? "text-yellow-500"
                : treeHealth === "healthy"
                ? "text-green-500"
                : treeHealth === "thriving"
                ? "text-green-600"
                : "text-green-700"
            }`}
          >
            {currentStreak === 0
              ? "🌱"
              : currentStreak < 7
              ? "🌿"
              : currentStreak < 30
              ? "🌳"
              : currentStreak < 100
              ? "🌲"
              : "🌳"}
            {currentStreak} days
          </div>
          <div className="text-xs text-gray-600 capitalize">
            {treeHealth} tree
          </div>
        </motion.div>
      </div>
    </div>
  );
}
