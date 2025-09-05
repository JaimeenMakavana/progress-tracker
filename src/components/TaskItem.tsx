"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Task } from "../types";

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string, note?: string) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete,
}: TaskItemProps) {
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [note, setNote] = useState("");

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

  const statusColors = {
    todo: "bg-gray-100 text-gray-800",
    inprogress: "bg-gray-200 text-gray-800",
    done: "bg-black text-white",
  };

  const statusIcons = {
    todo: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    inprogress: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    done: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 13l4 4L19 7"
        />
      </svg>
    ),
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
              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  statusColors[task.status]
                }`}
              >
                {task.status}
              </span>
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
                <button
                  onClick={handleToggle}
                  className="px-3 py-1 bg-black text-white text-sm rounded hover:bg-gray-800"
                >
                  Complete
                </button>
                <button
                  onClick={() => {
                    setShowNoteInput(false);
                    setNote("");
                  }}
                  className="px-3 py-1 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                >
                  Cancel
                </button>
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
          <button
            onClick={() => onEdit(task.id)}
            className="p-1 text-gray-400 hover:text-black transition-colors"
            title="Edit task"
          >
            <svg
              className="w-4 h-4"
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
          <button
            onClick={() => onDelete(task.id)}
            className="p-1 text-gray-400 hover:text-black transition-colors"
            title="Delete task"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
