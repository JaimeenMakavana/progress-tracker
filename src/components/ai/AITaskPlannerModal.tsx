"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTaskPlanner } from "../../hooks/useTaskPlanner";
import { useCostTracking } from "../../hooks/useCostTracking";
import { useTrackers } from "../../context/TrackersContext";
import { TaskBreakdown, UserContext } from "../../types/ai";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../ui/alert";
import {
  Bot,
  Clock,
  Target,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
  Sparkles,
  Zap,
} from "lucide-react";

interface AITaskPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTasksCreated?: (trackerId: string) => void;
}

export function AITaskPlannerModal({
  isOpen,
  onClose,
  onTasksCreated,
}: AITaskPlannerModalProps) {
  const { breakDownGoal, isLoading, error } = useTaskPlanner();
  const {
    costTracker,
    trackRequest,
    isWithinLimits,
    getRemainingRequests,
    getCostEstimate,
  } = useCostTracking();
  const { createTracker } = useTrackers();

  const [goal, setGoal] = useState("");
  const [generatedBreakdown, setGeneratedBreakdown] =
    useState<TaskBreakdown | null>(null);
  const [userContext, setUserContext] = useState<UserContext>({
    experienceLevel: "intermediate",
    availableTime: 2,
    preferredDifficulty: "medium",
    learningStyle: "hands-on",
    currentSkills: ["javascript", "react"],
  });

  const remainingRequests = getRemainingRequests();

  const handleGenerateTasks = async () => {
    if (!goal.trim() || !isWithinLimits) return;

    try {
      // Estimate cost before making the request
      const estimatedCost = getCostEstimate("gemini", goal.length, 1000);

      const breakdown = await breakDownGoal(goal, userContext);
      setGeneratedBreakdown(breakdown);

      // Track the cost
      trackRequest("gemini", estimatedCost);
    } catch (error) {
      console.error("Failed to generate tasks:", error);
    }
  };

  const handleCreateTracker = async () => {
    if (!generatedBreakdown) return;

    try {
      // Convert AI tasks to ImportTaskData format
      const initialTasks = generatedBreakdown.tasks.map((taskData) => ({
        title: taskData.title,
        description: taskData.description,
        effort: taskData.effort,
        tags: taskData.tags,
        execution: taskData.execution,
        status: "todo" as const,
      }));

      // Create tracker with tasks in one atomic operation
      const trackerId = createTracker({
        title: goal,
        description: generatedBreakdown.description,
        initialTasks,
      });

      // Notify parent component
      onTasksCreated?.(trackerId);

      // Reset form
      setGoal("");
      setGeneratedBreakdown(null);
      onClose();
    } catch (error) {
      console.error("Failed to create tracker:", error);
    }
  };

  const handleClose = () => {
    setGoal("");
    setGeneratedBreakdown(null);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" />
            AI Task Planner
          </DialogTitle>
          <DialogDescription>
            Describe your goal and I&apos;ll break it down into actionable tasks
            using AI
          </DialogDescription>
        </DialogHeader>

        {/* Cost Tracker */}
        <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">AI Usage</span>
            </div>
            <Badge
              className="text-white"
              variant={isWithinLimits ? "default" : "destructive"}
            >
              {isWithinLimits ? "Within Limits" : "Limit Exceeded"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <div className="text-gray-600">Daily Requests</div>
              <div className="font-medium">{costTracker.dailyRequests}/50</div>
            </div>
            <div>
              <div className="text-gray-600">Daily Cost</div>
              <div className="font-medium">
                ${costTracker.dailyCost.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Monthly Cost</div>
              <div className="font-medium">
                ${costTracker.monthlyCost.toFixed(3)}
              </div>
            </div>
            <div>
              <div className="text-gray-600">Remaining</div>
              <div className="font-medium">
                {remainingRequests.daily} requests
              </div>
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(
                  (costTracker.dailyRequests / 50) * 100,
                  100
                )}%`,
              }}
            />
          </div>
        </div>

        {!isWithinLimits && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Daily Limit Reached</AlertTitle>
            <AlertDescription>
              You&apos;ve reached your daily AI request limit. Try again
              tomorrow or upgrade for more requests.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-6">
          {/* Goal Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              What do you want to achieve?
            </label>
            <Textarea
              placeholder="I want to learn React and build a portfolio website..."
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              rows={3}
              disabled={!isWithinLimits}
              className="resize-none"
            />
          </div>

          {/* User Context */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Experience Level</label>
              <select
                value={userContext.experienceLevel}
                onChange={(e) =>
                  setUserContext((prev) => ({
                    ...prev,
                    experienceLevel: e.target
                      .value as UserContext["experienceLevel"],
                  }))
                }
                className="w-full p-2 border rounded-md"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Available Time (hours/day)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={userContext.availableTime}
                onChange={(e) =>
                  setUserContext((prev) => ({
                    ...prev,
                    availableTime: parseInt(e.target.value) || 2,
                  }))
                }
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={handleGenerateTasks}
            disabled={!goal.trim() || isLoading || !isWithinLimits}
            className="w-full"
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating Tasks...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Tasks with AI
              </>
            )}
          </Button>

          {/* Error Display */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Generated Tasks */}
          <AnimatePresence>
            {generatedBreakdown && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-4"
              >
                <div className="flex items-center gap-2 p-4 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h3 className="font-medium text-green-900">
                      Tasks Generated Successfully!
                    </h3>
                    <p className="text-sm text-green-700">
                      {generatedBreakdown.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                    <Clock className="w-4 h-4 text-blue-600" />
                    <div>
                      <div className="text-sm text-blue-600">Total Time</div>
                      <div className="font-medium">
                        {generatedBreakdown.estimatedTotalTime}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
                    <Target className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="text-sm text-purple-600">Difficulty</div>
                      <div className="font-medium capitalize">
                        {generatedBreakdown.difficulty}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
                    <TrendingUp className="w-4 h-4 text-orange-600" />
                    <div>
                      <div className="text-sm text-orange-600">Tasks</div>
                      <div className="font-medium">
                        {generatedBreakdown.tasks.length} tasks
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Generated Tasks:</h4>
                  {generatedBreakdown.tasks.map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h5 className="font-medium">{task.title}</h5>
                        <div className="flex gap-2">
                          <Badge variant="secondary">
                            Effort: {task.effort}/5
                          </Badge>
                          <Badge variant="outline">{task.estimatedTime}</Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">
                        {task.description}
                      </p>

                      <div className="space-y-2">
                        <div>
                          <span className="text-xs font-medium text-gray-500">
                            Execution:
                          </span>
                          <p className="text-sm">{task.execution}</p>
                        </div>

                        {task.prerequisites.length > 0 && (
                          <div>
                            <span className="text-xs font-medium text-gray-500">
                              Prerequisites:
                            </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {task.prerequisites.map((prereq, i) => (
                                <Badge
                                  key={i}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {prereq}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex flex-wrap gap-1">
                          {task.tags.map((tag, i) => (
                            <Badge
                              key={i}
                              variant="secondary"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="flex gap-3 pt-4">
                  <Button
                    onClick={handleCreateTracker}
                    className="flex-1"
                    size="lg"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Tracker with Tasks
                  </Button>
                  <Button onClick={handleClose} variant="outline" size="lg">
                    Cancel
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
