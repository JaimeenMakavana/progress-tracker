"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Tracker } from "../../types";
import { SyncButton } from "../sync";
import { Button, Input } from "../ui";
import { ArrowLeft, Edit3, Plus, Download } from "lucide-react";

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
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 p-0 h-auto text-gray-600 hover:text-black"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </Button>

        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-black">{tracker.title}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={openEditTracker}
                className="text-gray-500 hover:text-black hover:bg-gray-100"
                title="Edit tracker name"
                aria-label="Edit tracker name"
              >
                <Edit3 className="w-5 h-5" />
              </Button>
            </div>
            {tracker.description && (
              <p className="text-gray-600 mb-4">{tracker.description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <SyncButton className="h-12" />
            <Button onClick={onAddTask} size="lg" className="h-12 px-6">
              <Plus className="w-5 h-5 mr-2" />
              Add Task
            </Button>
            <Button
              variant="outline"
              onClick={onImportTasks}
              size="lg"
              className="h-12 px-6 border-2 border-black text-black hover:bg-black hover:text-white"
            >
              <Download className="w-5 h-5 mr-2" />
              Import Tasks
            </Button>
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
                <Input
                  type="text"
                  value={editTrackerName}
                  onChange={(e) => setEditTrackerName(e.target.value)}
                  placeholder="Enter tracker name"
                  autoFocus
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleEditTracker}
                disabled={!editTrackerName.trim()}
                className="flex-1"
              >
                Save Changes
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditTracker(false);
                  setEditTrackerName("");
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
