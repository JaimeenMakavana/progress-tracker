"use client";

import React from "react";
import { Tracker, Task } from "../types";
import {
  calculateProgress,
  getNextTask,
  getRecentActivity,
} from "../utils/progress";
import ProgressBar from "./ProgressBar";

interface ProgressOverviewProps {
  tracker: Tracker;
}

export default function ProgressOverview({ tracker }: ProgressOverviewProps) {
  const progress = calculateProgress(tracker);
  const nextTask = getNextTask(tracker);
  const recentActivity = getRecentActivity(tracker, 5);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
      {/* Main Progress */}
      <div className="lg:col-span-2 minimal-card p-6">
        <h2 className="text-xl font-semibold text-black mb-4">
          Progress Overview
        </h2>
        <ProgressBar percent={progress.percent} size="lg" showLabel />
        <div className="grid grid-cols-2 gap-4 mt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-black">
              {progress.completed}
            </div>
            <div className="text-sm text-gray-600">Completed Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-black">
              {progress.total}
            </div>
            <div className="text-sm text-gray-600">Total Tasks</div>
          </div>
        </div>
      </div>

      {/* Next Task & Activity */}
      <div className="space-y-6">
        {/* Next Task */}
        {nextTask && (
          <div className="minimal-card p-6">
            <h3 className="text-lg font-semibold text-black mb-3">Next Task</h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium text-black mb-1">{nextTask.title}</h4>
              <p className="text-sm text-gray-700">Effort: {nextTask.effort}</p>
              {nextTask.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {nextTask.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 text-xs bg-black text-white rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Recent Activity */}
        <div className="minimal-card p-6">
          <h3 className="text-lg font-semibold text-black mb-3">
            Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-gray-500">No recent activity</p>
            ) : (
              recentActivity.map((activity) => (
                <div
                  key={`${activity.type}-${activity.at}-${
                    activity.taskId || "no-task"
                  }`}
                  className="flex items-center gap-3"
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "complete" ? "bg-black" : "bg-gray-400"
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-black">
                      {activity.type === "complete" ? "Completed" : "Opened"}{" "}
                      task
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(activity.at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
