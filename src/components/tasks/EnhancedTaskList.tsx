"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Tracker } from "../../types";
import { useTrackers } from "../../context/TrackersContext";
import TaskItem from "./TaskItem";
import {
  ReflectionModal,
  MicroRewardAnimation,
  CommitmentContractModal,
  CommitmentContractDisplay,
} from "../ui";
// import { calculateProgress } from "../../utils/progress";

interface EnhancedTaskListProps {
  tracker: Tracker;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNoteDrawer: (taskId: string) => void;
  onOpenTaskPage: (taskId: string) => void;
}

export default function EnhancedTaskList({
  tracker,
  onEditTask,
  onDeleteTask,
  onOpenNoteDrawer,
  onOpenTaskPage,
}: EnhancedTaskListProps) {
  const {
    toggleTaskCompleteWithReflection,
    createCommitmentContract,
    completeCommitmentContract,
    breakCommitmentContract,
  } = useTrackers();

  const [showReflectionModal, setShowReflectionModal] = useState(false);
  const [pendingTaskId, setPendingTaskId] = useState<string | null>(null);
  const [pendingTaskTitle, setPendingTaskTitle] = useState("");
  const [showRewardAnimation, setShowRewardAnimation] = useState(false);
  const [currentReward, setCurrentReward] = useState<{
    type:
      | "streak_bonus"
      | "effort_bonus"
      | "consistency_bonus"
      | "milestone_bonus";
    message: string;
    value: number;
  } | null>(null);
  const [showCommitmentModal, setShowCommitmentModal] = useState(false);
  const [commitmentTaskId, setCommitmentTaskId] = useState<string | null>(null);
  const [commitmentTaskTitle, setCommitmentTaskTitle] = useState("");

  // const progress = calculateProgress(tracker);
  // const streakCount = tracker.streakData?.currentStreak || 0;
  // const totalTasksCompleted = Object.values(tracker.tasks).filter(
  //   (t) => t.status === "done"
  // ).length;

  const handleTaskToggle = (taskId: string) => {
    const task = tracker.tasks[taskId];

    if (task.status === "todo") {
      // Show reflection modal for task completion
      setPendingTaskId(taskId);
      setPendingTaskTitle(task.title);
      setShowReflectionModal(true);
    } else {
      // Just toggle without reflection for reopening
      toggleTaskCompleteWithReflection(tracker.id, taskId);
    }
  };

  const handleReflection = (feeling: string, note?: string) => {
    if (pendingTaskId) {
      toggleTaskCompleteWithReflection(tracker.id, pendingTaskId, {
        feeling,
        note,
      });

      // Show reward animation
      const task = tracker.tasks[pendingTaskId];
      const microRewards = task.microRewards || [];
      if (microRewards.length > 0) {
        setCurrentReward(microRewards[microRewards.length - 1]);
        setShowRewardAnimation(true);
      }
    }

    setShowReflectionModal(false);
    setPendingTaskId(null);
    setPendingTaskTitle("");
  };

  const handleSkipReflection = () => {
    if (pendingTaskId) {
      toggleTaskCompleteWithReflection(tracker.id, pendingTaskId);
    }

    setShowReflectionModal(false);
    setPendingTaskId(null);
    setPendingTaskTitle("");
  };

  const handleRewardAnimationComplete = () => {
    setShowRewardAnimation(false);
    setCurrentReward(null);
  };

  const handleCreateCommitmentContract = (
    taskId: string,
    taskTitle: string
  ) => {
    setCommitmentTaskId(taskId);
    setCommitmentTaskTitle(taskTitle);
    setShowCommitmentModal(true);
  };

  const handleCommitmentContractCreated = (contract: {
    penalty?: string;
    reward?: string;
  }) => {
    if (commitmentTaskId) {
      createCommitmentContract(tracker.id, commitmentTaskId, contract);
    }
    setShowCommitmentModal(false);
    setCommitmentTaskId(null);
    setCommitmentTaskTitle("");
  };

  const handleCommitmentContractCancel = () => {
    setShowCommitmentModal(false);
    setCommitmentTaskId(null);
    setCommitmentTaskTitle("");
  };

  const handleCompleteContract = (taskId: string) => {
    completeCommitmentContract(tracker.id, taskId);
  };

  const handleBreakContract = (taskId: string) => {
    breakCommitmentContract(tracker.id, taskId);
  };

  const tasks = Object.values(tracker.tasks).sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="space-y-3">
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-2"
          >
            <TaskItem
              task={task}
              onToggle={handleTaskToggle}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onOpenNoteDrawer={onOpenNoteDrawer}
              onOpenTaskPage={onOpenTaskPage}
              showProgressRing={true}
            />

            {/* Commitment Contract Display */}
            {task.commitmentContract?.isActive && (
              <CommitmentContractDisplay
                contract={task.commitmentContract}
                onDeactivate={() =>
                  breakCommitmentContract(tracker.id, task.id)
                }
                onComplete={() => handleCompleteContract(task.id)}
                onBreak={() => handleBreakContract(task.id)}
              />
            )}

            {/* Add Commitment Contract Button for incomplete tasks */}
            {task.status !== "done" && !task.commitmentContract?.isActive && (
              <div className="ml-8">
                <button
                  onClick={() =>
                    handleCreateCommitmentContract(task.id, task.title)
                  }
                  className="text-xs text-purple-600 hover:text-purple-800 font-medium"
                >
                  + Add Commitment Contract
                </button>
              </div>
            )}
          </motion.div>
        ))}

        {tasks.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <p className="text-lg font-medium mb-2">No tasks yet</p>
            <p className="text-sm">Add your first task to get started!</p>
          </div>
        )}
      </div>

      {/* Reflection Modal */}
      <ReflectionModal
        isOpen={showReflectionModal}
        taskTitle={pendingTaskTitle}
        onReflect={handleReflection}
        onSkip={handleSkipReflection}
      />

      {/* Micro Reward Animation */}
      {showRewardAnimation && currentReward && (
        <MicroRewardAnimation
          reward={currentReward}
          onComplete={handleRewardAnimationComplete}
        />
      )}

      {/* Commitment Contract Modal */}
      <CommitmentContractModal
        isOpen={showCommitmentModal}
        taskTitle={commitmentTaskTitle}
        onCreateContract={handleCommitmentContractCreated}
        onCancel={handleCommitmentContractCancel}
      />
    </>
  );
}
