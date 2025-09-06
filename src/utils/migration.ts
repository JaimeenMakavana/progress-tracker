import { AppState, Tracker, Task, Note, Milestone, Activity } from "../types";

export interface MigrationResult {
  success: boolean;
  migratedState?: AppState;
  error?: string;
}

export function migrateState(oldState: unknown): MigrationResult {
  try {
    // Check if it's already v2
    if ((oldState as AppState).appMeta?.version === "2.0.0") {
      return { success: true, migratedState: oldState as AppState };
    }

    // Migrate from v1 to v2
    if (
      (oldState as AppState).appMeta?.version === "0.1.0" ||
      !(oldState as AppState).appMeta
    ) {
      const migratedState: AppState = {
        appMeta: {
          version: "2.0.0",
          lastUpdated: new Date().toISOString(),
        },
        trackers: (oldState as AppState).trackers || {},
        trackerGroups: (oldState as AppState).trackerGroups || {},
        snapshots: [],
        quizItems: {},
      };

      // Migrate trackers to new format
      Object.values(migratedState.trackers).forEach((tracker: Tracker) => {
        // Update activity log format
        if (tracker.activityLog) {
          tracker.activityLog = tracker.activityLog.map(
            (activity: Activity) => ({
              type: activity.type,
              taskId: activity.taskId,
              at: activity.at,
              note: activity.note,
            })
          );
        }

        // Update tasks to new format
        Object.values(tracker.tasks).forEach((task: Task) => {
          // Convert old notes format to new format
          if (task.notes) {
            task.notes = task.notes.map((note: Note) => ({
              at: note.at,
              text: note.text,
              type: "reflection", // Default type for old notes
            }));
          }

          // Add new fields with defaults
          task.execution = task.execution || "";
          task.mindset = task.mindset || "";
          task.quizIds = task.quizIds || [];
          task.reflectionPrompts = task.reflectionPrompts || [];
        });

        // Update milestones to new format
        tracker.milestones = tracker.milestones.map((milestone: Milestone) => ({
          id: milestone.id,
          title: milestone.title,
          targetDate: milestone.targetDate || "",
          taskIds: milestone.taskIds || [],
          description: milestone.description || "",
        }));

        // Add new fields
        tracker.templatesUsed = tracker.templatesUsed || [];
      });

      return { success: true, migratedState };
    }

    // Unknown version
    return {
      success: false,
      error: `Unknown version: ${
        (oldState as AppState).appMeta?.version || "unknown"
      }`,
    };
  } catch (error) {
    return {
      success: false,
      error: `Migration failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}

export function loadDefaultRoadmap(): AppState {
  // This would typically load from the personal-roadmap.json file
  // For now, return a basic structure
  return {
    appMeta: {
      version: "2.0.0",
      lastUpdated: new Date().toISOString(),
    },
    trackers: {},
    trackerGroups: {},
    snapshots: [],
    quizItems: {},
  };
}

export function validateState(state: unknown): boolean {
  try {
    // Basic validation
    if (!state || typeof state !== "object") return false;
    const appState = state as AppState;
    if (!appState.appMeta || typeof appState.appMeta !== "object") return false;
    if (
      !appState.appMeta.version ||
      typeof appState.appMeta.version !== "string"
    )
      return false;
    if (!appState.trackers || typeof appState.trackers !== "object")
      return false;

    return true;
  } catch {
    return false;
  }
}

export function createBackup(state: AppState): string {
  const backup = {
    ...state,
    appMeta: {
      ...state.appMeta,
      backupCreated: new Date().toISOString(),
    },
  };

  return JSON.stringify(backup, null, 2);
}

export function restoreFromBackup(backupData: string): MigrationResult {
  try {
    const backup = JSON.parse(backupData);

    if (!validateState(backup)) {
      return { success: false, error: "Invalid backup data" };
    }

    // Remove backup metadata
    delete backup.appMeta.backupCreated;

    return { success: true, migratedState: backup };
  } catch (error) {
    return {
      success: false,
      error: `Failed to restore backup: ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
