"use client";
import React from "react";
import { motion } from "framer-motion";
import { StreakData } from "../../types";

interface FireVisualizationProps {
  streakData: StreakData;
  className?: string;
}

export default function FireVisualization({
  streakData,
  className = "",
}: FireVisualizationProps) {
  const { currentStreak, longestStreak } = streakData;

  // Calculate fire intensity based on streak
  const getFireIntensity = (streak: number) => {
    if (streak === 0) return 0;
    if (streak < 3) return 0.3;
    if (streak < 7) return 0.5;
    if (streak < 30) return 0.7;
    if (streak < 100) return 0.9;
    return 1;
  };

  const getFireColor = (streak: number) => {
    if (streak === 0) return "#374151"; // gray
    if (streak < 3) return "#ef4444"; // red
    if (streak < 7) return "#f97316"; // orange
    if (streak < 30) return "#eab308"; // yellow
    if (streak < 100) return "#fbbf24"; // bright yellow
    return "#fde047"; // brightest yellow
  };

  const fireIntensity = getFireIntensity(currentStreak);
  const fireColor = getFireColor(currentStreak);

  const getFlameHeight = (streak: number) => {
    if (streak === 0) return 20;
    if (streak < 7) return 30 + (streak / 7) * 20;
    if (streak < 30) return 50 + ((streak - 7) / 23) * 30;
    if (streak < 100) return 80 + ((streak - 30) / 70) * 20;
    return 100;
  };

  const flameHeight = getFlameHeight(currentStreak);

  return (
    <div className={`relative ${className}`}>
      <svg
        width="120"
        height="150"
        viewBox="0 0 120 150"
        className="overflow-visible"
      >
        {/* Fire base/logs */}
        <motion.rect
          x="40"
          y="120"
          width="40"
          height="20"
          fill="#8b4513"
          rx="3"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.5 }}
        />

        {/* Main flame */}
        <motion.path
          d={`M 60 140 Q 40 ${140 - flameHeight} 60 ${
            140 - flameHeight * 1.2
          } Q 80 ${140 - flameHeight} 60 140`}
          fill={fireColor}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />

        {/* Secondary flames */}
        {currentStreak > 0 && (
          <>
            <motion.path
              d={`M 50 140 Q 35 ${140 - flameHeight * 0.7} 50 ${
                140 - flameHeight * 0.9
              } Q 65 ${140 - flameHeight * 0.7} 50 140`}
              fill={fireColor}
              opacity={0.8}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
            <motion.path
              d={`M 70 140 Q 85 ${140 - flameHeight * 0.7} 70 ${
                140 - flameHeight * 0.9
              } Q 55 ${140 - flameHeight * 0.7} 70 140`}
              fill={fireColor}
              opacity={0.8}
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            />
          </>
        )}

        {/* Sparks and embers */}
        {currentStreak > 0 && (
          <>
            {[...Array(Math.min(currentStreak, 20))].map((_, i) => (
              <motion.circle
                key={i}
                cx={60 + (Math.random() - 0.5) * 40}
                cy={140 - flameHeight + Math.random() * 20}
                r={1 + Math.random() * 2}
                fill="#fbbf24"
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -20 - Math.random() * 30],
                  x: [0, (Math.random() - 0.5) * 20],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: i * 0.1,
                  repeat: Infinity,
                  repeatDelay: 1 + Math.random() * 2,
                }}
              />
            ))}
          </>
        )}

        {/* Fire glow effect */}
        {currentStreak > 0 && (
          <motion.ellipse
            cx="60"
            cy={140 - flameHeight * 0.5}
            rx={30 * fireIntensity}
            ry={20 * fireIntensity}
            fill={fireColor}
            opacity={0.2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          />
        )}

        {/* Streak protection shield */}
        {streakData.streakProtection?.isActive && (
          <motion.circle
            cx="60"
            cy={140 - flameHeight * 0.5}
            r={40}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="5,5"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.8 }}
            transition={{ duration: 1, delay: 1 }}
          />
        )}

        {/* Extinguished fire (when streak is 0) */}
        {currentStreak === 0 && longestStreak > 0 && (
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {/* Smoke */}
            {[...Array(8)].map((_, i) => (
              <motion.ellipse
                key={i}
                cx={60 + (i - 4) * 8}
                cy={140 - flameHeight - 10 - i * 5}
                rx={3 + i}
                ry={2 + i * 0.5}
                fill="#6b7280"
                opacity={0.6 - i * 0.05}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: [0, 0.6 - i * 0.05, 0],
                  y: [0, -30 - i * 10],
                }}
                transition={{
                  duration: 3,
                  delay: i * 0.2,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />
            ))}
          </motion.g>
        )}
      </svg>

      {/* Status text */}
      <div className="absolute bottom-0 left-0 right-0 text-center">
        <motion.div
          className="text-sm font-semibold"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div
            className={`font-bold ${
              currentStreak === 0
                ? "text-gray-500"
                : currentStreak < 3
                ? "text-red-500"
                : currentStreak < 7
                ? "text-orange-500"
                : currentStreak < 30
                ? "text-yellow-500"
                : currentStreak < 100
                ? "text-yellow-600"
                : "text-yellow-700"
            }`}
          >
            {currentStreak === 0
              ? "💨"
              : currentStreak < 7
              ? "🔥"
              : currentStreak < 30
              ? "🔥"
              : currentStreak < 100
              ? "🔥"
              : "🔥"}
            {currentStreak} days
          </div>
          <div className="text-xs text-gray-600">
            {currentStreak === 0
              ? "Fire extinguished"
              : currentStreak < 7
              ? "Kindling"
              : currentStreak < 30
              ? "Burning bright"
              : currentStreak < 100
              ? "Inferno"
              : "Eternal flame"}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
