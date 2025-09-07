"use client";
import React from "react";
import { TodoCard } from "./TodoCard";
import { EmptyState } from "./EmptyState";
import { Todo, TodoReflection } from "../../types";

interface TodoListProps {
  todos: Todo[];
  onComplete: (id: string, reflection?: TodoReflection) => void;
  onUpdate: (id: string, updates: Partial<Todo>) => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
}

export function TodoList({
  todos,
  onComplete,
  onUpdate,
  onDelete,
  onArchive,
}: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState />;
  }

  // Group todos by status for better organization
  const pendingTodos = todos.filter((todo) => todo.status === "pending");
  const completedTodos = todos.filter((todo) => todo.status === "completed");
  const archivedTodos = todos.filter((todo) => todo.status === "archived");

  return (
    <div className="space-y-6">
      {/* Pending Todos */}
      {pendingTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
            Pending ({pendingTodos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pendingTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onComplete={onComplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onArchive={onArchive}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Todos */}
      {completedTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Completed ({completedTodos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onComplete={onComplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onArchive={onArchive}
              />
            ))}
          </div>
        </div>
      )}

      {/* Archived Todos */}
      {archivedTodos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
            Archived ({archivedTodos.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {archivedTodos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onComplete={onComplete}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onArchive={onArchive}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
