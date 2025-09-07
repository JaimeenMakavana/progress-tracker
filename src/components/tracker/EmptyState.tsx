import React from "react";
import { Plus, BarChart3 } from "lucide-react";

interface EmptyStateProps {
  onCreateTracker: () => void;
}

export function EmptyState({ onCreateTracker }: EmptyStateProps) {
  return (
    <div className="text-center py-20">
      <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-primary/10 to-primary/20 rounded-3xl flex items-center justify-center backdrop-blur-sm">
        <BarChart3 className="w-10 h-10 text-[#2C3930]" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">No trackers yet</h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
        Create your first tracker to start organizing your progress and
        achieving your goals
      </p>
      <button
        onClick={onCreateTracker}
        className="flex items-center gap-2 px-6 py-3 bg-[#2C3930] text-white rounded-2xl hover:bg-[#2C3930]/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium mx-auto"
      >
        <Plus className="w-4 h-4" />
        Create Your First Tracker
      </button>
    </div>
  );
}
