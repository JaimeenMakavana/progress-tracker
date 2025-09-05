import { Tracker, Task, ProgressStats } from "../types";

export function calculateProgress(tracker: Tracker): ProgressStats {
  const tasks = Object.values(tracker.tasks);
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;

  if (total === 0) {
    return {
      percent: 0,
      completed: 0,
      total: 0,
      completedEffort: 0,
      totalEffort: 0,
    };
  }

  const totalEffort = tasks.reduce((sum, task) => sum + task.effort, 0);
  const completedEffort = tasks
    .filter((t) => t.status === "done")
    .reduce((sum, task) => sum + task.effort, 0);

  let percent: number;
  if (tracker.settings.progressMethod === "weighted") {
    percent =
      totalEffort > 0 ? Math.round((completedEffort / totalEffort) * 100) : 0;
  } else {
    percent = Math.round((completed / total) * 100);
  }

  return {
    percent,
    completed,
    total,
    completedEffort,
    totalEffort,
  };
}

export function getNextTask(tracker: Tracker): Task | null {
  const tasks = Object.values(tracker.tasks)
    .filter((t) => t.status === "todo")
    .sort((a, b) => a.order - b.order);

  return tasks.length > 0 ? tasks[0] : null;
}

export function getRecentActivity(tracker: Tracker, limit: number = 10) {
  return tracker.activityLog.slice(0, limit);
}

export function getTasksByStatus(
  tracker: Tracker,
  status: "todo" | "inprogress" | "done"
) {
  return Object.values(tracker.tasks)
    .filter((t) => t.status === status)
    .sort((a, b) => a.order - b.order);
}

export function getTasksByTag(tracker: Tracker, tag: string) {
  return Object.values(tracker.tasks)
    .filter((t) => t.tags.includes(tag))
    .sort((a, b) => a.order - b.order);
}
