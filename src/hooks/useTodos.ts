"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { v4 as uuid } from "uuid";
import {
  Todo,
  TodoCategory,
  TodoStats,
  TodoAchievement,
  TodoReflection,
  AppState,
} from "../types";
import { calculateMicroRewards } from "../utils/gamification";
import { useIndexedDB } from "./useIndexedDB";

// Default categories
const DEFAULT_CATEGORIES: TodoCategory[] = [
  {
    id: "work",
    name: "Work",
    color: "#3B82F6",
    icon: "💼",
    description: "Work-related tasks and projects",
    createdAt: new Date().toISOString(),
    order: 1,
  },
  {
    id: "learning",
    name: "Learning",
    color: "#10B981",
    icon: "📚",
    description: "Learning and skill development",
    createdAt: new Date().toISOString(),
    order: 2,
  },
  {
    id: "personal",
    name: "Personal",
    color: "#F59E0B",
    icon: "🏠",
    description: "Personal tasks and habits",
    createdAt: new Date().toISOString(),
    order: 3,
  },
  {
    id: "health",
    name: "Health",
    color: "#EF4444",
    icon: "💪",
    description: "Health and fitness activities",
    createdAt: new Date().toISOString(),
    order: 4,
  },
  {
    id: "creative",
    name: "Creative",
    color: "#8B5CF6",
    icon: "🎨",
    description: "Creative projects and hobbies",
    createdAt: new Date().toISOString(),
    order: 5,
  },
];

// Default achievements
const DEFAULT_ACHIEVEMENTS: TodoAchievement[] = [
  {
    id: "first_completion",
    name: "First Step",
    description: "Complete your first todo",
    icon: "🎯",
    category: "completion",
    requirement: { type: "count", value: 1 },
    reward: { xp: 50, badge: "first_step" },
  },
  {
    id: "streak_3",
    name: "Getting Started",
    description: "Complete todos for 3 days in a row",
    icon: "🔥",
    category: "streak",
    requirement: { type: "streak", value: 3, timeframe: "daily" },
    reward: { xp: 100, badge: "getting_started" },
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Complete todos for 7 days in a row",
    icon: "⚡",
    category: "streak",
    requirement: { type: "streak", value: 7, timeframe: "daily" },
    reward: { xp: 200, badge: "week_warrior" },
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Complete 5 todos in under 10 minutes each",
    icon: "🏃",
    category: "speed",
    requirement: { type: "time", value: 10 },
    reward: { xp: 150, badge: "speed_demon" },
  },
  {
    id: "category_master",
    name: "Category Master",
    description: "Complete 5 todos in each category",
    icon: "🏆",
    category: "variety",
    requirement: { type: "category", value: 5 },
    reward: { xp: 150, badge: "category_master" },
  },
];

export function useTodos() {
  // Use the main IndexedDB system instead of separate localStorage
  const [appState, setAppState, , isLoading] = useIndexedDB(
    "progress-os-v2-state",
    {
      appMeta: { version: "2.0.0", lastUpdated: new Date().toISOString() },
      trackers: {},
      trackerGroups: {},
      snapshots: [],
      quizItems: {},
      taskPages: {},
    } as AppState
  );

  // Extract todo data from app state
  const todos = useMemo(() => appState.todos || [], [appState.todos]);
  const categories = useMemo(
    () => appState.categories || DEFAULT_CATEGORIES,
    [appState.categories]
  );
  const stats = appState.todoStats || {
    totalTodos: 0,
    completedTodos: 0,
    pendingTodos: 0,
    totalXP: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageCompletionTime: 0,
    categoryBreakdown: {},
    typeBreakdown: {},
    weeklyProgress: [],
  };
  const achievements = appState.todoAchievements || DEFAULT_ACHIEVEMENTS;

  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "completed" | "archived"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(false);

  // Helper function to update app state
  const updateAppState = useCallback(
    (updates: Partial<AppState>) => {
      setAppState({
        ...appState,
        ...updates,
        appMeta: {
          ...appState.appMeta,
          lastUpdated: new Date().toISOString(),
        },
      });
    },
    [appState, setAppState]
  );

  // Calculate XP value based on todo type and priority
  const calculateXPValue = useCallback(
    (type: Todo["type"], priority: Todo["priority"]): number => {
      const baseXP = {
        checklist: 5,
        learning_term: 10,
        project_milestone: 15,
        daily_habit: 8,
        quick_action: 3,
      };

      const priorityMultiplier = {
        low: 1,
        medium: 1.5,
        high: 2,
      };

      return Math.round(baseXP[type] * priorityMultiplier[priority]);
    },
    []
  );

  // Add a new todo
  const addTodo = useCallback(
    (todoData: Omit<Todo, "id" | "createdAt" | "updatedAt" | "xpValue">) => {
      const newTodo: Todo = {
        ...todoData,
        id: uuid(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        xpValue: calculateXPValue(todoData.type, todoData.priority),
      };

      updateAppState({
        todos: [newTodo, ...todos],
      });
    },
    [calculateXPValue, todos, updateAppState]
  );

  // Update an existing todo
  const updateTodo = useCallback(
    (id: string, updates: Partial<Todo>) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              ...updates,
              updatedAt: new Date().toISOString(),
              xpValue:
                updates.type || updates.priority
                  ? calculateXPValue(
                      updates.type || todo.type,
                      updates.priority || todo.priority
                    )
                  : todo.xpValue,
            }
          : todo
      );
      updateAppState({ todos: updatedTodos });
    },
    [calculateXPValue, todos, updateAppState]
  );

  // Complete a todo
  const completeTodo = useCallback(
    (id: string, reflection?: TodoReflection) => {
      const now = new Date().toISOString();

      const updatedTodos = todos.map((todo) => {
        if (todo.id === id) {
          const completedTodo = {
            ...todo,
            status: "completed" as const,
            completedAt: now,
            updatedAt: now,
            reflection,
            actualTime: reflection?.timeSpent || todo.estimatedTime,
          };

          // Calculate micro rewards
          const microRewards = calculateMicroRewards(
            {
              id: todo.id,
              title: todo.title,
              effort: 1, // Default effort for todos
              status: "done" as const,
              createdAt: todo.createdAt,
              completedAt: now,
              desc: todo.description || "",
              tags: todo.tags,
              notes: [],
              order: 0,
            },
            stats.currentStreak,
            stats.totalTodos
          );

          return {
            ...completedTodo,
            microRewards: [...(todo.microRewards || []), ...microRewards],
          };
        }
        return todo;
      });

      updateAppState({ todos: updatedTodos });
    },
    [todos, stats.currentStreak, stats.totalTodos, updateAppState]
  );

  // Delete a todo
  const deleteTodo = useCallback(
    (id: string) => {
      const updatedTodos = todos.filter((todo) => todo.id !== id);
      updateAppState({ todos: updatedTodos });
    },
    [todos, updateAppState]
  );

  // Archive a todo
  const archiveTodo = useCallback(
    (id: string) => {
      const updatedTodos = todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: "archived" as const,
              updatedAt: new Date().toISOString(),
            }
          : todo
      );
      updateAppState({ todos: updatedTodos });
    },
    [todos, updateAppState]
  );

  // Add a new category
  const addCategory = useCallback(
    (categoryData: Omit<TodoCategory, "id" | "createdAt" | "order">) => {
      const newCategory: TodoCategory = {
        ...categoryData,
        id: uuid(),
        createdAt: new Date().toISOString(),
        order: categories.length,
      };

      updateAppState({
        categories: [...categories, newCategory],
      });
    },
    [categories, updateAppState]
  );

  // Update a category
  const updateCategory = useCallback(
    (id: string, updates: Partial<TodoCategory>) => {
      const updatedCategories = categories.map((category) =>
        category.id === id
          ? { ...category, ...updates, updatedAt: new Date().toISOString() }
          : category
      );
      updateAppState({ categories: updatedCategories });
    },
    [categories, updateAppState]
  );

  // Delete a category
  const deleteCategory = useCallback(
    (id: string) => {
      const updatedCategories = categories.filter(
        (category) => category.id !== id
      );
      // Also update todos that use this category
      const updatedTodos = todos.map((todo) =>
        todo.category === id ? { ...todo, category: "personal" } : todo
      );
      updateAppState({
        categories: updatedCategories,
        todos: updatedTodos,
      });
    },
    [categories, todos, updateAppState]
  );

  // Calculate and update stats
  const updateStats = useCallback(() => {
    const totalTodos = todos.length;
    const completedTodos = todos.filter(
      (todo) => todo.status === "completed"
    ).length;
    const pendingTodos = todos.filter(
      (todo) => todo.status === "pending"
    ).length;
    const totalXP = todos
      .filter((todo) => todo.status === "completed")
      .reduce((sum, todo) => sum + todo.xpValue, 0);

    // Calculate category breakdown
    const categoryBreakdown: Record<string, number> = {};
    todos.forEach((todo) => {
      if (todo.status === "completed") {
        categoryBreakdown[todo.category] =
          (categoryBreakdown[todo.category] || 0) + 1;
      }
    });

    // Calculate type breakdown
    const typeBreakdown: Record<string, number> = {};
    todos.forEach((todo) => {
      if (todo.status === "completed") {
        typeBreakdown[todo.type] = (typeBreakdown[todo.type] || 0) + 1;
      }
    });

    // Calculate current streak
    const today = new Date().toISOString().split("T")[0];
    const completedDates = todos
      .filter((todo) => todo.status === "completed" && todo.completedAt)
      .map((todo) => todo.completedAt!.split("T")[0])
      .filter((date, index, arr) => arr.indexOf(date) === index)
      .sort()
      .reverse();

    let currentStreak = 0;
    const checkDate = new Date(today);
    for (const date of completedDates) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (date === dateStr) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    const newStats: TodoStats = {
      totalTodos,
      completedTodos,
      pendingTodos,
      totalXP,
      currentStreak,
      longestStreak: Math.max(stats.longestStreak, currentStreak),
      averageCompletionTime: 0, // TODO: Calculate based on actual time
      categoryBreakdown,
      typeBreakdown,
      weeklyProgress: stats.weeklyProgress, // TODO: Calculate weekly progress
    };

    updateAppState({ todoStats: newStats });
  }, [todos, stats.longestStreak, stats.weeklyProgress, updateAppState]);

  // Update stats whenever todos change
  useEffect(() => {
    if (!isLoading) {
      updateStats();
    }
  }, [todos, isLoading, updateStats]);

  // Filter todos based on current filters
  const filteredTodos = todos.filter((todo) => {
    if (activeFilter !== "all" && todo.status !== activeFilter) {
      return false;
    }
    if (selectedCategory !== "all" && todo.category !== selectedCategory) {
      return false;
    }
    if (!showCompleted && todo.status === "completed") {
      return false;
    }
    return true;
  });

  return {
    todos: filteredTodos,
    categories,
    stats,
    achievements,
    isLoading,
    activeFilter,
    setActiveFilter,
    selectedCategory,
    setSelectedCategory,
    showCompleted,
    setShowCompleted,
    addTodo,
    updateTodo,
    completeTodo,
    deleteTodo,
    archiveTodo,
    addCategory,
    updateCategory,
    deleteCategory,
    calculateXPValue,
  };
}
