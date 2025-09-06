import React from "react";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  onCreateTracker: () => void;
}

export function EmptyState({ onCreateTracker }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
        <svg
          className="w-10 h-10 text-primary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
          />
        </svg>
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No trackers yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
        Create your first tracker to start organizing your progress and
        achieving your goals
      </p>
      <button
        onClick={onCreateTracker}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium mx-auto"
      >
        <Plus className="w-4 h-4" />
        Create Your First Tracker
      </button>
    </div>
  );
}
