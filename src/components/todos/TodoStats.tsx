"use client";
import React from "react";
import { Card } from "../ui/card";
import ProgressRing from "../ui/ProgressRing";
import { TodoStats as TodoStatsType } from "../../types";

interface TodoStatsProps {
  stats: TodoStatsType;
}

export function TodoStats({ stats }: TodoStatsProps) {
  const completionRate =
    stats.totalTodos > 0 ? (stats.completedTodos / stats.totalTodos) * 100 : 0;

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Progress Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Completion Rate */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Completion Rate
            </h3>
            <span className="text-2xl font-bold text-blue-600">
              {Math.round(completionRate)}%
            </span>
          </div>
          <ProgressRing
            progress={completionRate}
            size={80}
            strokeWidth={6}
            className="mx-auto"
          />
          <p className="text-sm text-gray-600 text-center mt-2">
            {stats.completedTodos} of {stats.totalTodos} todos completed
          </p>
        </Card>

        {/* Category Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Category Progress
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.categoryBreakdown).map(
              ([category, count]) => (
                <div
                  key={category}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-gray-700 capitalize">
                    {category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{
                          width: `${(count / stats.completedTodos) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm text-gray-600 w-8">{count}</span>
                  </div>
                </div>
              )
            )}
          </div>
        </Card>

        {/* Type Breakdown */}
        <Card className="p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Type Distribution
          </h3>
          <div className="space-y-3">
            {Object.entries(stats.typeBreakdown).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700 capitalize">
                  {type.replace("_", " ")}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${(count / stats.completedTodos) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Weekly Progress Chart */}
      {stats.weeklyProgress.length > 0 && (
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            Weekly Progress
          </h3>
          <div className="flex items-end space-x-2 h-32">
            {stats.weeklyProgress.slice(-8).map((week) => {
              const maxTodos = Math.max(
                ...stats.weeklyProgress.map((w) => w.todosCompleted)
              );
              const height =
                maxTodos > 0 ? (week.todosCompleted / maxTodos) * 100 : 0;

              return (
                <div
                  key={week.week}
                  className="flex-1 flex flex-col items-center"
                >
                  <div
                    className="w-full bg-blue-500 rounded-t"
                    style={{ height: `${height}%` }}
                    title={`Week ${week.week}: ${week.todosCompleted} todos, ${week.xpEarned} XP`}
                  />
                  <span className="text-xs text-gray-500 mt-2">
                    W{week.week.split("-")[1]}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}
