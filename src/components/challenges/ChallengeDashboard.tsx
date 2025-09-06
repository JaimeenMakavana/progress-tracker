"use client";
import React from "react";
import { motion } from "framer-motion";
import { useChallenges } from "../../hooks/useChallenges";
import ChallengeCard from "./ChallengeCard";
import { ChallengeHeader } from "./ChallengeHeader";
import { ChallengeStats } from "./ChallengeStats";
import { ChallengeTabs } from "./ChallengeTabs";
import { ChallengeEmptyState } from "./ChallengeEmptyState";
import { ChallengeMotivation } from "./ChallengeMotivation";
import { BackgroundOrbs, SpringContainer } from "../ui/animations";

interface ChallengeDashboardProps {
  className?: string;
}

export default function ChallengeDashboard({
  className = "",
}: ChallengeDashboardProps) {
  const {
    activeTab,
    setActiveTab,
    userProfile,
    activeChallenges,
    completedChallenges,
    availableChallenges,
    getTotalPoints,
    getCompletedCount,
    getActiveCount,
    handleJoinChallenge,
    handleLeaveChallenge,
    handleCreateNewChallenge,
    getCurrentChallenges,
  } = useChallenges();

  return (
    <div
      className={`relative bg-white rounded-2xl border-2 border-[#2C3930] p-6 sm:p-8 overflow-hidden ${className}`}
    >
      {/* Background decorative elements */}
      <BackgroundOrbs
        className="absolute inset-0"
        orbCount={2}
        size="large"
        color="[#2C3930]"
      />

      {/* Header */}
      <ChallengeHeader onCreateChallenge={handleCreateNewChallenge} />

      {/* Stats */}
      <ChallengeStats
        completedCount={getCompletedCount()}
        activeCount={getActiveCount()}
        totalPoints={getTotalPoints()}
      />

      {/* Tabs */}
      <ChallengeTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeChallenges={activeChallenges}
        completedChallenges={completedChallenges}
        availableChallenges={availableChallenges}
      />

      {/* Challenges List */}
      <motion.div
        className="space-y-4 sm:space-y-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
      >
        {getCurrentChallenges().length === 0 ? (
          <ChallengeEmptyState activeTab={activeTab} />
        ) : (
          getCurrentChallenges().map((challenge, index) => (
            <SpringContainer
              key={challenge.id}
              delay={1.6 + index * 0.1}
              stiffness={200}
              damping={25}
            >
              <ChallengeCard
                challenge={challenge}
                onJoin={handleJoinChallenge}
                onLeave={handleLeaveChallenge}
                isParticipating={challenge.participants?.includes(
                  userProfile?.currentIdentity || ""
                )}
              />
            </SpringContainer>
          ))
        )}
      </motion.div>

      {/* Motivational Message */}
      <ChallengeMotivation activeChallengesCount={activeChallenges.length} />
    </div>
  );
}
