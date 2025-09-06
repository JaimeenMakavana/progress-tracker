import React from "react";
import { motion } from "framer-motion";
import { Plus, Search, X } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
      className="mb-4 sm:mb-6 lg:mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <div className="flex sm:flex-row gap-3 sm:gap-4">
        {/* Search Input */}
        <div className="flex-1 relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-gray-400 group-focus-within:text-[#2C3930] transition-colors" />
          </div>
          <Input
            type="text"
            placeholder="Search trackers, tasks, or descriptions..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#2C3930]/20 focus:border-[#2C3930]/30 focus:bg-white transition-all duration-200 text-base placeholder:text-gray-500"
            aria-label="Search trackers"
          />
          {hasSearchQuery && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClearSearch}
              className="absolute inset-y-0 right-0 pr-4 h-auto text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Clear search"
            >
              <X className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Results Counter and New Tracker Button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-100/50 rounded-xl">
            <div className="w-2 h-2 bg-[#2C3930] rounded-full"></div>
            <span className="text-sm font-medium text-gray-700">
              {hasSearchQuery
                ? `${resultCount} result${resultCount !== 1 ? "s" : ""}`
                : `${resultCount} tracker${resultCount !== 1 ? "s" : ""}`}
            </span>
          </div>

          {/* New Tracker Button */}
          <Button
            onClick={onCreateTracker}
            className="flex items-center gap-2 px-4 py-3 bg-[#2C3930] text-white rounded-2xl hover:bg-[#2C3930]/90 transition-all duration-200 shadow-lg hover:shadow-xl font-medium"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">New Tracker</span>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
