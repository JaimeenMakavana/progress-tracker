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
  // v2 Gamification features
  commitmentContract?: CommitmentContract;
  difficultyLevel?: "easy" | "medium" | "hard";
  reflectionData?: TaskReflection;
  microRewards?: MicroReward[];
}

export interface Note {
  at: string;
  text: string;
  type?: "reflection" | "snippet" | "link";
}

// Rich content blocks for Notion-like pages
export interface ContentBlock {
  id: string;
  type:
    | "text"
    | "heading"
    | "code"
    | "list"
    | "quote"
    | "divider"
    | "image"
    | "link";
  content: string;
  metadata?: {
    level?: number; // for headings (h1, h2, h3)
    language?: string; // for code blocks
    listType?: "bullet" | "numbered"; // for lists
    url?: string; // for links and images
    alt?: string; // for images
  };
  createdAt: string;
  updatedAt: string;
}

export interface TaskPage {
  taskId: string;
  title: string;
  blocks: ContentBlock[];
  createdAt: string;
  updatedAt: string;
  lastAccessedAt?: string;
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
  groupId?: string; // Reference to the group this tracker belongs to
  settings: {
    progressMethod: "weighted" | "count";
    weightField?: string;
    streakEnabled?: boolean;
    streakGoal?: number; // Daily goal for streak maintenance
  };
  tasks: Record<string, Task>;
  milestones: Milestone[];
  activityLog: Activity[];
  templatesUsed?: string[];
  streakData?: StreakData;
}

export interface TrackerGroup {
  id: string;
  name: string;
  description?: string;
  color?: string; // Hex color for visual identification
  createdAt: string;
  updatedAt: string;
  order: number; // For sorting groups
}

export interface AppState {
  appMeta: {
    version: string;
    lastUpdated: string;
  };
  trackers: Record<string, Tracker>;
  trackerGroups: Record<string, TrackerGroup>; // Groups for organizing trackers
  snapshots?: DailySnapshot[]; // for sparkline/history
  quizItems?: Record<string, QuizItem>;
  taskPages?: Record<string, TaskPage>; // Rich task pages
  // v2 Gamification features
  userProfile?: UserProfile;
  challenges?: Record<string, Challenge>;
  globalAchievements?: Record<string, Achievement>;
}

export interface ProgressStats {
  percent: number;
  completed: number;
  total: number;
  completedEffort: number;
  totalEffort: number;
}

export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: "credit" | "debit";
  platform: "phonepe" | "googlepay" | "paytm" | "bank" | "other";
  description: string;
  merchant?: string;
  category?: string;
  date: string;
  referenceId?: string;
  status: "completed" | "pending" | "failed";
  tags?: string[];
  notes?: string;
}

export interface TransactionStats {
  totalIncome: number;
  totalExpense: number;
  netAmount: number;
  transactionCount: number;
  platformBreakdown: Record<string, number>;
  categoryBreakdown: Record<string, number>;
}

// Streak Tracking Types
export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalDaysActive: number;
  lastActivityDate?: string;
  streakStartDate?: string;
  streakHistory: StreakEntry[];
  personalBests: PersonalBest[];
  streakProtection: StreakProtection;
}

export interface StreakEntry {
  date: string;
  completed: boolean;
  tasksCompleted: number;
  effortCompleted: number;
  streakAtTime: number;
  notes?: string;
}

export interface PersonalBest {
  id: string;
  type:
    | "longest_streak"
    | "most_tasks_day"
    | "most_effort_day"
    | "fastest_completion";
  value: number;
  date: string;
  trackerId?: string;
  description: string;
  achieved: boolean;
}

export interface StreakProtection {
  isActive: boolean;
  protectionType: "grace_period" | "recovery_mode" | "maintenance_mode";
  daysRemaining: number;
  lastBreakDate?: string;
  recoveryPlan?: RecoveryPlan;
}

export interface RecoveryPlan {
  id: string;
  name: string;
  description: string;
  targetStreak: number;
  milestones: RecoveryMilestone[];
  isActive: boolean;
  startDate: string;
}

export interface RecoveryMilestone {
  id: string;
  targetDays: number;
  reward?: string;
  achieved: boolean;
  achievedDate?: string;
}

export interface StreakStats {
  currentStreak: number;
  longestStreak: number;
  averageStreak: number;
  totalStreaks: number;
  consistencyScore: number; // 0-100
  streakTrend: "increasing" | "decreasing" | "stable";
  nextMilestone?: number;
  daysToNextMilestone?: number;
}

// v2 Gamification Types
export interface CommitmentContract {
  id: string;
  isActive: boolean;
  penalty?: string;
  reward?: string;
  createdAt: string;
  activatedAt?: string;
}

export interface TaskReflection {
  feeling: "😌" | "💪" | "⚡" | "😤" | "🎯" | "🔥" | "💎" | "🏆";
  note?: string;
  completedAt: string;
}

export interface MicroReward {
  id: string;
  type:
    | "streak_bonus"
    | "effort_bonus"
    | "consistency_bonus"
    | "milestone_bonus";
  value: number;
  message: string;
  earnedAt: string;
  animation?: string;
}

export interface Challenge {
  id: string;
  name: string;
  description: string;
  type: "streak_sprint" | "effort_marathon" | "consistency_challenge";
  duration: number; // days
  target: number;
  reward: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  progress: number;
  participants?: string[];
}

export interface UserProfile {
  identityBadges: string[];
  currentIdentity: string;
  totalPoints: number;
  level: number;
  achievements: Achievement[];
  preferences: {
    enableAnimations: boolean;
    enableSounds: boolean;
    difficultyPreference: "easy" | "medium" | "hard";
  };
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: "streak" | "effort" | "consistency" | "milestone";
}
