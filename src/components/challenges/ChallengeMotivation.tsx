"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  AnimatedContainer,
  BackgroundOrbs,
  HoverEffects,
} from "../ui/animations";

interface ChallengeMotivationProps {
  activeChallengesCount: number;
}

export const ChallengeMotivation = ({
  activeChallengesCount,
}: ChallengeMotivationProps) => {
  const message =
    activeChallengesCount === 0
      ? "Ready for a challenge? Join one to supercharge your productivity! 🚀"
      : `You're crushing it with ${activeChallengesCount} active challenge${
          activeChallengesCount > 1 ? "s" : ""
        }! Keep the momentum going! 💪`;

  return (
    <AnimatedContainer
      className="relative mt-8 p-6 sm:p-8 bg-gradient-to-r from-[#2C3930]/5 via-[#2C3930]/10 to-[#2C3930]/5 rounded-2xl border border-[#2C3930]/20 overflow-hidden"
      delay={2.0}
      direction="up"
    >
      {/* Background decorative elements */}
      <BackgroundOrbs
        className="absolute inset-0"
        orbCount={2}
        size="small"
        color="[#2C3930]"
      />

      <AnimatedContainer
        className="relative z-10 text-center"
        delay={2.1}
        direction="up"
      >
        <HoverEffects effect="scale" intensity="subtle">
          <motion.p className="text-base sm:text-lg text-gray-700 font-medium">
            {message}
          </motion.p>
        </HoverEffects>
      </AnimatedContainer>
    </AnimatedContainer>
  );
};
