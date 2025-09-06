"use client";
import React from "react";
import { motion } from "framer-motion";

interface ProgressBarProps {
  percent: number;
  size?: "sm" | "md" | "lg" | "xl";
  showLabel?: boolean;
  showPercentage?: boolean;
  animated?: boolean;
  className?: string;
}

export default function ProgressBar({
  percent,
  size = "md",
  showLabel = false,
  showPercentage = true,
  animated = true,
  className = "",
}: ProgressBarProps) {
  const heightClasses = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
    xl: "h-4",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
  };

  const safePercent = Math.min(100, Math.max(0, percent));

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span
            className={`${textSizeClasses[size]} text-gray-600 font-medium`}
          >
            Progress
          </span>
          {showPercentage && (
            <span
              className={`${textSizeClasses[size]} font-bold text-[#2C3930]`}
            >
              {Math.round(safePercent)}%
            </span>
          )}
        </div>
      )}
      <div className="relative">
        <div
          className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[size]} shadow-inner`}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-lime-400 to-blue-500 rounded-full relative"
            initial={animated ? { width: 0 } : { width: `${safePercent}%` }}
            animate={{ width: `${safePercent}%` }}
            transition={{
              duration: animated ? 1.2 : 0,
              ease: "easeOut",
              delay: animated ? 0.2 : 0,
            }}
          >
            {/* Shine effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                duration: 1.5,
                delay: animated ? 1.5 : 0,
                ease: "easeInOut",
              }}
            />
          </motion.div>
        </div>

        {/* Progress indicator dots */}
        {size === "lg" || size === "xl" ? (
          <div className="flex justify-between mt-1">
            {[0, 25, 50, 75, 100].map((milestone) => (
              <div
                key={milestone}
                className={`w-1 h-1 rounded-full ${
                  safePercent >= milestone ? "bg-[#2C3930]" : "bg-gray-300"
                }`}
              />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
