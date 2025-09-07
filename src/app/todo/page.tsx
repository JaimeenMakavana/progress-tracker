"use client";
import React from "react";
import {
  TodoHeader,
  TodoStats,
  TodoFilters,
  TodoList,
  TodoForm,
  TodoAchievements,
  TodoCategoryManager,
} from "@/components/todos";
import { useTodos } from "@/hooks/useTodos";

export default function TodoPage() {
  const {
    todos,
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
  } = useTodos();

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6">
        {/* Header */}
        <TodoHeader
          totalTodos={stats.totalTodos}
          completedToday={stats.completedTodos}
          currentStreak={stats.currentStreak}
          totalXP={stats.totalXP}
        />

        {/* Stats Overview */}
        <TodoStats stats={stats} />

        {/* Filters and Controls */}
        <TodoFilters
          categories={categories}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          showCompleted={showCompleted}
          setShowCompleted={setShowCompleted}
        />

        {/* Todo List */}
        <TodoList
          todos={todos}
          onComplete={completeTodo}
          onUpdate={updateTodo}
          onDelete={deleteTodo}
          onArchive={archiveTodo}
        />

        {/* Add Todo Form */}
        <TodoForm onSubmit={addTodo} categories={categories} />

        {/* Achievements */}
        <TodoAchievements achievements={achievements} />

        {/* Category Management */}
        <TodoCategoryManager
          categories={categories}
          onAddCategory={addCategory}
          onUpdateCategory={updateCategory}
          onDeleteCategory={deleteCategory}
        />
      </div>
    </div>
  );
}
