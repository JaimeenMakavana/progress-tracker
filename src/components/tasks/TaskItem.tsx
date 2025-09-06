"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Task } from "../../types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { FileText, Edit, Trash2, Clock, CheckCircle } from "lucide-react";
import { ProgressRing } from "../ui";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, note?: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onOpenNoteDrawer: (taskId: string) => void;
  onOpenTaskPage: (taskId: string) => void;
  // v2 Gamification props
  // streakCount?: number;
  // totalTasksCompleted?: number;
  showProgressRing?: boolean;
}

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
  onOpenNoteDrawer,
  onOpenTaskPage,
  // streakCount = 0,
  // totalTasksCompleted = 0,
  showProgressRing = true,
}: TaskItemProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");

  const statusIcons = {
    done: <CheckCircle className="w-4 h-4" />,
  };

  const handleToggle = () => {
    if (task.status === "todo" && !showNoteInput) {
      setShowNoteInput(true);
      return;
    }

    onToggle(task.id, note);
    setNote("");
    setShowNoteInput(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleToggle();
    } else if (e.key === "Escape") {
      setShowNoteInput(false);
      setNote("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "todo":
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            To Do
          </Badge>
        );
      case "inprogress":
        return (
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            In Progress
          </Badge>
        );
      case "done":
        return (
          <Badge variant="default" className="flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            Done
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <motion.div
      className={`p-3 sm:p-4 lg:p-6 border rounded-xl sm:rounded-2xl transition-all hover:shadow-md ${
        task.status === "done" ? "bg-gray-50/50 border-gray-300" : "bg-white"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
        {/* Left Section - Checkbox and Progress */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 flex items-center justify-center transition-all ${
              task.status === "done"
                ? "bg-[#2C3930] border-[#2C3930] text-white"
                : "border-gray-300 hover:border-[#2C3930]"
            }`}
          >
            {task.status === "done" && statusIcons.done}
          </button>

          {/* Progress Ring */}
          {showProgressRing && task.status !== "done" && (
            <ProgressRing
              progress={0}
              size="sm"
              showAnimation={false}
              className="opacity-50"
            />
          )}

          {showProgressRing && task.status === "done" && (
            <ProgressRing
              progress={100}
              size="sm"
              showAnimation={true}
              showReward={true}
              rewardType="streak_bonus"
            />
          )}
        </div>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h4
                className={`font-semibold text-base sm:text-lg lg:text-xl leading-tight ${
                  task.status === "done"
                    ? "line-through text-gray-500"
                    : "text-black"
                }`}
              >
                {task.title}
              </h4>
              {task.desc && (
                <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2 leading-relaxed">
                  {task.desc}
                </p>
              )}
            </div>

            {/* Status and Effort - Mobile Layout */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 sm:ml-4">
              {getStatusBadge(task.status)}
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Effort: {task.effort}
              </span>
            </div>
          </div>

          {/* Tags Section */}
          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-3 sm:mt-4">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 sm:px-3 py-1 sm:py-1.5 text-xs sm:text-sm bg-[#2C3930] text-white rounded-full font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Note Input */}
          {showNoteInput && (
            <motion.div
              className="mt-3 sm:mt-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a completion note (optional)"
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-[#2C3930] rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#2C3930]/20"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row gap-2 mt-3">
                <Button
                  onClick={handleToggle}
                  size="sm"
                  className="px-4 py-2 bg-[#2C3930] hover:bg-[#2C3930]/90 text-white"
                >
                  Complete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNoteInput(false);
                    setNote("");
                  }}
                  className="px-4 py-2 border-2 border-[#2C3930] text-[#2C3930] hover:bg-[#2C3930] hover:text-white"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {/* Notes Section */}
          {task.notes.length > 0 && (
            <div className="mt-3 sm:mt-4 space-y-2">
              {task.notes.map((note) => (
                <div
                  key={`${note.at}-${note.text.slice(0, 20)}`}
                  className="text-xs sm:text-sm text-gray-600 bg-gray-50 p-2 sm:p-3 rounded-lg border border-gray-200"
                >
                  <span className="font-medium">
                    {new Date(note.at).toLocaleDateString()}:
                  </span>{" "}
                  {note.text}
                </div>
              ))}
            </div>
          )}

          {/* Completion Date */}
          {task.completedAt && (
            <p className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-3 font-medium">
              Completed: {new Date(task.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end sm:justify-start gap-1 sm:gap-2 mt-2 sm:mt-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenTaskPage(task.id)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-[#2C3930] transition-colors"
            title="Open page"
          >
            <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenNoteDrawer(task.id)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-[#2C3930] transition-colors"
            title="Add note"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task.id)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-[#2C3930] transition-colors"
            title="Edit task"
          >
            <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
