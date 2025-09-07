"use client";
import React, { useState } from "react";
import { X, Clock, Star } from "lucide-react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Todo, TodoReflection } from "../../types";
import { motion, AnimatePresence } from "framer-motion";

interface TodoReflectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (reflection: TodoReflection) => void;
  todo: Todo;
}

const feelings = [
  { emoji: "😌", label: "Relaxed", value: "😌" as const },
  { emoji: "💪", label: "Strong", value: "💪" as const },
  { emoji: "⚡", label: "Energized", value: "⚡" as const },
  { emoji: "😤", label: "Frustrated", value: "😤" as const },
  { emoji: "🎯", label: "Focused", value: "🎯" as const },
  { emoji: "🔥", label: "Motivated", value: "🔥" as const },
  { emoji: "💎", label: "Accomplished", value: "💎" as const },
  { emoji: "🏆", label: "Victorious", value: "🏆" as const },
];

export function TodoReflectionModal({
  isOpen,
  onClose,
  onSubmit,
  todo,
}: TodoReflectionModalProps) {
  const [selectedFeeling, setSelectedFeeling] =
    useState<TodoReflection["feeling"]>("😌");
  const [note, setNote] = useState("");
  const [timeSpent, setTimeSpent] = useState<number | undefined>(
    todo.estimatedTime
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const reflection: TodoReflection = {
      feeling: selectedFeeling,
      note: note.trim() || undefined,
      completedAt: new Date().toISOString(),
      timeSpent,
    };

    onSubmit(reflection);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-lg shadow-xl max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Complete Todo
              </h2>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            <div className="mb-4 p-3 bg-blue-50 rounded-lg">
              <h3 className="font-medium text-blue-900 mb-1">{todo.title}</h3>
              {todo.description && (
                <p className="text-sm text-blue-700">{todo.description}</p>
              )}
              <div className="flex items-center space-x-4 mt-2 text-xs text-blue-600">
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {todo.xpValue} XP
                </span>
                {todo.estimatedTime && (
                  <span className="flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {todo.estimatedTime}m estimated
                  </span>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Feeling Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  How do you feel about completing this?
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {feelings.map((feeling) => (
                    <button
                      key={feeling.value}
                      type="button"
                      onClick={() => setSelectedFeeling(feeling.value)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        selectedFeeling === feeling.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-2xl mb-1">{feeling.emoji}</div>
                      <div className="text-xs text-gray-600">
                        {feeling.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Spent */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Spent (minutes)
                </label>
                <Input
                  type="number"
                  value={timeSpent || ""}
                  onChange={(e) =>
                    setTimeSpent(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  placeholder="How long did it take?"
                  min="1"
                />
              </div>

              {/* Reflection Note */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reflection (optional)
                </label>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Any thoughts about this task? What did you learn?"
                  rows={3}
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button type="submit">Complete Todo</Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
