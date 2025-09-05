export interface Task {
  id: string;
  title: string;
  desc: string;
  status: "todo" | "inprogress" | "done";
  effort: number;
  tags: string[];
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  notes: Note[];
  order: number;
  execution?: string; // what to do (code/read)
  mindset?: string; // short philosophy prompt
  quizIds?: string[]; // reference to static quiz bank
  reflectionPrompts?: string[]; // pre-written prompts
}

export interface Note {
  at: string;
  text: string;
  type?: "reflection" | "snippet" | "link";
}

export interface Milestone {
  id: string;
  title: string;
  targetDate?: string;
  taskIds: string[];
  description?: string;
}

export interface Activity {
  type: string;
  taskId?: string;
  at: string;
  note?: string;
}

export interface QuizItem {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  tags?: string[];
  // Spaced repetition fields
  interval?: number;
  ease?: number;
  repetitions?: number;
  nextDue?: string;
}

export interface DailySnapshot {
  date: string;
  percent: number;
  trackerId: string;
}

export interface Tracker {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  settings: {
    progressMethod: "weighted" | "count";
    weightField?: string;
  };
  tasks: Record<string, Task>;
  milestones: Milestone[];
  activityLog: Activity[];
  templatesUsed?: string[];
}

export interface AppState {
  appMeta: {
    version: string;
    lastUpdated: string;
  };
  trackers: Record<string, Tracker>;
  snapshots?: DailySnapshot[]; // for sparkline/history
  quizItems?: Record<string, QuizItem>;
}

export interface ProgressStats {
  percent: number;
  completed: number;
  total: number;
  completedEffort: number;
  totalEffort: number;
}
