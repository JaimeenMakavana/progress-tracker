"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { StreakData } from "../../types";
import TreeVisualization from "./TreeVisualization";
import FireVisualization from "./FireVisualization";
import MountainVisualization from "./MountainVisualization";

interface DisciplineVisualizationProps {
  streakData: StreakData;
  className?: string;
}

type VisualizationType = "tree" | "fire" | "mountain";

export default function DisciplineVisualization({
  streakData,
  className = "",
}: DisciplineVisualizationProps) {
  const [activeVisualization, setActiveVisualization] =
    useState<VisualizationType>("tree");

  const visualizations = [
    {
      id: "tree" as const,
      name: "Growth Tree",
      icon: "🌳",
      description: "Watch your discipline grow like a tree",
      component: TreeVisualization,
    },
    {
      id: "fire" as const,
      name: "Discipline Flame",
      icon: "🔥",
      description: "Keep your motivation burning bright",
      component: FireVisualization,
    },
    {
      id: "mountain" as const,
      name: "Mountain Journey",
      icon: "⛰️",
      description: "Climb the mountain of consistency",
      component: MountainVisualization,
    },
  ];

  const ActiveComponent = visualizations.find(
    (v) => v.id === activeVisualization
  )?.component;

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-black mb-2">
          Discipline Visualization
        </h3>
        <p className="text-gray-600 text-sm">
          Choose your preferred way to visualize your consistency journey
        </p>
      </div>

      {/* Visualization Selector */}
      <div className="flex gap-2 mb-6">
        {visualizations.map((viz) => (
          <motion.button
            key={viz.id}
            onClick={() => setActiveVisualization(viz.id)}
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              activeVisualization === viz.id
                ? "border-black bg-black text-white"
                : "border-gray-200 hover:border-gray-300"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="text-2xl mb-1">{viz.icon}</div>
            <div className="text-sm font-medium">{viz.name}</div>
            <div className="text-xs opacity-75 mt-1">{viz.description}</div>
          </motion.button>
        ))}
      </div>

      {/* Active Visualization */}
      <div className="flex justify-center">
        <motion.div
          key={activeVisualization}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {ActiveComponent && (
            <ActiveComponent
              streakData={streakData}
              className="transform scale-75"
            />
          )}
        </motion.div>
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-black">
            {streakData.currentStreak}
          </div>
          <div className="text-xs text-gray-600">Current Streak</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-black">
            {streakData.longestStreak}
          </div>
          <div className="text-xs text-gray-600">Best Streak</div>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <div className="text-lg font-bold text-black">
            {streakData.totalDaysActive}
          </div>
          <div className="text-xs text-gray-600">Total Days</div>
        </div>
      </div>

      {/* Motivational Message */}
      <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <p className="text-sm text-gray-700 text-center italic">
          {streakData.currentStreak === 0
            ? "Every journey begins with a single step. Start your streak today! 🌱"
            : streakData.currentStreak < 7
            ? "You're building momentum! Keep going to form a strong habit! 🔥"
            : streakData.currentStreak < 30
            ? "Amazing consistency! You're well on your way to mastery! ⚡"
            : "Incredible dedication! You're a discipline champion! 🏆"}
        </p>
      </div>
    </div>
  );
}
