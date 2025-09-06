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
      className={`p-4 border rounded-lg transition-all ${
        task.status === "done"
          ? "bg-gray-50 border-gray-300"
          : "bg-white border-gray-200"
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={handleToggle}
            className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              task.status === "done"
                ? "bg-black border-black text-white"
                : "border-gray-300 hover:border-black"
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

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h4
                className={`font-medium ${
                  task.status === "done"
                    ? "line-through text-gray-500"
                    : "text-black"
                }`}
              >
                {task.title}
              </h4>
              {task.desc && (
                <p className="text-sm text-gray-600 mt-1">{task.desc}</p>
              )}
            </div>

            <div className="flex items-center gap-2 ml-4">
              {getStatusBadge(task.status)}
              <span className="text-xs text-gray-500">
                Effort: {task.effort}
              </span>
            </div>
          </div>

          {task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs bg-black text-white rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {showNoteInput && (
            <motion.div
              className="mt-3"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black"
                autoFocus
              />
              <div className="flex gap-2 mt-2">
                <Button onClick={handleToggle} size="sm" className="px-3 py-1">
                  Complete
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowNoteInput(false);
                    setNote("");
                  }}
                  className="px-3 py-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}

          {task.notes.length > 0 && (
            <div className="mt-3 space-y-1">
              {task.notes.map((note) => (
                <div
                  key={`${note.at}-${note.text.slice(0, 20)}`}
                  className="text-xs text-gray-600 bg-gray-50 p-2 rounded"
                >
                  <span className="font-medium">
                    {new Date(note.at).toLocaleDateString()}:
                  </span>{" "}
                  {note.text}
                </div>
              ))}
            </div>
          )}

          {task.completedAt && (
            <p className="text-xs text-gray-500 mt-2">
              Completed: {new Date(task.completedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenTaskPage(task.id)}
            className="p-1 text-gray-400 hover:text-black"
            title="Open page"
          >
            <FileText className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenNoteDrawer(task.id)}
            className="p-1 text-gray-400 hover:text-black"
            title="Add note"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(task.id)}
            className="p-1 text-gray-400 hover:text-black"
            title="Edit task"
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-black"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
