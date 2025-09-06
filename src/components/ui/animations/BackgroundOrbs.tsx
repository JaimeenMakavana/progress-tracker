"use client";
import React from "react";
import { motion } from "framer-motion";

interface BackgroundOrbsProps {
  className?: string;
  orbCount?: number;
  color?: string;
  size?: "small" | "medium" | "large";
}

const sizeVariants = {
  small: { width: "w-16", height: "h-16" },
  medium: { width: "w-32", height: "h-32" },
  large: { width: "w-40", height: "h-40" },
};

export const BackgroundOrbs = ({
  className = "",
  orbCount = 2,
  color = "[#2C3930]",
  size = "medium",
}: BackgroundOrbsProps) => {
  const sizeClasses = sizeVariants[size];

  return (
    <div
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
    >
      {Array.from({ length: orbCount }).map((_, index) => (
        <motion.div
          key={index}
          className={`absolute ${sizeClasses.width} ${sizeClasses.height} bg-gradient-to-br from-${color}/5 to-transparent rounded-full blur-2xl`}
          style={{
            left: `${20 + index * 30}%`,
            top: `${30 + (index % 2) * 40}%`,
          }}
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 3 + index * 0.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.3,
          }}
        />
      ))}
    </div>
  );
};
