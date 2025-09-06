"use client";
import React from "react";
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { AnimatedContainer, HoverEffects } from "../ui/animations";

interface ChallengeHeaderProps {
  onCreateChallenge: () => void;
}

export const ChallengeHeader = ({
  onCreateChallenge,
}: ChallengeHeaderProps) => {
  return (
    <div className="relative z-10 mb-8">
      <AnimatedContainer
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6"
        delay={0.1}
        direction="up"
      >
        <div>
          <AnimatedContainer
            className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2C3930] to-[#2C3930]/80 bg-clip-text text-transparent mb-3"
            delay={0.2}
            direction="left"
          >
            Challenge Dashboard
          </AnimatedContainer>
          <AnimatedContainer
            className="text-base sm:text-lg text-gray-600 max-w-2xl"
            delay={0.3}
            direction="up"
          >
            Join challenges to boost your productivity and earn rewards!
          </AnimatedContainer>
        </div>
        <AnimatedContainer delay={0.4} direction="right">
          <HoverEffects effect="glow" intensity="medium">
            <Button
              onClick={onCreateChallenge}
              className="flex items-center gap-2 text-white bg-gradient-to-r from-[#2C3930] to-[#2C3930]/90 hover:from-[#2C3930]/90 hover:to-[#2C3930] shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Plus className="w-4 h-4" />
              Create Challenge
            </Button>
          </HoverEffects>
        </AnimatedContainer>
      </AnimatedContainer>
    </div>
  );
};
