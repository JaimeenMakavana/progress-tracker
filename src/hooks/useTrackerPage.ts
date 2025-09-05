import { useState } from "react";
import { useTrackers } from "../context/TrackersContext";

interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
}

export function useTrackerPage(trackerId: string) {
  const {
    state,
    addTask,
    deleteTask,
    toggleTaskComplete,
    importTasks,
    updateTracker,
  } = useTrackers();

  const tracker = state.trackers[trackerId];

  // Modal states
  const [showAddTask, setShowAddTask] = useState(false);
  const [showImportTasks, setShowImportTasks] = useState(false);

  // Form states
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskEffort, setNewTaskEffort] = useState(1);
  const [newTaskTags, setNewTaskTags] = useState("");
  const [importJson, setImportJson] = useState("");
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const tags = newTaskTags
        .split(",")
        .map((tag) => tag.trim())
        .filter((tag) => tag);
      addTask(trackerId, {
        title: newTaskTitle.trim(),
        effort: newTaskEffort,
        tags,
      });
      setNewTaskTitle("");
      setNewTaskEffort(1);
      setNewTaskTags("");
      setShowAddTask(false);
    }
  };

  const handleEditTask = (taskId: string) => {
    // TODO: Implement task editing modal
    console.log("Edit task:", taskId);
  };

  const handleImportTasks = () => {
    try {
      const tasksData = JSON.parse(importJson);
      if (!Array.isArray(tasksData)) {
        setImportResult({
          success: false,
          imported: 0,
          errors: ["JSON must be an array of tasks"],
        });
        return;
      }

      const result = importTasks(trackerId, tasksData);
      setImportResult(result);

      if (result.success) {
        setImportJson("");
        setTimeout(() => setShowImportTasks(false), 2000);
      }
    } catch (error) {
      setImportResult({
        success: false,
        imported: 0,
        errors: [
          `Invalid JSON: ${
            error instanceof Error ? error.message : "Unknown error"
          }`,
        ],
      });
    }
  };

  const handleEditTracker = (title: string) => {
    updateTracker(trackerId, { title });
  };

  return {
    tracker,
    // Modal states
    showAddTask,
    setShowAddTask,
    showImportTasks,
    setShowImportTasks,
    // Form states
    newTaskTitle,
    setNewTaskTitle,
    newTaskEffort,
    setNewTaskEffort,
    newTaskTags,
    setNewTaskTags,
    importJson,
    setImportJson,
    importResult,
    setImportResult,
    // Handlers
    handleAddTask,
    handleEditTask,
    handleImportTasks,
    handleEditTracker,
    // Task operations
    onToggleTask: (taskId: string, note?: string) =>
      toggleTaskComplete(trackerId, taskId, note),
    onDeleteTask: (taskId: string) => deleteTask(trackerId, taskId),
  };
}
