import React from "react";
import { motion } from "framer-motion";
import { TrackerFormData } from "../../hooks/useTrackerOperations";

interface CreateTrackerModalProps {
  isOpen: boolean;
  formData: TrackerFormData;
  onFormChange: (field: keyof TrackerFormData, value: string) => void;
  onCreateTracker: () => void;
  onClose: () => void;
}

export function CreateTrackerModal({
  isOpen,
  formData,
  onFormChange,
  onCreateTracker,
  onClose,
}: CreateTrackerModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Create New Tracker
          </h3>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tracker Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => onFormChange("title", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-lg"
              placeholder="What are you tracking?"
              autoFocus
              aria-label="Tracker title"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => onFormChange("description", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
              placeholder="Add context about your goals..."
              rows={4}
              aria-label="Tracker description"
            />
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onCreateTracker}
            className="flex-1 btn-primary py-4 text-lg font-semibold"
          >
            Create Tracker
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors text-lg font-medium"
          >
            Cancel
          </button>
        </div>
      </motion.div>
    </div>
  );
}
