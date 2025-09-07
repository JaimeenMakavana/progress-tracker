"use client";
import React from "react";
import { Filter, X, CheckSquare, Square } from "lucide-react";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { TodoCategory } from "../../types";

interface TodoFiltersProps {
  categories: TodoCategory[];
  activeFilter: "all" | "pending" | "completed" | "archived";
  setActiveFilter: (
    filter: "all" | "pending" | "completed" | "archived"
  ) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  showCompleted: boolean;
  setShowCompleted: (show: boolean) => void;
}

export function TodoFilters({
  categories,
  activeFilter,
  setActiveFilter,
  selectedCategory,
  setSelectedCategory,
  showCompleted,
  setShowCompleted,
}: TodoFiltersProps) {
  const filters = [
    { key: "all", label: "All", icon: Filter },
    { key: "pending", label: "Pending", icon: Square },
    { key: "completed", label: "Completed", icon: CheckSquare },
    { key: "archived", label: "Archived", icon: X },
  ] as const;

  return (
    <Card className="p-4 mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Status Filters */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Status:</span>
          <div className="flex space-x-1">
            {filters.map(({ key, label, icon: Icon }) => (
              <Button
                key={key}
                variant={activeFilter === key ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveFilter(key)}
                className="flex items-center space-x-1"
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Category:</span>
          <div className="flex flex-wrap gap-1">
            <Button
              variant={selectedCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory("all")}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                size="sm"
                onClick={() => setSelectedCategory(category.id)}
                className="flex items-center space-x-1"
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Show Completed Toggle */}
        <div className="flex items-center space-x-2 ml-auto">
          <Button
            variant={showCompleted ? "default" : "outline"}
            size="sm"
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center space-x-1"
          >
            <CheckSquare className="w-4 h-4" />
            <span>Show Completed</span>
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {(activeFilter !== "all" ||
        selectedCategory !== "all" ||
        showCompleted) && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Active filters:</span>
            {activeFilter !== "all" && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>Status: {activeFilter}</span>
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setActiveFilter("all")}
                />
              </Badge>
            )}
            {selectedCategory !== "all" && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>
                  Category:{" "}
                  {categories.find((c) => c.id === selectedCategory)?.name}
                </span>
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setSelectedCategory("all")}
                />
              </Badge>
            )}
            {showCompleted && (
              <Badge
                variant="secondary"
                className="flex items-center space-x-1"
              >
                <span>Show Completed</span>
                <X
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => setShowCompleted(false)}
                />
              </Badge>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}
