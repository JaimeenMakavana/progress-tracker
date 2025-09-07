"use client";
import React, { useState } from "react";
import {
  CheckCircle,
  Circle,
  Clock,
  Star,
  MoreVertical,
  Edit,
  Trash2,
  Archive,
  Flame,
  BookOpen,
  Target,
  Zap,
} from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Todo, TodoReflection } from "../../types";
import { TodoReflectionModal } from "./TodoReflectionModal";
import { motion, AnimatePresence } from "framer-motion";

interface TodoCardProps {
  todo: Todo;
  onComplete: (id: string, reflection?: TodoReflection) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

const typeIcons = {
  checklist: CheckCircle,
  learning_term: BookOpen,
  project_milestone: Target,
  daily_habit: Flame,
  quick_action: Zap,
};

const priorityColors = {
  low: "bg-gray-100 text-gray-700",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-red-100 text-red-700",
};

export function TodoCard({
  todo,
  onComplete,
  onUpdate,
  onDelete,
  onArchive,
}: TodoCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const TypeIcon = typeIcons[todo.type];

  const handleComplete = async () => {
    setIsCompleting(true);

    // Add a small delay for animation
    setTimeout(() => {
      onComplete(todo.id);
      setIsCompleting(false);
    }, 300);
  };

  const handleCompleteWithReflection = () => {
    setShowReflection(true);
  };

  const handleReflectionSubmit = (reflection: TodoReflection) => {
    onComplete(todo.id, reflection);
    setShowReflection(false);
  };

  const formatTime = (minutes?: number) => {
    if (!minutes) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      work: "bg-blue-100 text-blue-700",
      learning: "bg-green-100 text-green-700",
      personal: "bg-yellow-100 text-yellow-700",
      health: "bg-red-100 text-red-700",
      creative: "bg-purple-100 text-purple-700",
    };
    return (
      colors[category as keyof typeof colors] || "bg-gray-100 text-gray-700"
    );
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.2 }}
        className="relative"
      >
        <Card
          className={`p-4 transition-all duration-200 hover:shadow-md ${
            todo.status === "completed" ? "opacity-75 bg-green-50" : ""
          } ${isCompleting ? "scale-95" : ""}`}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-2 flex-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={todo.status === "pending" ? handleComplete : undefined}
                disabled={todo.status === "completed"}
                className="flex-shrink-0"
              >
                {todo.status === "completed" ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-gray-400 hover:text-green-500 transition-colors" />
                )}
              </motion.button>

              <div className="flex-1 min-w-0">
                <h3
                  className={`font-medium text-sm ${
                    todo.status === "completed"
                      ? "line-through text-gray-500"
                      : "text-gray-900"
                  }`}
                >
                  {todo.title}
                </h3>
                {todo.description && (
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                    {todo.description}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Badge
                variant="secondary"
                className={`text-xs ${priorityColors[todo.priority]}`}
              >
                {todo.priority}
              </Badge>

              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowMenu(!showMenu)}
                  className="h-6 w-6 p-0"
                >
                  <MoreVertical className="w-4 h-4" />
                </Button>

                <AnimatePresence>
                  {showMenu && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="absolute right-0 top-8 bg-white border border-gray-200 rounded-md shadow-lg z-10 min-w-[120px]"
                    >
                      <div className="py-1">
                        {todo.status === "pending" && (
                          <>
                            <button
                              onClick={() => {
                                onUpdate(todo.id, {});
                                setShowMenu(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit
                            </button>
                            <button
                              onClick={() => {
                                handleCompleteWithReflection();
                                setShowMenu(false);
                              }}
                              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            >
                              <Star className="w-4 h-4 mr-2" />
                              Complete with Reflection
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => {
                            onArchive(todo.id);
                            setShowMenu(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <Archive className="w-4 h-4 mr-2" />
                          Archive
                        </button>
                        <button
                          onClick={() => {
                            onDelete(todo.id);
                            setShowMenu(false);
                          }}
                          className="flex items-center w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Type and Category */}
          <div className="flex items-center space-x-2 mb-3">
            <Badge
              variant="outline"
              className="text-xs flex items-center space-x-1"
            >
              <TypeIcon className="w-3 h-3" />
              <span>{todo.type.replace("_", " ")}</span>
            </Badge>

            <Badge
              variant="secondary"
              className={`text-xs ${getCategoryColor(todo.category)}`}
            >
              {todo.category}
            </Badge>
          </div>

          {/* Tags */}
          {todo.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-3">
              {todo.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  #{tag}
                </Badge>
              ))}
              {todo.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{todo.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {todo.estimatedTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatTime(todo.estimatedTime)}</span>
                </div>
              )}

              {todo.streakCount && todo.streakCount > 0 && (
                <div className="flex items-center space-x-1 text-orange-600">
                  <Flame className="w-3 h-3" />
                  <span>{todo.streakCount}</span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1 text-blue-600">
              <Star className="w-3 h-3" />
              <span>{todo.xpValue} XP</span>
            </div>
          </div>

          {/* Completion Animation Overlay */}
          <AnimatePresence>
            {isCompleting && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-green-100 bg-opacity-50 rounded-lg flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                >
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </motion.div>

      {/* Reflection Modal */}
      <TodoReflectionModal
        isOpen={showReflection}
        onClose={() => setShowReflection(false)}
        onSubmit={handleReflectionSubmit}
        todo={todo}
      />
    </>
  );
}
