"use client";
import React from "react";
import { motion } from "framer-motion";
import { Challenge } from "../../types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Calendar, Target, Trophy, Users } from "lucide-react";

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: (challengeId: string) => void;
  onLeave: (challengeId: string) => void;
  isParticipating?: boolean;
  className?: string;
}

export default function ChallengeCard({
  challenge,
  onJoin,
  onLeave,
  isParticipating = false,
  className = "",
}: ChallengeCardProps) {
  const getChallengeIcon = (type: string) => {
    switch (type) {
      case "streak_sprint":
        return "🔥";
      case "effort_marathon":
        return "💪";
      case "consistency_challenge":
        return "⚡";
      default:
        return "🎯";
    }
  };

  const getChallengeColor = (type: string) => {
    switch (type) {
      case "streak_sprint":
        return "from-orange-400 to-red-500";
      case "effort_marathon":
        return "from-blue-400 to-purple-500";
      case "consistency_challenge":
        return "from-yellow-400 to-orange-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  const getProgressPercentage = () => {
    return Math.min((challenge.progress / challenge.target) * 100, 100);
  };

  const getDaysRemaining = () => {
    const endDate = new Date(challenge.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  const isExpired = getDaysRemaining() === 0;
  const isCompleted = challenge.progress >= challenge.target;

  return (
    <motion.div
      className={`bg-white rounded-xl border border-gray-200 p-6 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">{getChallengeIcon(challenge.type)}</div>
          <div>
            <h3 className="text-lg font-bold text-black">{challenge.name}</h3>
            <p className="text-sm text-gray-600">{challenge.description}</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          {isCompleted && (
            <Badge className="bg-green-100 text-green-800 border-green-200">
              <Trophy className="w-3 h-3 mr-1" />
              Completed
            </Badge>
          )}
          {isExpired && !isCompleted && (
            <Badge className="bg-red-100 text-red-800 border-red-200">
              Expired
            </Badge>
          )}
          {challenge.isActive && !isExpired && !isCompleted && (
            <Badge className="bg-blue-100 text-blue-800 border-blue-200">
              Active
            </Badge>
          )}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-700">Progress</span>
          <span className="text-sm text-gray-600">
            {challenge.progress} / {challenge.target}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className={`h-2 rounded-full bg-gradient-to-r ${getChallengeColor(
              challenge.type
            )}`}
            initial={{ width: 0 }}
            animate={{ width: `${getProgressPercentage()}%` }}
            transition={{ duration: 1, delay: 0.2 }}
          />
        </div>
        <div className="text-xs text-gray-500 mt-1">
          {Math.round(getProgressPercentage())}% complete
        </div>
      </div>

      {/* Challenge Details */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <div>
            <div className="text-xs text-gray-500">Duration</div>
            <div className="text-sm font-medium">{challenge.duration} days</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-gray-500" />
          <div>
            <div className="text-xs text-gray-500">Target</div>
            <div className="text-sm font-medium">{challenge.target}</div>
          </div>
        </div>
      </div>

      {/* Participants */}
      {challenge.participants && challenge.participants.length > 0 && (
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-4 h-4 text-gray-500" />
          <div>
            <div className="text-xs text-gray-500">Participants</div>
            <div className="text-sm font-medium">
              {challenge.participants.length} people
            </div>
          </div>
        </div>
      )}

      {/* Reward */}
      <div className="p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg mb-4">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-yellow-600" />
          <span className="text-sm font-medium text-yellow-800">Reward:</span>
        </div>
        <p className="text-sm text-yellow-700 mt-1">{challenge.reward}</p>
      </div>

      {/* Action Button */}
      <div className="flex gap-2">
        {isParticipating ? (
          <Button
            onClick={() => onLeave(challenge.id)}
            variant="outline"
            className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
          >
            Leave Challenge
          </Button>
        ) : (
          <Button
            onClick={() => onJoin(challenge.id)}
            disabled={isExpired || isCompleted}
            className="flex-1"
          >
            {isExpired ? "Challenge Ended" : "Join Challenge"}
          </Button>
        )}
      </div>

      {/* Time Remaining */}
      {challenge.isActive && !isExpired && (
        <div className="mt-3 text-center">
          <div className="text-xs text-gray-500">
            {getDaysRemaining()} days remaining
          </div>
        </div>
      )}
    </motion.div>
  );
}
