import React from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onClearSearch: () => void;
  resultCount: number;
  hasSearchQuery: boolean;
  onCreateTracker: () => void;
}

export function SearchBar({
  searchQuery,
  onSearchChange,
  onClearSearch,
  resultCount,
  hasSearchQuery,
  onCreateTracker,
}: SearchBarProps) {
  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search trackers, tasks, or descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-white transition-all duration-200 text-base placeholder:text-gray-500"
            aria-label="Search trackers"
          />
          {hasSearchQuery && (
            <button
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Results Counter and New Tracker Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100/50 rounded-xl">
            <div className="w-2 h-2 bg-primary rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              {hasSearchQuery
                ? `${resultCount} result${resultCount !== 1 ? "s" : ""}`
                : `${resultCount} tracker${resultCount !== 1 ? "s" : ""}`}
            </span>
          </div>

          {/* New Tracker Button */}
          <button
            onClick={onCreateTracker}
            className="flex items-center gap-2 px-4 py-3 bg-primary text-white rounded-2xl hover:bg-primary/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Tracker</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}
