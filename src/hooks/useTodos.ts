"use client";
import { useState, useEffect, useCallback } from "react";
import { v4 as uuid } from "uuid";
import {
  Todo,
  TodoCategory,
  TodoStats,
  TodoAchievement,
  TodoReflection,
} from "../types";
import { calculateMicroRewards } from "../utils/gamification";

const STORAGE_KEY = "progress-tracker-todos";
const CATEGORIES_KEY = "progress-tracker-todo-categories";
const STATS_KEY = "progress-tracker-todo-stats";
const ACHIEVEMENTS_KEY = "progress-tracker-todo-achievements";

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
    description: "Health and fitness related",
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
    id: "first_todo",
    name: "Getting Started",
    description: "Complete your first todo",
    icon: "🎯",
    category: "completion",
    requirement: { type: "count", value: 1 },
    reward: { xp: 10, badge: "starter" },
  },
  {
    id: "streak_3",
    name: "Three Day Streak",
    description: "Complete todos for 3 consecutive days",
    icon: "🔥",
    category: "streak",
    requirement: { type: "streak", value: 3, timeframe: "daily" },
    reward: { xp: 50, badge: "streak_master" },
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "Complete todos for 7 consecutive days",
    icon: "⚡",
    category: "streak",
    requirement: { type: "streak", value: 7, timeframe: "daily" },
    reward: { xp: 100, badge: "week_warrior" },
  },
  {
    id: "speed_demon",
    name: "Speed Demon",
    description: "Complete 10 todos in under 5 minutes each",
    icon: "🚀",
    category: "speed",
    requirement: { type: "time", value: 10 },
    reward: { xp: 75, badge: "speed_demon" },
  },
  {
    id: "category_master",
    name: "Category Master",
    description: "Complete todos in all 5 categories",
    icon: "🏆",
    category: "variety",
    requirement: { type: "category", value: 5 },
    reward: { xp: 150, badge: "category_master" },
  },
];

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [categories, setCategories] =
    useState<TodoCategory[]>(DEFAULT_CATEGORIES);
  const [stats, setStats] = useState<TodoStats>({
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
  });
  const [achievements, setAchievements] =
    useState<TodoAchievement[]>(DEFAULT_ACHIEVEMENTS);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "pending" | "completed" | "archived"
  >("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showCompleted, setShowCompleted] = useState(false);

  // Load data from localStorage
  useEffect(() => {
    const loadData = () => {
      try {
        const savedTodos = localStorage.getItem(STORAGE_KEY);
        const savedCategories = localStorage.getItem(CATEGORIES_KEY);
        const savedStats = localStorage.getItem(STATS_KEY);
        const savedAchievements = localStorage.getItem(ACHIEVEMENTS_KEY);

        if (savedTodos) {
          setTodos(JSON.parse(savedTodos));
        }
        if (savedCategories) {
          setCategories(JSON.parse(savedCategories));
        }
        if (savedStats) {
          setStats(JSON.parse(savedStats));
        }
        if (savedAchievements) {
          setAchievements(JSON.parse(savedAchievements));
        }
      } catch (error) {
        console.error("Error loading todo data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
    }
  }, [categories, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STATS_KEY, JSON.stringify(stats));
    }
  }, [stats, isLoading]);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(achievements));
    }
  }, [achievements, isLoading]);

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

      setTodos((prev) => [newTodo, ...prev]);
    },
    [calculateXPValue]
  );

  // Update an existing todo
  const updateTodo = useCallback(
    (id: string, updates: Partial<Todo>) => {
      setTodos((prev) =>
        prev.map((todo) =>
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
        )
      );
    },
    [calculateXPValue]
  );

  // Complete a todo
  const completeTodo = useCallback(
    (id: string, reflection?: TodoReflection) => {
      const now = new Date().toISOString();

      setTodos((prev) =>
        prev.map((todo) => {
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
                desc: todo.description || "",
                status: "done",
                effort:
                  todo.priority === "high"
                    ? 8
                    : todo.priority === "medium"
                    ? 5
                    : 3,
                tags: todo.tags,
                createdAt: todo.createdAt,
                completedAt: now,
                notes: [],
                order: 0,
              },
              stats.currentStreak,
              stats.completedTodos
            );

            completedTodo.microRewards = microRewards;

            return completedTodo;
          }
          return todo;
        })
      );
    },
    [stats.currentStreak, stats.completedTodos]
  );

  // Delete a todo
  const deleteTodo = useCallback((id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  }, []);

  // Archive a todo
  const archiveTodo = useCallback(
    (id: string) => {
      updateTodo(id, { status: "archived" });
    },
    [updateTodo]
  );

  // Update statistics
  const updateStats = useCallback(() => {
    setStats((prev) => {
      const completedTodos = todos.filter(
        (todo) => todo.status === "completed"
      );
      const pendingTodos = todos.filter((todo) => todo.status === "pending");
      const totalXP = completedTodos.reduce(
        (sum, todo) => sum + todo.xpValue,
        0
      );

      // Calculate streak
      const today = new Date().toDateString();

      let currentStreak = 0;
      const completedToday = completedTodos.some(
        (todo) =>
          todo.completedAt &&
          new Date(todo.completedAt).toDateString() === today
      );

      if (completedToday) {
        currentStreak = 1;
        // Check previous days
        for (let i = 1; i < 365; i++) {
          const checkDate = new Date(
            Date.now() - i * 24 * 60 * 60 * 1000
          ).toDateString();
          const completedOnDate = completedTodos.some(
            (todo) =>
              todo.completedAt &&
              new Date(todo.completedAt).toDateString() === checkDate
          );
          if (completedOnDate) {
            currentStreak++;
          } else {
            break;
          }
        }
      }

      // Calculate category breakdown
      const categoryBreakdown: Record<string, number> = {};
      const typeBreakdown: Record<string, number> = {};

      completedTodos.forEach((todo) => {
        categoryBreakdown[todo.category] =
          (categoryBreakdown[todo.category] || 0) + 1;
        typeBreakdown[todo.type] = (typeBreakdown[todo.type] || 0) + 1;
      });

      // Calculate average completion time
      const todosWithTime = completedTodos.filter((todo) => todo.actualTime);
      const averageCompletionTime =
        todosWithTime.length > 0
          ? todosWithTime.reduce(
              (sum, todo) => sum + (todo.actualTime || 0),
              0
            ) / todosWithTime.length
          : 0;

      return {
        ...prev,
        totalTodos: todos.length,
        completedTodos: completedTodos.length,
        pendingTodos: pendingTodos.length,
        totalXP,
        currentStreak,
        longestStreak: Math.max(prev.longestStreak, currentStreak),
        averageCompletionTime,
        categoryBreakdown,
        typeBreakdown,
      };
    });
  }, [todos]);

  // Check achievements
  const checkAchievements = useCallback(() => {
    setAchievements((prev) =>
      prev.map((achievement) => {
        if (achievement.unlockedAt) return achievement;

        let progress = 0;
        const completedTodos = todos.filter(
          (todo) => todo.status === "completed"
        );

        switch (achievement.requirement.type) {
          case "count":
            progress = Math.min(
              (completedTodos.length / achievement.requirement.value) * 100,
              100
            );
            break;
          case "streak":
            progress = Math.min(
              (stats.currentStreak / achievement.requirement.value) * 100,
              100
            );
            break;
          case "time":
            const fastTodos = completedTodos.filter(
              (todo) => (todo.actualTime || 0) <= 5
            );
            progress = Math.min(
              (fastTodos.length / achievement.requirement.value) * 100,
              100
            );
            break;
          case "category":
            const uniqueCategories = new Set(
              completedTodos.map((todo) => todo.category)
            );
            progress = Math.min(
              (uniqueCategories.size / achievement.requirement.value) * 100,
              100
            );
            break;
        }

        if (progress >= 100 && !achievement.unlockedAt) {
          return {
            ...achievement,
            unlockedAt: new Date().toISOString(),
            progress: 100,
          };
        }

        return {
          ...achievement,
          progress,
        };
      })
    );
  }, [todos, stats.currentStreak]);

  // Update stats and achievements when todos change
  useEffect(() => {
    if (!isLoading) {
      updateStats();
      checkAchievements();
    }
  }, [todos, isLoading, updateStats, checkAchievements]);

  // Filter todos based on current filters
  const filteredTodos = todos.filter((todo) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "pending") return todo.status === "pending";
    if (activeFilter === "completed") return todo.status === "completed";
    if (activeFilter === "archived") return todo.status === "archived";

    if (selectedCategory !== "all" && todo.category !== selectedCategory)
      return false;

    if (!showCompleted && todo.status === "completed") return false;

    return true;
  });

  // Category management functions
  const addCategory = useCallback(
    (categoryData: Omit<TodoCategory, "id" | "createdAt" | "order">) => {
      const newCategory: TodoCategory = {
        ...categoryData,
        id: uuid(),
        createdAt: new Date().toISOString(),
        order: categories.length + 1,
      };
      setCategories((prev) => [...prev, newCategory]);
    },
    [categories.length]
  );

  const updateCategory = useCallback(
    (id: string, updates: Partial<TodoCategory>) => {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? { ...category, ...updates } : category
        )
      );
    },
    []
  );

  const deleteCategory = useCallback(
    (id: string) => {
      setCategories((prev) => prev.filter((category) => category.id !== id));
      // Also remove todos in this category or move them to default
      setTodos((prev) =>
        prev.map((todo) =>
          todo.category === id
            ? { ...todo, category: categories[0]?.id || "personal" }
            : todo
        )
      );
    },
    [categories]
  );

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
    deleteTodo,
    completeTodo,
    archiveTodo,
    addCategory,
    updateCategory,
    deleteCategory,
  };
}
