"use client";
import React from "react";
import { Trophy, Lock, CheckCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { TodoAchievement } from "../../types";
import { motion } from "framer-motion";

interface TodoAchievementsProps {
  achievements: TodoAchievement[];
}

export function TodoAchievements({ achievements }: TodoAchievementsProps) {
  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);

  if (achievements.length === 0) return null;

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Achievements</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Unlocked Achievements */}
        {unlockedAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                    <Trophy className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="text-sm font-semibold text-yellow-900">
                      {achievement.name}
                    </h3>
                    <CheckCircle className="w-4 h-4 text-yellow-600" />
                  </div>
                  <p className="text-xs text-yellow-700 mb-2">
                    {achievement.description}
                  </p>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">
                      {achievement.reward.xp} XP
                    </Badge>
                    {achievement.reward.badge && (
                      <Badge variant="outline" className="text-xs">
                        {achievement.reward.badge}
                      </Badge>
                    )}
                  </div>
                  {achievement.unlockedAt && (
                    <p className="text-xs text-yellow-600 mt-1">
                      Unlocked{" "}
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Locked Achievements */}
        {lockedAchievements.map((achievement) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-4 bg-gray-50 border-gray-200 opacity-75">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                    <Lock className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-600 mb-1">
                    {achievement.name}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progress</span>
                      <span>{Math.round(achievement.progress || 0)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gray-400 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${achievement.progress || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Badge
                      variant="secondary"
                      className="text-xs bg-gray-200 text-gray-600"
                    >
                      {achievement.reward.xp} XP
                    </Badge>
                    {achievement.reward.badge && (
                      <Badge
                        variant="outline"
                        className="text-xs border-gray-300 text-gray-500"
                      >
                        {achievement.reward.badge}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Achievement Summary */}
      <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">
              Achievement Progress
            </h3>
            <p className="text-sm text-gray-600">
              {unlockedAchievements.length} of {achievements.length}{" "}
              achievements unlocked
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(
                (unlockedAchievements.length / achievements.length) * 100
              )}
              %
            </div>
            <div className="text-xs text-gray-500">Complete</div>
          </div>
        </div>

        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                (unlockedAchievements.length / achievements.length) * 100
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
