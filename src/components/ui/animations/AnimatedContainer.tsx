"use client";
import React from "react";
import { motion, MotionProps } from "framer-motion";

interface AnimatedContainerProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "scale" | "fade";
}

const directionVariants = {
  up: { initial: { opacity: 0, y: 30 }, animate: { opacity: 1, y: 0 } },
  down: { initial: { opacity: 0, y: -30 }, animate: { opacity: 1, y: 0 } },
  left: { initial: { opacity: 0, x: 30 }, animate: { opacity: 1, x: 0 } },
  right: { initial: { opacity: 0, x: -30 }, animate: { opacity: 1, x: 0 } },
  scale: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 } },
};

export const AnimatedContainer = ({
  children,
  className = "",
  delay = 0,
  duration = 0.6,
  direction = "up",
  ...motionProps
}: AnimatedContainerProps) => {
  const variant = directionVariants[direction];

  return (
    <motion.div
      className={className}
      initial={variant.initial}
      animate={variant.animate}
      transition={{
        duration,
        delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
