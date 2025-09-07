"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Task } from "../../types";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  FileText,
  Edit,
  Trash2,
  Clock,
  CheckCircle,
  MessageSquare,
  Lightbulb,
  Code,
  Link,
  Star,
  Zap,
} from "lucide-react";
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

  // Get note icon based on content type
  const getNoteIcon = (noteText: string) => {
    const text = noteText.toLowerCase();
    if (
      text.includes("code") ||
      text.includes("function") ||
      text.includes("import") ||
      text.includes("const") ||
      text.includes("let")
    ) {
      return <Code className="w-3 h-3" />;
    }
    if (
      text.includes("http") ||
      text.includes("www") ||
      text.includes("link") ||
      text.includes("url")
    ) {
      return <Link className="w-3 h-3" />;
    }
    if (
      text.includes("insight") ||
      text.includes("learned") ||
      text.includes("realized") ||
      text.includes("discovered")
    ) {
      return <Lightbulb className="w-3 h-3" />;
    }
    if (
      text.includes("important") ||
      text.includes("key") ||
      text.includes("critical") ||
      text.includes("essential")
    ) {
      return <Star className="w-3 h-3" />;
    }
    if (
      text.includes("breakthrough") ||
      text.includes("eureka") ||
      text.includes("aha") ||
      text.includes("got it")
    ) {
      return <Zap className="w-3 h-3" />;
    }
    return <MessageSquare className="w-3 h-3" />;
  };

  // Get note color based on content type
  const getNoteColor = (noteText: string) => {
    const text = noteText.toLowerCase();
    if (
      text.includes("code") ||
      text.includes("function") ||
      text.includes("import") ||
      text.includes("const") ||
      text.includes("let")
    ) {
      return "bg-purple-100 text-purple-700 border-purple-200";
    }
    if (
      text.includes("http") ||
      text.includes("www") ||
      text.includes("link") ||
      text.includes("url")
    ) {
      return "bg-blue-100 text-blue-700 border-blue-200";
    }
    if (
      text.includes("insight") ||
      text.includes("learned") ||
      text.includes("realized") ||
      text.includes("discovered")
    ) {
      return "bg-yellow-100 text-yellow-700 border-yellow-200";
    }
    if (
      text.includes("important") ||
      text.includes("key") ||
      text.includes("critical") ||
      text.includes("essential")
    ) {
      return "bg-orange-100 text-orange-700 border-orange-200";
    }
    if (
      text.includes("breakthrough") ||
      text.includes("eureka") ||
      text.includes("aha") ||
      text.includes("got it")
    ) {
      return "bg-green-100 text-green-700 border-green-200";
    }
    return "bg-gray-100 text-gray-700 border-gray-200";
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
      className={`p-3 sm:p-4 lg:p-6 border rounded-xl sm:rounded-2xl transition-all hover:shadow-md relative ${
        task.status === "done" ? "bg-gray-50/50 border-gray-300" : "bg-white"
      } ${
        task.notes.length > 0
          ? "border-l-4 border-l-blue-400 shadow-sm hover:shadow-lg"
          : ""
      }`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Knowledge indicator */}
      {task.notes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            delay: 0.2,
            type: "spring",
            stiffness: 200,
            damping: 10,
          }}
          className="absolute top-3 right-3 w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse"
        />
      )}
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
              <div className="flex items-center gap-2">
                <h4
                  className={`font-semibold text-base sm:text-lg lg:text-xl leading-tight ${
                    task.status === "done"
                      ? "line-through text-gray-500"
                      : "text-black"
                  }`}
                >
                  {task.title}
                </h4>
                {/* Note indicator */}
                {task.notes.length > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full border border-blue-200 shadow-sm"
                  >
                    <MessageSquare className="w-3 h-3 text-blue-600" />
                    <span className="text-xs font-medium text-blue-700">
                      {task.notes.length} insight
                      {task.notes.length > 1 ? "s" : ""}
                    </span>
                  </motion.div>
                )}
              </div>
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
              initial={{ opacity: 0, height: 0, y: -10 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lightbulb className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">
                    Capture your insights
                  </span>
                </div>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="What did you learn? Any insights, code snippets, or breakthroughs?"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-blue-300 rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-400/20 focus:border-blue-400 transition-all duration-200"
                  autoFocus
                />
                <div className="flex flex-col sm:flex-row gap-2 mt-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      onClick={handleToggle}
                      size="sm"
                      className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Complete & Save
                    </Button>
                  </motion.div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setShowNoteInput(false);
                      setNote("");
                    }}
                    className="px-4 py-2 border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Notes Section */}
          {task.notes.length > 0 && (
            <motion.div
              className="mt-3 sm:mt-4 space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-purple-500 rounded-full"></div>
                <span className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
                  Knowledge Captured
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
              </div>
              {task.notes.map((note, index) => (
                <motion.div
                  key={`${note.at}-${note.text.slice(0, 20)}`}
                  initial={{ opacity: 0, x: -20, scale: 0.95 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    type: "spring",
                    stiffness: 200,
                    damping: 15,
                  }}
                  className={`text-xs sm:text-sm p-3 sm:p-4 rounded-lg border-2 ${getNoteColor(
                    note.text
                  )} hover:shadow-md transition-all duration-200 cursor-pointer group`}
                  onClick={() => onOpenNoteDrawer(task.id)}
                >
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNoteIcon(note.text)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-xs">
                          {new Date(note.at).toLocaleDateString()}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-current opacity-50"></div>
                        <span className="text-xs opacity-75">
                          {new Date(note.at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="leading-relaxed group-hover:font-medium transition-all duration-200">
                        {note.text}
                      </p>
                    </div>
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Edit className="w-3 h-3" />
                    </div>
                  </div>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-center pt-2"
              >
                <button
                  onClick={() => onOpenNoteDrawer(task.id)}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 flex items-center gap-1 mx-auto"
                >
                  <MessageSquare className="w-3 h-3" />
                  Add more insights
                </button>
              </motion.div>
            </motion.div>
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
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenNoteDrawer(task.id)}
              className={`p-1.5 sm:p-2 transition-all duration-200 ${
                task.notes.length > 0
                  ? "text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 hover:border-blue-300"
                  : "text-gray-400 hover:text-[#2C3930] hover:bg-gray-100"
              }`}
              title={task.notes.length > 0 ? "View & add notes" : "Add note"}
            >
              <div className="relative">
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                {task.notes.length > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-white"
                  />
                )}
              </div>
            </Button>
          </motion.div>
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
