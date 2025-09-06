"use client";
import React from "react";
import { motion, MotionProps } from "framer-motion";

interface SpringContainerProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  stiffness?: number;
  damping?: number;
  direction?: "up" | "down" | "left" | "right" | "scale";
}

const springVariants = {
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

export const SpringContainer = ({
  children,
  className = "",
  delay = 0,
  stiffness = 200,
  damping = 25,
  direction = "up",
  ...motionProps
}: SpringContainerProps) => {
  const variant = springVariants[direction];

  return (
    <motion.div
      className={className}
      initial={variant.initial}
      animate={variant.animate}
      transition={{
        duration: 0.6,
        delay,
        type: "spring",
        stiffness,
        damping,
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
