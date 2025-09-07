"use client";
import React from "react";
import { Plus, Target, CheckCircle } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

interface EmptyStateProps {
  onCreateTodo?: () => void;
}

export function EmptyState({ onCreateTodo }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center">
      <div className="max-w-md mx-auto">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="w-8 h-8 text-blue-600" />
        </div>

        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No todos yet
        </h3>
        <p className="text-gray-600 mb-6">
          Start building your productivity by creating your first todo. Whether
          it&apos;s a quick task, learning goal, or daily habit - every step
          counts!
        </p>

        <div className="space-y-4">
          <Button onClick={onCreateTodo} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Todo
          </Button>

          <div className="text-sm text-gray-500">
            <p className="mb-2">
              💡 <strong>Pro tip:</strong> Start with small, achievable tasks
            </p>
            <p>
              🎯 <strong>Types:</strong> Checklist, Learning Terms, Project
              Milestones, Daily Habits, Quick Actions
            </p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-3 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-1" />
            <p className="text-xs text-green-700 font-medium">Quick Wins</p>
          </div>
          <div className="p-3 bg-blue-50 rounded-lg">
            <Target className="w-6 h-6 text-blue-600 mx-auto mb-1" />
            <p className="text-xs text-blue-700 font-medium">Track Progress</p>
          </div>
          <div className="p-3 bg-purple-50 rounded-lg">
            <Plus className="w-6 h-6 text-purple-600 mx-auto mb-1" />
            <p className="text-xs text-purple-700 font-medium">Build Habits</p>
          </div>
        </div>
      </div>
    </Card>
  );
}
