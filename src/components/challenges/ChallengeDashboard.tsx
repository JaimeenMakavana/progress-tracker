"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Challenge } from "../../types";
import { useTrackers } from "../../context/TrackersContext";
import ChallengeCard from "./ChallengeCard";
import { Button } from "../ui/button";
import { Plus, Trophy, Target, Users } from "lucide-react";

interface ChallengeDashboardProps {
  className?: string;
}

export default function ChallengeDashboard({
  className = "",
}: ChallengeDashboardProps) {
  const { state, createChallenge, joinChallenge, leaveChallenge } =
    useTrackers();
  const [activeTab, setActiveTab] = useState<
    "active" | "completed" | "available"
  >("active");

  const challenges = Object.values(state.challenges || {});
  const userProfile = state.userProfile;

  const activeChallenges = challenges.filter(
    (c) => c.isActive && new Date(c.endDate) > new Date()
  );
  const completedChallenges = challenges.filter(
    (c) => c.progress >= c.target || new Date(c.endDate) <= new Date()
  );
  const availableChallenges = challenges.filter(
    (c) => !c.isActive && new Date(c.endDate) > new Date()
  );

  const getTotalPoints = () => {
    return challenges
      .filter((c) => c.progress >= c.target)
      .reduce((total, c) => {
        // Award points based on challenge type and difficulty
        const basePoints =
          c.type === "streak_sprint"
            ? 50
            : c.type === "effort_marathon"
            ? 75
            : 100;
        return total + basePoints;
      }, 0);
  };

  const getCompletedCount = () => {
    return completedChallenges.length;
  };

  const getActiveCount = () => {
    return activeChallenges.length;
  };

  const handleJoinChallenge = (challengeId: string) => {
    joinChallenge(challengeId);
  };

  const handleLeaveChallenge = (challengeId: string) => {
    leaveChallenge(challengeId);
  };

  const handleCreateNewChallenge = () => {
    // Create a sample challenge for demonstration
    const newChallenge: Challenge = {
      id: `challenge-${Date.now()}`,
      name: "7-Day Focus Sprint",
      description: "Complete at least 5 tasks per day for 7 consecutive days",
      type: "streak_sprint",
      duration: 7,
      target: 35, // 5 tasks × 7 days
      reward: "Unlock the Focus Master badge and 100 bonus points",
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      isActive: true,
      progress: 0,
      participants: [],
    };
    createChallenge(newChallenge);
  };

  const getCurrentChallenges = () => {
    switch (activeTab) {
      case "active":
        return activeChallenges;
      case "completed":
        return completedChallenges;
      case "available":
        return availableChallenges;
      default:
        return [];
    }
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 border-[#2C3930] p-6 ${className}`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-black mb-2">
              Challenge Dashboard
            </h2>
            <p className="text-gray-600">
              Join challenges to boost your productivity and earn rewards!
            </p>
          </div>
          <Button
            onClick={handleCreateNewChallenge}
            className="flex items-center gap-2 text-white"
          >
            <Plus className="w-4 h-4" />
            Create Challenge
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Trophy className="w-6 h-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-800">
              {getCompletedCount()}
            </div>
            <div className="text-sm text-blue-600">Completed</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Target className="w-6 h-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-800">
              {getActiveCount()}
            </div>
            <div className="text-sm text-green-600">Active</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Users className="w-6 h-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-800">
              {getTotalPoints()}
            </div>
            <div className="text-sm text-purple-600">Points Earned</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { id: "active", label: "Active", count: activeChallenges.length },
          {
            id: "completed",
            label: "Completed",
            count: completedChallenges.length,
          },
          {
            id: "available",
            label: "Available",
            count: availableChallenges.length,
          },
        ].map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() =>
              setActiveTab(tab.id as "active" | "completed" | "available")
            }
            className={`flex-1 p-3 rounded-lg border-2 transition-all ${
              activeTab === tab.id
                ? "border-[#2C3930] bg-[#2C3930] text-white"
                : "border-gray-200 hover:border-[#2C3930]"
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="font-medium">{tab.label}</div>
            <div className="text-sm opacity-75">{tab.count} challenges</div>
          </motion.button>
        ))}
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        {getCurrentChallenges().length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">
              {activeTab === "active"
                ? "🎯"
                : activeTab === "completed"
                ? "🏆"
                : "📋"}
            </div>
            <p className="text-lg font-medium mb-2">
              {activeTab === "active"
                ? "No active challenges"
                : activeTab === "completed"
                ? "No completed challenges"
                : "No available challenges"}
            </p>
            <p className="text-sm">
              {activeTab === "active"
                ? "Join a challenge to get started!"
                : activeTab === "completed"
                ? "Complete some challenges to see them here!"
                : "Check back later for new challenges!"}
            </p>
          </div>
        ) : (
          getCurrentChallenges().map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              onJoin={handleJoinChallenge}
              onLeave={handleLeaveChallenge}
              isParticipating={challenge.participants?.includes(
                userProfile?.currentIdentity || ""
              )}
            />
          ))
        )}
      </div>

      {/* Motivational Message */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
        <p className="text-sm text-gray-700 text-center italic">
          {activeChallenges.length === 0
            ? "Ready for a challenge? Join one to supercharge your productivity! 🚀"
            : `You're crushing it with ${
                activeChallenges.length
              } active challenge${
                activeChallenges.length > 1 ? "s" : ""
              }! Keep the momentum going! 💪`}
        </p>
      </div>
    </div>
  );
}
