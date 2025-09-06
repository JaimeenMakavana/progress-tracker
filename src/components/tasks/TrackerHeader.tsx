"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tracker } from "../../types";
import { SyncButton } from "../sync";

interface TrackerHeaderProps {
  tracker: Tracker;
  onEditTracker: (title: string) => void;
  onAddTask: () => void;
  onImportTasks: () => void;
}

export default function TrackerHeader({
  tracker,
  onEditTracker,
  onAddTask,
  onImportTasks,
}: TrackerHeaderProps) {
  const router = useRouter();
  const [showEditTracker, setShowEditTracker] = useState(false);
  const [editTrackerName, setEditTrackerName] = useState("");

  const handleEditTracker = () => {
    if (editTrackerName.trim()) {
      onEditTracker(editTrackerName.trim());
      setShowEditTracker(false);
      setEditTrackerName("");
    }
  };

  const openEditTracker = () => {
    setEditTrackerName(tracker.title);
    setShowEditTracker(true);
  };

  return (
    <>
      <div className="mb-8">
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-gray-600 hover:text-black mb-4 transition-colors"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Dashboard
        </button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-black">{tracker.title}</h1>
              <button
                onClick={openEditTracker}
                className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                title="Edit tracker name"
                aria-label="Edit tracker name"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
            {tracker.description && (
              <p className="text-gray-600 mb-4">{tracker.description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3">
            <SyncButton />
            <button
              onClick={onAddTask}
              className="btn-primary flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
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
              Add Task
            </button>
            <button
              onClick={onImportTasks}
              className="px-6 py-3 border-2 border-black text-black rounded-lg hover:bg-black hover:text-white transition-all duration-300 flex items-center gap-2 whitespace-nowrap bg-white"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"
                />
              </svg>
              Import Tasks
            </button>
          </div>
        </div>
      </div>

      {/* Edit Tracker Modal */}
      {showEditTracker && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-lg p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
          >
            <h2 className="text-xl font-bold text-black mb-4">
              Edit Tracker Name
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tracker Name
                </label>
                <input
                  type="text"
                  value={editTrackerName}
                  onChange={(e) => setEditTrackerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  placeholder="Enter tracker name"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={handleEditTracker}
                disabled={!editTrackerName.trim()}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setShowEditTracker(false);
                  setEditTrackerName("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
