"use client";
import React from "react";

interface NoteDrawerProps {
  isOpen: boolean;
  taskTitle: string;
  noteType: "reflection" | "snippet" | "link";
  newNote: string;
  onClose: () => void;
  onNoteTypeChange: (type: "reflection" | "snippet" | "link") => void;
  onNoteChange: (note: string) => void;
  onSave: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export default function NoteDrawer({
  isOpen,
  taskTitle,
  noteType,
  newNote,
  onClose,
  onNoteTypeChange,
  onNoteChange,
  onSave,
  onKeyDown,
}: NoteDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="flex-1 bg-black bg-opacity-50" onClick={onClose} />

      {/* Drawer */}
      <div className="w-full sm:w-2/5 bg-white shadow-2xl flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900">
            Add Note to &quot;{taskTitle}&quot;
          </h3>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-black transition-colors rounded-lg hover:bg-gray-100"
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

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Note Type
              </label>
              <select
                value={noteType}
                onChange={(e) =>
                  onNoteTypeChange(
                    e.target.value as "reflection" | "snippet" | "link"
                  )
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base"
              >
                <option value="reflection">Reflection</option>
                <option value="snippet">Code Snippet</option>
                <option value="link">Link/Resource</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Note Content
              </label>
              <textarea
                value={newNote}
                onChange={(e) => onNoteChange(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-base resize-none"
                placeholder="Enter your note here..."
                rows={12}
                autoFocus
              />
              <p className="text-sm text-gray-500 mt-2">
                Press Ctrl+Enter to save, Esc to cancel
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-3">
            <button
              onClick={onSave}
              className="flex-1 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              Add Note
            </button>
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
