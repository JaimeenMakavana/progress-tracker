import React from "react";
import { ViewMode } from "../../hooks/useTrackerOperations";
import { Button } from "../ui/button";
import { Layers } from "lucide-react";

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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
      <div className="flex items-center gap-3">
        <div className="w-2 h-2 bg-[#2C3930] rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900">
          {hasSearchQuery
            ? `Search Results (${resultCount})`
            : `Your Trackers (${resultCount})`}
        </h2>
      </div>

      <div className="flex justify-between items-center gap-3">
        {/* View Mode Toggle */}
        <div className="flex items-center bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl p-1">
          <Button
            variant={viewMode === "groups" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("groups")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
              viewMode === "groups"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="View in groups mode"
          >
            Groups
          </Button>
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            onClick={() => onViewModeChange("grid")}
            className={`px-4 py-2.5 text-sm font-medium rounded-xl transition-all duration-200 ${
              viewMode === "grid"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
            aria-label="View in grid mode"
          >
            Grid
          </Button>
        </div>

        {/* Group Manager Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenGroupManager}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl hover:bg-white/80 transition-all duration-200"
          aria-label="Manage groups"
        >
          <Layers className="w-4 h-4" />
          <span className="hidden sm:inline">Manage Groups</span>
        </Button>
      </div>
    </div>
  );
}
