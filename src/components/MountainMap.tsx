"use client";
import React from "react";
import { motion } from "framer-motion";
import { Tracker, Milestone, Task } from "../types";
import { calculateProgress } from "../utils/progress";

interface MountainMapProps {
  tracker: Tracker;
  onMilestoneClick?: (milestone: Milestone) => void;
  onTaskClick?: (task: Task) => void;
}

interface MountainPoint {
  x: number;
  y: number;
  milestone: Milestone;
  tasks: Task[];
  completedTasks: Task[];
}

export default function MountainMap({
  tracker,
  onMilestoneClick,
  onTaskClick,
}: MountainMapProps) {
  const progress = calculateProgress(tracker);

  // Define mountain path points (5 base camps)
  const mountainPoints: MountainPoint[] = tracker.milestones.map(
    (milestone, index) => {
      const tasks = Object.values(tracker.tasks).filter((task) =>
        milestone.taskIds.includes(task.id)
      );
      const completedTasks = tasks.filter((task) => task.status === "done");

      // Calculate position along the mountain path
      const totalMilestones = tracker.milestones.length;
      const x = 20 + (index / (totalMilestones - 1)) * 60; // 20% to 80% of width
      const y = 80 - (index / (totalMilestones - 1)) * 50; // 80% to 30% of height

      return {
        x,
        y,
        milestone,
        tasks,
        completedTasks,
      };
    }
  );

  // Create SVG path for the mountain
  const createMountainPath = () => {
    if (mountainPoints.length < 2) return "";

    let path = `M ${mountainPoints[0].x} ${mountainPoints[0].y + 20}`;

    // Base of mountain
    path += ` L 10 100 L 90 100 L ${
      mountainPoints[mountainPoints.length - 1].x
    } ${mountainPoints[mountainPoints.length - 1].y + 20}`;

    // Mountain peaks
    mountainPoints.forEach((point, index) => {
      if (index === 0) {
        path += ` L ${point.x} ${point.y}`;
      } else {
        path += ` L ${point.x} ${point.y}`;
      }
    });

    path += " Z";
    return path;
  };

  const getTaskPosition = (
    taskIndex: number,
    totalTasks: number,
    baseX: number,
    baseY: number
  ) => {
    if (totalTasks === 1) return { x: baseX, y: baseY };

    const angle = (taskIndex / (totalTasks - 1)) * Math.PI; // Spread tasks in a semicircle
    const radius = 8;
    const x = baseX + Math.cos(angle) * radius;
    const y = baseY + Math.sin(angle) * radius;

    return { x, y };
  };

  return (
    <div className="w-full h-96 bg-white border-2 border-black rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-black">Mountain of Mastery</h3>
        <div className="text-sm text-gray-600">
          {progress.completed}/{progress.total} tasks completed
        </div>
      </div>

      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Mountain silhouette */}
        <motion.path
          d={createMountainPath()}
          fill="none"
          stroke="#000000"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />

        {/* Mountain fill */}
        <motion.path
          d={createMountainPath()}
          fill="#f5f5f5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        />

        {/* Base camps (milestones) */}
        {mountainPoints.map((point, index) => {
          const milestoneProgress =
            point.tasks.length > 0
              ? (point.completedTasks.length / point.tasks.length) * 100
              : 0;

          return (
            <g key={point.milestone.id}>
              {/* Base camp circle */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="3"
                fill={milestoneProgress === 100 ? "#000000" : "#666666"}
                stroke="#000000"
                strokeWidth="0.3"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="cursor-pointer"
                onClick={() => onMilestoneClick?.(point.milestone)}
              />

              {/* Milestone label */}
              <motion.text
                x={point.x}
                y={point.y - 5}
                textAnchor="middle"
                fontSize="2"
                fill="#000000"
                fontWeight="bold"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
              >
                {point.milestone.title.split(" ")[0]}
              </motion.text>

              {/* Task nodes around each base camp */}
              {point.tasks.map((task, taskIndex) => {
                const taskPos = getTaskPosition(
                  taskIndex,
                  point.tasks.length,
                  point.x,
                  point.y
                );
                const isCompleted = task.status === "done";

                return (
                  <motion.circle
                    key={task.id}
                    cx={taskPos.x}
                    cy={taskPos.y}
                    r="1"
                    fill={isCompleted ? "#000000" : "#cccccc"}
                    stroke={isCompleted ? "#000000" : "#999999"}
                    strokeWidth="0.2"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.2 + taskIndex * 0.1 + 0.5,
                    }}
                    className="cursor-pointer hover:r-1.5 transition-all"
                    onClick={() => onTaskClick?.(task)}
                  />
                );
              })}

              {/* Progress indicator */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="none"
                stroke="#000000"
                strokeWidth="0.2"
                strokeDasharray={`${2 * Math.PI * 4}`}
                strokeDashoffset={`${
                  2 * Math.PI * 4 * (1 - milestoneProgress / 100)
                }`}
                transform={`rotate(-90 ${point.x} ${point.y})`}
                initial={{ strokeDashoffset: 2 * Math.PI * 4 }}
                animate={{
                  strokeDashoffset:
                    2 * Math.PI * 4 * (1 - milestoneProgress / 100),
                }}
                transition={{ duration: 1, delay: index * 0.2 + 0.8 }}
              />
            </g>
          );
        })}

        {/* Summit flag */}
        {progress.percent === 100 && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <rect
              x={mountainPoints[mountainPoints.length - 1].x - 1}
              y={mountainPoints[mountainPoints.length - 1].y - 8}
              width="2"
              height="6"
              fill="#000000"
            />
            <polygon
              points={`${mountainPoints[mountainPoints.length - 1].x - 1},${
                mountainPoints[mountainPoints.length - 1].y - 8
              } ${mountainPoints[mountainPoints.length - 1].x + 3},${
                mountainPoints[mountainPoints.length - 1].y - 6
              } ${mountainPoints[mountainPoints.length - 1].x - 1},${
                mountainPoints[mountainPoints.length - 1].y - 4
              }`}
              fill="#000000"
            />
          </motion.g>
        )}
      </svg>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs text-gray-600">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
          <span>Pending</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full border border-black"></div>
          <span>Base Camp</span>
        </div>
      </div>
    </div>
  );
}
