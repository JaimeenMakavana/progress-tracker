"use client";
import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Task, Note } from "../types";

interface WikiListProps {
  tasks: Record<string, Task>;
  searchQuery?: string;
  onNoteClick?: (note: Note, task: Task) => void;
}

export default function WikiList({
  tasks,
  searchQuery = "",
  onNoteClick,
}: WikiListProps) {
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "title">("date");

  // Extract all notes from tasks
  const allNotes = useMemo(() => {
    const notes: Array<{ note: Note; task: Task; taskTitle: string }> = [];

    Object.values(tasks).forEach((task) => {
      task.notes.forEach((note) => {
        notes.push({
          note,
          task,
          taskTitle: task.title,
        });
      });
    });

    return notes;
  }, [tasks]);

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    allNotes.forEach(({ note }) => {
      if (note.type) {
        tags.add(note.type);
      }
    });
    return Array.from(tags);
  }, [allNotes]);

  // Filter and sort notes
  const filteredNotes = useMemo(() => {
    let filtered = allNotes;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        ({ note, taskTitle }) =>
          note.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          taskTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by tag
    if (selectedTag !== "all") {
      filtered = filtered.filter(({ note }) => note.type === selectedTag);
    }

    // Sort
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.note.at).getTime() - new Date(a.note.at).getTime();
      } else {
        return a.taskTitle.localeCompare(b.taskTitle);
      }
    });

    return filtered;
  }, [allNotes, searchQuery, selectedTag, sortBy]);

  const getNoteIcon = (type?: string) => {
    switch (type) {
      case "reflection":
        return (
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
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case "snippet":
        return (
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
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        );
      case "link":
        return (
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
              d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
            />
          </svg>
        );
      default:
        return (
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        );
    }
  };

  const getTypeColor = (type?: string) => {
    switch (type) {
      case "reflection":
        return "bg-blue-100 text-blue-800";
      case "snippet":
        return "bg-green-100 text-green-800";
      case "link":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        {/* Tag Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          >
            <option value="all">All Types</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-gray-700">Sort:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as "date" | "title")}
            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black text-sm"
          >
            <option value="date">Date</option>
            <option value="title">Title</option>
          </select>
        </div>

        {/* Count */}
        <div className="text-sm text-gray-500">
          {filteredNotes.length} note{filteredNotes.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Notes List */}
      <div className="space-y-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notes found
            </h3>
            <p className="text-gray-600">
              {searchQuery
                ? "Try adjusting your search or filters"
                : "Start adding notes to your tasks to build your knowledge base"}
            </p>
          </div>
        ) : (
          filteredNotes.map(({ note, task, taskTitle }, index) => (
            <motion.div
              key={`${task.id}-${note.at}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="bg-white border border-gray-200 rounded-lg p-4 hover:border-black transition-colors cursor-pointer"
              onClick={() => onNoteClick?.(note, task)}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`p-2 rounded-lg ${getTypeColor(note.type)}`}>
                  {getNoteIcon(note.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-semibold text-black truncate">
                      {taskTitle}
                    </h4>
                    {note.type && (
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${getTypeColor(
                          note.type
                        )}`}
                      >
                        {note.type}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed line-clamp-3">
                    {note.text}
                  </p>

                  <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
                    <span>{new Date(note.at).toLocaleDateString()}</span>
                    <span>{new Date(note.at).toLocaleTimeString()}</span>
                  </div>
                </div>

                {/* Arrow */}
                <div className="text-gray-400">
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
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
