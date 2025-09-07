"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard } from "lucide-react";
import { Task } from "../../types";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Record<string, Task>;
  onToggleTask: (taskId: string, note?: string) => void;
  onEditTask: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenNoteDrawer: (taskId: string) => void;
  onOpenTaskPage: (taskId: string) => void;
  filter?: "all" | "todo" | "inprogress" | "done";
}

export default function TaskList({
  tasks,
  onToggleTask,
  onEditTask,
  onDeleteTask,
  onOpenNoteDrawer,
  onOpenTaskPage,
  filter = "all",
}: TaskListProps) {
  const [activeFilter, setActiveFilter] = useState<
    "all" | "todo" | "inprogress" | "done"
  >(filter);

  const allTasks = Object.values(tasks);
  const todoTasks = allTasks.filter((task) => task.status === "todo");
  const inProgressTasks = allTasks.filter(
    (task) => task.status === "inprogress"
  );
  const doneTasks = allTasks.filter((task) => task.status === "done");

  const getFilteredTasks = () => {
    switch (activeFilter) {
      case "todo":
        return todoTasks;
      case "inprogress":
        return inProgressTasks;
      case "done":
        return doneTasks;
      default:
        return allTasks;
    }
  };

  const filteredTasks = getFilteredTasks();

  const filterButtons = [
    { key: "all", label: "All", count: allTasks.length },
    { key: "todo", label: "Todo", count: todoTasks.length },
    { key: "inprogress", label: "In Progress", count: inProgressTasks.length },
    { key: "done", label: "Done", count: doneTasks.length },
  ] as const;

  return (
    <div className="space-y-4">
      {/* Filter Buttons */}
      <div className="flex gap-2 flex-wrap">
        {filterButtons.map(({ key, label, count }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === key
                ? "bg-black text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-gray-500"
            >
              <Clipboard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No tasks found</p>
              <p className="text-sm">
                {activeFilter === "all"
                  ? "Create your first task to get started"
                  : `No ${activeFilter} tasks at the moment`}
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <TaskItem
                  task={task}
                  onToggle={onToggleTask}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onOpenNoteDrawer={onOpenNoteDrawer}
                  onOpenTaskPage={onOpenTaskPage}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Summary */}
      {allTasks.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-black">
                {allTasks.length}
              </div>
              <div className="text-sm text-gray-600">Total Tasks</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">
                {todoTasks.length}
              </div>
              <div className="text-sm text-gray-600">To Do</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">
                {inProgressTasks.length}
              </div>
              <div className="text-sm text-gray-600">In Progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-black">
                {doneTasks.length}
              </div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
