"use client";
import React from "react";
import { motion, MotionProps } from "framer-motion";

interface StaggeredContainerProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  baseDelay?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

const staggerVariants = {
  up: {
    initial: { opacity: 0, y: 30, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  down: {
    initial: { opacity: 0, y: -30, scale: 0.9 },
    animate: { opacity: 1, y: 0, scale: 1 },
  },
  left: {
    initial: { opacity: 0, x: 30, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
  right: {
    initial: { opacity: 0, x: -30, scale: 0.9 },
    animate: { opacity: 1, x: 0, scale: 1 },
  },
  scale: {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
  },
};

export const StaggeredContainer = ({
  children,
  className = "",
  baseDelay = 0,
  direction = "up",
  ...motionProps
}: StaggeredContainerProps) => {
  const variant = staggerVariants[direction];

  return (
    <motion.div
      className={className}
      initial={variant.initial}
      animate={variant.animate}
      transition={{
        duration: 0.6,
        delay: baseDelay,
        type: "spring",
        stiffness: 150,
        damping: 20,
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

// Helper function to calculate staggered delays
export const getStaggerDelay = (
  index: number,
  baseDelay: number = 0,
  staggerDelay: number = 0.1
) => {
  return baseDelay + index * staggerDelay;
};
