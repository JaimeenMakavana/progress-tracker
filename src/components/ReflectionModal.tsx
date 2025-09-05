"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task, Note } from "../types";

interface ReflectionModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (reflection: ReflectionData) => void;
}

interface ReflectionData {
  explanation: string;
  codeSnippet: string;
  surprise: string;
}

export default function ReflectionModal({
  task,
  isOpen,
  onClose,
  onSave,
}: ReflectionModalProps) {
  const [reflection, setReflection] = useState<ReflectionData>({
    explanation: "",
    codeSnippet: "",
    surprise: "",
  });

  const handleSubmit = () => {
    if (reflection.explanation.trim()) {
      onSave(reflection);
      setReflection({ explanation: "", codeSnippet: "", surprise: "" });
      onClose();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onKeyDown={handleKeyDown}
        >
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-black">
                  Task Completed!
                </h2>
                <p className="text-sm text-gray-600 mt-1">{task.title}</p>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-black transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Task Context */}
            {task.execution && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-black mb-2">What you did:</h3>
                <p className="text-sm text-gray-700">{task.execution}</p>
              </div>
            )}

            {task.mindset && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-black mb-2">Mindset:</h3>
                <p className="text-sm text-gray-700 italic">"{task.mindset}"</p>
              </div>
            )}

            {/* Reflection Prompts */}
            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  One-sentence explanation
                </label>
                <textarea
                  value={reflection.explanation}
                  onChange={(e) =>
                    setReflection((prev) => ({
                      ...prev,
                      explanation: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="How would you explain what you learned to someone else?"
                  rows={2}
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Code snippet or key concept
                </label>
                <textarea
                  value={reflection.codeSnippet}
                  onChange={(e) =>
                    setReflection((prev) => ({
                      ...prev,
                      codeSnippet: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black font-mono text-sm"
                  placeholder="Paste important code, formulas, or concepts here"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What surprised you?
                </label>
                <textarea
                  value={reflection.surprise}
                  onChange={(e) =>
                    setReflection((prev) => ({
                      ...prev,
                      surprise: e.target.value,
                    }))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Unexpected insights, challenges, or connections?"
                  rows={2}
                />
              </div>
            </div>

            {/* Pre-written Reflection Prompts */}
            {task.reflectionPrompts && task.reflectionPrompts.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-black mb-3">
                  Additional prompts:
                </h3>
                <div className="space-y-2">
                  {task.reflectionPrompts.map((prompt) => (
                    <div key={prompt} className="p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">{prompt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={!reflection.explanation.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Reflection
              </button>
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Skip
              </button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              <p>
                Press{" "}
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                  Ctrl+Enter
                </kbd>{" "}
                to save,{" "}
                <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">
                  Esc
                </kbd>{" "}
                to close
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
