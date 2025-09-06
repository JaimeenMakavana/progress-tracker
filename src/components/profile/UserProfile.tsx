"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { useTrackers } from "../../context/TrackersContext";
import {
  calculateUserLevel,
  getLevelTitle,
  getNextLevelRequirements,
} from "../../utils/gamification";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { User, Trophy, Star, Target, Edit3 } from "lucide-react";

interface UserProfileProps {
  className?: string;
}

const identityBadges = [
  {
    id: "disciplined_learner",
    name: "Disciplined Learner",
    icon: "📚",
    description: "Consistent learning habits",
  },
  {
    id: "focused_creator",
    name: "Focused Creator",
    icon: "🎨",
    description: "Creative productivity master",
  },
  {
    id: "streak_champion",
    name: "Streak Champion",
    icon: "🔥",
    description: "Unbreakable consistency",
  },
  {
    id: "goal_crusher",
    name: "Goal Crusher",
    icon: "🎯",
    description: "Achievement-focused mindset",
  },
  {
    id: "mindful_doer",
    name: "Mindful Doer",
    icon: "🧘",
    description: "Conscious action taker",
  },
  {
    id: "growth_mindset",
    name: "Growth Mindset",
    icon: "🌱",
    description: "Continuous improvement",
  },
  {
    id: "productivity_ninja",
    name: "Productivity Ninja",
    icon: "🥷",
    description: "Efficiency expert",
  },
  {
    id: "habit_builder",
    name: "Habit Builder",
    icon: "🏗️",
    description: "Systematic habit formation",
  },
];

export default function UserProfile({ className = "" }: UserProfileProps) {
  const { state, updateUserProfile } = useTrackers();
  const [isEditing, setIsEditing] = useState(false);
  const [selectedIdentity, setSelectedIdentity] = useState("");

  const userProfile = state.userProfile || {
    identityBadges: [],
    currentIdentity: "Disciplined Learner",
    totalPoints: 0,
    level: 0,
    achievements: [],
    preferences: {
      enableAnimations: true,
      enableSounds: true,
      difficultyPreference: "medium" as const,
    },
  };

  const currentLevel = calculateUserLevel(userProfile.totalPoints);
  const levelTitle = getLevelTitle(currentLevel);
  const nextLevelReq = getNextLevelRequirements(currentLevel);

  const handleIdentityChange = (identity: string) => {
    setSelectedIdentity(identity);
    updateUserProfile({
      currentIdentity: identity,
    });
    setIsEditing(false);
  };

  const handleBadgeToggle = (badgeId: string) => {
    const currentBadges = userProfile.identityBadges || [];
    const newBadges = currentBadges.includes(badgeId)
      ? currentBadges.filter((id) => id !== badgeId)
      : [...currentBadges, badgeId];

    updateUserProfile({
      identityBadges: newBadges,
    });
  };

  return (
    <div
      className={`bg-white rounded-xl border-2 border-[#2C3930] p-6 ${className}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-black">Your Profile</h2>
            <p className="text-sm text-gray-600">Track your growth journey</p>
          </div>
        </div>
        <Button
          onClick={() => setIsEditing(!isEditing)}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Edit
        </Button>
      </div>

      {/* Current Identity */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-yellow-500" />
          <span className="font-semibold text-gray-800">Current Identity</span>
        </div>

        {isEditing ? (
          <div className="space-y-2">
            <p className="text-sm text-gray-600 mb-2">Choose your identity:</p>
            <div className="grid grid-cols-2 gap-2">
              {identityBadges.map((badge) => (
                <motion.button
                  key={badge.id}
                  onClick={() => handleIdentityChange(badge.name)}
                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                    selectedIdentity === badge.name ||
                    userProfile.currentIdentity === badge.name
                      ? "border-[#2C3930] bg-[#2C3930]/10"
                      : "border-gray-200 hover:border-[#2C3930]"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{badge.icon}</span>
                    <div>
                      <div className="font-medium text-sm">{badge.name}</div>
                      <div className="text-xs text-gray-600">
                        {badge.description}
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-2xl">
                {identityBadges.find(
                  (b) => b.name === userProfile.currentIdentity
                )?.icon || "👤"}
              </span>
              <div>
                <div className="font-bold text-lg text-gray-800">
                  {userProfile.currentIdentity}
                </div>
                <div className="text-sm text-gray-600">
                  {
                    identityBadges.find(
                      (b) => b.name === userProfile.currentIdentity
                    )?.description
                  }
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Level & Points */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Trophy className="w-5 h-5 text-purple-500" />
          <span className="font-semibold text-gray-800">Level & Progress</span>
        </div>

        <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="font-bold text-lg text-purple-800">
                {levelTitle}
              </div>
              <div className="text-sm text-purple-600">
                Level {currentLevel}
              </div>
            </div>
            <div className="text-right">
              <div className="font-bold text-lg text-purple-800">
                {userProfile.totalPoints}
              </div>
              <div className="text-sm text-purple-600">Total Points</div>
            </div>
          </div>

          {/* Progress to next level */}
          <div className="mt-3">
            <div className="flex justify-between text-xs text-purple-600 mb-1">
              <span>Progress to Level {nextLevelReq.nextLevel}</span>
              <span>{nextLevelReq.pointsToNext} points needed</span>
            </div>
            <div className="w-full bg-purple-200 rounded-full h-2">
              <motion.div
                className="h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${Math.min(
                    (userProfile.totalPoints / nextLevelReq.pointsNeeded) * 100,
                    100
                  )}%`,
                }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Identity Badges */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Target className="w-5 h-5 text-green-500" />
          <span className="font-semibold text-gray-800">Identity Badges</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {identityBadges.map((badge) => {
            const isActive = userProfile.identityBadges?.includes(badge.id);
            return (
              <motion.button
                key={badge.id}
                onClick={() => handleBadgeToggle(badge.id)}
                className={`p-3 rounded-lg border-2 transition-all text-left ${
                  isActive
                    ? "border-[#2C3930] bg-[#2C3930]/10"
                    : "border-gray-200 hover:border-[#2C3930]"
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{badge.icon}</span>
                  <div>
                    <div className="font-medium text-sm">{badge.name}</div>
                    <div className="text-xs text-gray-600">
                      {badge.description}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Preferences */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Star className="w-5 h-5 text-orange-500" />
          <span className="font-semibold text-gray-800">Preferences</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Enable Animations</span>
            <Badge
              className={
                userProfile.preferences?.enableAnimations
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }
            >
              {userProfile.preferences?.enableAnimations ? "On" : "Off"}
            </Badge>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm font-medium">Difficulty Preference</span>
            <Badge className="bg-blue-100 text-blue-800">
              {userProfile.preferences?.difficultyPreference || "Medium"}
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
