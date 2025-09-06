"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTrackers } from "../../context/TrackersContext";
import {
  shouldSuggestDifficultyAdjustment,
  getDifficultySuggestion,
} from "../../utils/gamification";
import { Button } from "../ui/button";
import {
  MessageCircle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

interface AICoachProps {
  trackerId: string;
  className?: string;
}

export default function AICoach({ trackerId, className = "" }: AICoachProps) {
  const { state } = useTrackers();
  const [isVisible, setIsVisible] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState<{
    type: "difficulty" | "motivation" | "celebration";
    message: string;
    action?: string;
  } | null>(null);

  const tracker = state.trackers[trackerId];
  const streakData = tracker?.streakData;
  const tasks = Object.values(tracker?.tasks || {});

  useEffect(() => {
    if (!tracker || !streakData) return;

    const recentMissedDays = streakData.currentStreak === 0 ? 1 : 0;
    const averageEffort =
      tasks.length > 0
        ? tasks.reduce((sum, task) => sum + task.effort, 0) / tasks.length
        : 0;

    // Check if user needs difficulty adjustment
    if (
      shouldSuggestDifficultyAdjustment(
        streakData.currentStreak,
        recentMissedDays,
        averageEffort
      )
    ) {
      const suggestion = getDifficultySuggestion(
        "medium", // Default difficulty
        recentMissedDays >= 3 ? "high" : "medium"
      );

      setCurrentSuggestion({
        type: "difficulty",
        message: suggestion.message,
        action: `Try ${suggestion.suggestedDifficulty} difficulty`,
      });
      setIsVisible(true);
    }
    // Check for celebration opportunities
    else if (
      streakData.currentStreak > 0 &&
      streakData.currentStreak % 7 === 0
    ) {
      setCurrentSuggestion({
        type: "celebration",
        message: `🎉 Amazing! You've maintained a ${streakData.currentStreak}-day streak! You're building incredible momentum!`,
        action: "Keep it up!",
      });
      setIsVisible(true);
    }
    // Check for motivation when struggling
    else if (streakData.currentStreak === 0 && tasks.length > 0) {
      setCurrentSuggestion({
        type: "motivation",
        message:
          "💪 Every expert was once a beginner. Small consistent actions lead to big results. Ready to start again?",
        action: "Start fresh",
      });
      setIsVisible(true);
    }
  }, [tracker, streakData, tasks]);

  const handleDismiss = () => {
    setIsVisible(false);
    setCurrentSuggestion(null);
  };

  const handleAction = () => {
    if (currentSuggestion?.type === "difficulty") {
      // In a real implementation, this would adjust task difficulty
      console.log("Adjusting difficulty...");
    }
    handleDismiss();
  };

  const getCoachIcon = (type: string) => {
    switch (type) {
      case "difficulty":
        return <TrendingDown className="w-5 h-5" />;
      case "motivation":
        return <MessageCircle className="w-5 h-5" />;
      case "celebration":
        return <TrendingUp className="w-5 h-5" />;
      default:
        return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getCoachColor = (type: string) => {
    switch (type) {
      case "difficulty":
        return "from-orange-400 to-red-500";
      case "motivation":
        return "from-blue-400 to-purple-500";
      case "celebration":
        return "from-green-400 to-blue-500";
      default:
        return "from-gray-400 to-gray-600";
    }
  };

  if (!isVisible || !currentSuggestion) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed bottom-4 right-4 z-40 max-w-sm ${className}`}
        initial={{ opacity: 0, y: 100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 100, scale: 0.8 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
      >
        <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-4">
          {/* Coach Avatar */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-full bg-gradient-to-r ${getCoachColor(
                currentSuggestion.type
              )} flex items-center justify-center text-white flex-shrink-0`}
            >
              {getCoachIcon(currentSuggestion.type)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-gray-800">AI Coach</span>
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {currentSuggestion.type}
                </span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {currentSuggestion.message}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={handleAction} size="sm" className="flex-1">
              {currentSuggestion.action}
            </Button>
            <Button onClick={handleDismiss} variant="outline" size="sm">
              Dismiss
            </Button>
          </div>

          {/* Coach Tips */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <div className="text-xs text-gray-500">
              💡 <strong>Tip:</strong> {getCoachTip(currentSuggestion.type)}
            </div>
          </div>
        </div>

        {/* Floating particles for engagement */}
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400 rounded-full"
              style={{
                left: `${20 + i * 30}%`,
                top: `${10 + i * 20}%`,
              }}
              animate={{
                y: [0, -10, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 1,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function getCoachTip(type: string): string {
  switch (type) {
    case "difficulty":
      return "Consistency beats intensity. Start small and build momentum!";
    case "motivation":
      return "Progress isn't linear. Every day is a new opportunity to grow!";
    case "celebration":
      return "Celebrate your wins! Positive reinforcement builds lasting habits!";
    default:
      return "You're doing great! Keep up the excellent work!";
  }
}
