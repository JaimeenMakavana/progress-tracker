"use client";
import React, { createContext, useContext, useMemo } from "react";
import { v4 as uuid } from "uuid";
import { useIndexedDB } from "../hooks/useIndexedDB";
import { AppState, Tracker, Task, Milestone, Note } from "../types";

interface ImportTaskData {
  title: string;
  desc?: string;
  description?: string;
  status?: "todo" | "inprogress" | "done";
  effort?: number;
  tags?: string[];
  createdAt?: string;
  startedAt?: string;
  completedAt?: string;
  notes?: Note[];
  execution?: string;
  mindset?: string;
  quizIds?: string[];
  reflectionPrompts?: string[];
}
import { migrateState, validateState } from "../utils/migration";
import { githubSync, GitHubUser } from "../services/githubSync";

const KEY = "progress-os-v2-state";
const defaultState: AppState = {
  appMeta: {
    version: "2.0.0",
    lastUpdated: new Date().toISOString(),
  },
  trackers: {},
  snapshots: [],
  quizItems: {},
};

interface TrackersContextType {
  state: AppState;
  isLoading: boolean;
  createTracker: (data: { title: string; description?: string }) => string;
  updateTracker: (id: string, patch: Partial<Tracker>) => void;
  deleteTracker: (id: string) => void;
  addTask: (
    trackerId: string,
    data: { title: string; effort?: number; tags?: string[] }
  ) => string;
  updateTask: (trackerId: string, taskId: string, patch: Partial<Task>) => void;
  deleteTask: (trackerId: string, taskId: string) => void;
  toggleTaskComplete: (
    trackerId: string,
    taskId: string,
    note?: string
  ) => void;
  addNote: (trackerId: string, taskId: string, note: Note) => void;
  importTasks: (
    trackerId: string,
    tasksData: ImportTaskData[]
  ) => { success: boolean; imported: number; errors: string[] };
  addMilestone: (
    trackerId: string,
    data: { title: string; targetDate: string; taskIds?: string[] }
  ) => string;
  updateMilestone: (
    trackerId: string,
    milestoneId: string,
    patch: Partial<Milestone>
  ) => void;
  deleteMilestone: (trackerId: string, milestoneId: string) => void;
  exportData: () => string;
  importData: (jsonData: string) => boolean;
  // GitHub Sync methods
  syncWithGitHub: () => Promise<{ success: boolean; error?: string }>;
  isGitHubConnected: () => boolean;
  connectToGitHub: () => Promise<boolean>;
  disconnectFromGitHub: () => void;
  getGitHubUser: () => Promise<GitHubUser | null>;
}

const TrackersContext = createContext<TrackersContextType | null>(null);

export function TrackersProvider({ children }: { children: React.ReactNode }) {
  const [rawState, setRawState, , isLoading] = useIndexedDB(KEY, defaultState);

  // Apply migration if needed
  const state = useMemo(() => {
    if (isLoading) return defaultState;

    if (!validateState(rawState)) {
      console.warn("Invalid state detected, using default state");
      return defaultState;
    }

    const migrationResult = migrateState(rawState);
    if (migrationResult.success && migrationResult.migratedState) {
      return migrationResult.migratedState;
    }

    console.warn("Migration failed:", migrationResult.error);
    return defaultState;
  }, [rawState, isLoading]);

  const setState = (newState: AppState) => {
    setRawState(newState);
  };

  const updateAppMeta = (newState: AppState) => ({
    ...newState,
    appMeta: {
      ...newState.appMeta,
      lastUpdated: new Date().toISOString(),
    },
  });

  const createTracker = (data: { title: string; description?: string }) => {
    const id = "t-" + uuid();
    const tracker: Tracker = {
      id,
      title: data.title,
      description: data.description || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      settings: { progressMethod: "weighted", weightField: "effort" },
      tasks: {},
      milestones: [],
      activityLog: [],
      templatesUsed: [],
    };

    const newState = {
      ...state,
      trackers: { ...state.trackers, [id]: tracker },
    };
    setState(updateAppMeta(newState));
    return id;
  };

  const updateTracker = (id: string, patch: Partial<Tracker>) => {
    if (!state.trackers[id]) return;

    const newState = {
      ...state,
      trackers: {
        ...state.trackers,
        [id]: {
          ...state.trackers[id],
          ...patch,
          updatedAt: new Date().toISOString(),
        },
      },
    };
    setState(updateAppMeta(newState));
  };

  const deleteTracker = (id: string) => {
    const newTrackers = { ...state.trackers };
    delete newTrackers[id];
    const newState = { ...state, trackers: newTrackers };
    setState(updateAppMeta(newState));
  };

  const addTask = (
    trackerId: string,
    data: { title: string; effort?: number; tags?: string[] }
  ) => {
    if (!state.trackers[trackerId]) return "";

    const id = "task-" + uuid();
    const task: Task = {
      id,
      title: data.title,
      desc: "",
      status: "todo",
      effort: data.effort || 1,
      tags: data.tags || [],
      createdAt: new Date().toISOString(),
      notes: [],
      order: Object.keys(state.trackers[trackerId].tasks).length + 1,
    };

    const tracker = { ...state.trackers[trackerId] };
    tracker.tasks[id] = task;
    tracker.updatedAt = new Date().toISOString();

    const newState = {
      ...state,
      trackers: { ...state.trackers, [trackerId]: tracker },
    };
    setState(updateAppMeta(newState));
    return id;
  };

  const updateTask = (
    trackerId: string,
    taskId: string,
    patch: Partial<Task>
  ) => {
    if (!state.trackers[trackerId] || !state.trackers[trackerId].tasks[taskId])
      return;

    const tracker = { ...state.trackers[trackerId] };
    tracker.tasks[taskId] = { ...tracker.tasks[taskId], ...patch };
    tracker.updatedAt = new Date().toISOString();

    const newState = {
      ...state,
      trackers: { ...state.trackers, [trackerId]: tracker },
    };
    setState(updateAppMeta(newState));
  };

  const deleteTask = (trackerId: string, taskId: string) => {
    if (!state.trackers[trackerId] || !state.trackers[trackerId].tasks[taskId])
      return;

    const tracker = { ...state.trackers[trackerId] };
    delete tracker.tasks[taskId];
    tracker.updatedAt = new Date().toISOString();

    const newState = {
      ...state,
      trackers: { ...state.trackers, [trackerId]: tracker },
    };
    setState(updateAppMeta(newState));
  };

  const toggleTaskComplete = (
    trackerId: string,
    taskId: string,
    note?: string
  ) => {
    if (!state.trackers[trackerId] || !state.trackers[trackerId].tasks[taskId])
      return;

    const tracker = { ...state.trackers[trackerId] };
    const task = { ...tracker.tasks[taskId] };

    task.status = task.status === "done" ? "todo" : "done";
    if (task.status === "done") {
      task.completedAt = new Date().toISOString();
      if (!task.startedAt) task.startedAt = new Date().toISOString();
    } else {
      task.completedAt = undefined;
    }

    if (note) {
      task.notes = [
        ...(task.notes || []),
        { at: new Date().toISOString(), text: note, type: "reflection" },
      ];
    }

    tracker.tasks[taskId] = task;
    tracker.activityLog = [
      {
        type: task.status === "done" ? "complete" : "open",
        taskId,
        at: new Date().toISOString(),
        note,
      },
      ...tracker.activityLog,
    ];
    tracker.updatedAt = new Date().toISOString();

    const newState = {
      ...state,
      trackers: { ...state.trackers, [trackerId]: tracker },
    };
    setState(updateAppMeta(newState));
  };

  const addNote = (trackerId: string, taskId: string, note: Note) => {
    if (!state.trackers[trackerId] || !state.trackers[trackerId].tasks[taskId])
      return;

    const tracker = { ...state.trackers[trackerId] };
    const task = { ...tracker.tasks[taskId] };

    task.notes = [...(task.notes || []), note];
    tracker.tasks[taskId] = task;
    tracker.updatedAt = new Date().toISOString();

    const newState = {
      ...state,
      trackers: { ...state.trackers, [trackerId]: tracker },
    };
    setState(updateAppMeta(newState));
  };

  const importTasks = (trackerId: string, tasksData: ImportTaskData[]) => {
    if (!state.trackers[trackerId]) {
      return { success: false, imported: 0, errors: ["Tracker not found"] };
    }

    const errors: string[] = [];
    let imported = 0;
    const tracker = { ...state.trackers[trackerId] };
    const currentTaskCount = Object.keys(tracker.tasks).length;

    tasksData.forEach((taskData, index) => {
      try {
        // Validate required fields
        if (!taskData.title || typeof taskData.title !== "string") {
          errors.push(`Task ${index + 1}: Missing or invalid title`);
          return;
        }

        // Create task with proper structure
        const id = "task-" + uuid();
        const task: Task = {
          id,
          title: taskData.title,
          desc: taskData.desc || taskData.description || "",
          status: taskData.status || "todo",
          effort: taskData.effort || 1,
          tags: taskData.tags || [],
          createdAt: taskData.createdAt || new Date().toISOString(),
          startedAt: taskData.startedAt,
          completedAt: taskData.completedAt,
          notes: taskData.notes || [],
          order: currentTaskCount + imported + 1,
          execution: taskData.execution,
          mindset: taskData.mindset,
          quizIds: taskData.quizIds || [],
          reflectionPrompts: taskData.reflectionPrompts || [],
        };

        // Validate status
        if (!["todo", "inprogress", "done"].includes(task.status)) {
          task.status = "todo";
          errors.push(`Task ${index + 1}: Invalid status, defaulted to 'todo'`);
        }

        // Validate effort
        if (
          typeof task.effort !== "number" ||
          task.effort < 1 ||
          task.effort > 10
        ) {
          task.effort = 1;
          errors.push(`Task ${index + 1}: Invalid effort, defaulted to 1`);
        }

        tracker.tasks[id] = task;
        imported++;
      } catch (error) {
        errors.push(
          `Task ${index + 1}: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    });

    if (imported > 0) {
      tracker.updatedAt = new Date().toISOString();
      const newState = {
        ...state,
        trackers: { ...state.trackers, [trackerId]: tracker },
      };
      setState(updateAppMeta(newState));
    }

    return {
      success: imported > 0,
      imported,
      errors,
    };
  };

  const addMilestone = (
    trackerId: string,
    data: { title: string; targetDate: string; taskIds?: string[] }
  ) => {
    if (!state.trackers[trackerId]) return "";

    const id = "ms-" + uuid();
    const milestone: Milestone = {
      id,
      title: data.title,
      targetDate: data.targetDate,
      taskIds: data.taskIds || [],
    };

    const tracker = { ...state.trackers[trackerId] };
    tracker.milestones = [...tracker.milestones, milestone];
    tracker.updatedAt = new Date().toISOString();

    const newState = {
      ...state,
      trackers: { ...state.trackers, [trackerId]: tracker },
    };
    setState(updateAppMeta(newState));
    return id;
  };

  const updateMilestone = (
    trackerId: string,
    milestoneId: string,
    patch: Partial<Milestone>
  ) => {
    if (!state.trackers[trackerId]) return;

    const tracker = { ...state.trackers[trackerId] };
    const milestoneIndex = tracker.milestones.findIndex(
      (m) => m.id === milestoneId
    );
    if (milestoneIndex === -1) return;

    tracker.milestones[milestoneIndex] = {
      ...tracker.milestones[milestoneIndex],
      ...patch,
    };
    tracker.updatedAt = new Date().toISOString();

    const newState = {
      ...state,
      trackers: { ...state.trackers, [trackerId]: tracker },
    };
    setState(updateAppMeta(newState));
  };

  const deleteMilestone = (trackerId: string, milestoneId: string) => {
    if (!state.trackers[trackerId]) return;

    const tracker = { ...state.trackers[trackerId] };
    tracker.milestones = tracker.milestones.filter((m) => m.id !== milestoneId);
    tracker.updatedAt = new Date().toISOString();

    const newState = {
      ...state,
      trackers: { ...state.trackers, [trackerId]: tracker },
    };
    setState(updateAppMeta(newState));
  };

  const exportData = () => {
    return JSON.stringify(state, null, 2);
  };

  const importData = (jsonData: string) => {
    try {
      const importedState = JSON.parse(jsonData);
      if (importedState.appMeta && importedState.trackers) {
        setState(importedState);
        return true;
      }
      return false;
    } catch (e) {
      console.error("Import error:", e);
      return false;
    }
  };

  // GitHub Sync methods
  const syncWithGitHub = async () => {
    try {
      const result = await githubSync.syncData(state);
      if (result.success && result.data) {
        setState(updateAppMeta(result.data));
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  };

  const isGitHubConnected = () => {
    return githubSync.isAuthenticated();
  };

  const connectToGitHub = async () => {
    try {
      return await githubSync.authenticate();
    } catch (error) {
      console.error("GitHub connection error:", error);
      return false;
    }
  };

  const disconnectFromGitHub = () => {
    githubSync.logout();
  };

  const getGitHubUser = async () => {
    return await githubSync.getCurrentUser();
  };

  const value = useMemo(
    () => ({
      state,
      isLoading,
      createTracker,
      updateTracker,
      deleteTracker,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskComplete,
      addNote,
      importTasks,
      addMilestone,
      updateMilestone,
      deleteMilestone,
      exportData,
      importData,
      // GitHub Sync methods
      syncWithGitHub,
      isGitHubConnected,
      connectToGitHub,
      disconnectFromGitHub,
      getGitHubUser,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [state, isLoading]
  );

  return (
    <TrackersContext.Provider value={value}>
      {children}
    </TrackersContext.Provider>
  );
}

export function useTrackers() {
  const context = useContext(TrackersContext);
  if (!context) {
    throw new Error("useTrackers must be used within TrackersProvider");
  }
  return context;
}
