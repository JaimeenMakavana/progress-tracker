"use client";
import React from "react";
import { motion, MotionProps } from "framer-motion";

interface HoverEffectsProps extends MotionProps {
  children: React.ReactNode;
  className?: string;
  effect?: "scale" | "lift" | "rotate" | "glow";
  intensity?: "subtle" | "medium" | "strong";
}

const effectVariants = {
  scale: {
    subtle: { scale: 1.02 },
    medium: { scale: 1.05 },
    strong: { scale: 1.08 },
  },
  lift: {
    subtle: { y: -1 },
    medium: { y: -2 },
    strong: { y: -3 },
  },
  rotate: {
    subtle: { rotate: 2 },
    medium: { rotate: 5 },
    strong: { rotate: 10 },
  },
  glow: {
    subtle: { scale: 1.02, y: -1 },
    medium: { scale: 1.05, y: -2 },
    strong: { scale: 1.08, y: -3 },
  },
};

export const HoverEffects = ({
  children,
  className = "",
  effect = "scale",
  intensity = "medium",
  ...motionProps
}: HoverEffectsProps) => {
  const hoverVariant = effectVariants[effect][intensity];

  return (
    <motion.div
      className={className}
      whileHover={hoverVariant}
      whileTap={{ scale: 0.95 }}
      transition={{
        duration: 0.3,
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};
