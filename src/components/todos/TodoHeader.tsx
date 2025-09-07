"use client";
import React from "react";
import { CheckCircle, Flame, Star, Target } from "lucide-react";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";

interface TodoHeaderProps {
  totalTodos: number;
  completedToday: number;
  currentStreak: number;
  totalXP: number;
}

export function TodoHeader({
  totalTodos,
  completedToday,
  currentStreak,
  totalXP,
}: TodoHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Todos</h1>
          <p className="text-gray-600">
            Quick actions and daily tasks to boost productivity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary" className="text-sm">
            <Star className="w-4 h-4 mr-1" />
            {totalXP} XP
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-600">Total Todos</p>
              <p className="text-2xl font-bold text-blue-900">{totalTodos}</p>
            </div>
            <Target className="w-8 h-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-green-600">
                Completed Today
              </p>
              <p className="text-2xl font-bold text-green-900">
                {completedToday}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-orange-600">
                Current Streak
              </p>
              <p className="text-2xl font-bold text-orange-900">
                {currentStreak} days
              </p>
            </div>
            <Flame className="w-8 h-8 text-orange-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-purple-600">Total XP</p>
              <p className="text-2xl font-bold text-purple-900">{totalXP}</p>
            </div>
            <Star className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>
    </div>
  );
}
