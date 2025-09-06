import React from "react";
import { ViewMode } from "../../hooks/useTrackerOperations";

interface ViewControlsProps {
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenGroupManager: () => void;
  resultCount: number;
  hasSearchQuery: boolean;
}

export function ViewControls({
  viewMode,
  onViewModeChange,
  onOpenGroupManager,
  resultCount,
  hasSearchQuery,
}: ViewControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-primary rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">
          {hasSearchQuery
            ? `Search Results (${resultCount})`
            : `Your Trackers (${resultCount})`}
        </h2>
      </div>

      <div className="flex items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-1">
          <button
            onClick={() => onViewModeChange("groups")}
            className={`px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              viewMode === "groups"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="View in groups mode"
          >
            Groups
          </button>
          <button
            onClick={() => onViewModeChange("grid")}
            className={`px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="View in grid mode"
          >
            Grid
          </button>
        </div>

        {/* Group Manager Button */}
        <button
          onClick={onOpenGroupManager}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white/80 transition-all duration-200"
          aria-label="Manage groups"
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
              d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
            />
          </svg>
          <span className="hidden sm:inline">Manage Groups</span>
        </button>
      </div>
    </div>
  );
}
