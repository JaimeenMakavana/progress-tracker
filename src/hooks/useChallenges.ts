import { useState } from "react";
import { Challenge } from "../types";
import { useTrackers } from "../context/TrackersContext";

export const useChallenges = () => {
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

  return {
    activeTab,
    setActiveTab,
    challenges,
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
  };
};
