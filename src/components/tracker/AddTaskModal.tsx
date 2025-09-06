import React from "react";
import { motion } from "framer-motion";

interface AddTaskModalProps {
  isOpen: boolean;
  title: string;
  effort: number;
  tags: string;
  onTitleChange: (title: string) => void;
  onEffortChange: (effort: number) => void;
  onTagsChange: (tags: string) => void;
  onAddTask: () => void;
  onClose: () => void;
}

export function AddTaskModal({
  isOpen,
  title,
  effort,
  tags,
  onTitleChange,
  onEffortChange,
  onTagsChange,
  onAddTask,
  onClose,
}: AddTaskModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-lg p-6 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
      >
        <h2 className="text-xl font-bold text-black mb-4">Add New Task</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., Learn React Hooks"
              autoFocus
              aria-label="Task title"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Effort (1-10)
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={effort}
              onChange={(e) => onEffortChange(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              aria-label="Task effort level"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => onTagsChange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g., react, frontend, learning"
              aria-label="Task tags"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onAddTask}
            className="flex-1 btn-primary"
            aria-label="Add task"
          >
            Add Task
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            aria-label="Cancel adding task"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
