import {
  StreakData,
  StreakEntry,
  StreakStats,
  PersonalBest,
  RecoveryPlan,
} from "../types";

/**
 * Calculate streak statistics from streak data
 */
export function calculateStreakStats(streakData: StreakData): StreakStats {
  const { currentStreak, longestStreak, streakHistory } = streakData;

  // Calculate average streak
  const streaks = getStreakRuns(streakHistory);
  const averageStreak =
    streaks.length > 0
      ? Math.round(
          streaks.reduce((sum, streak) => sum + streak, 0) / streaks.length
        )
      : 0;

  // Calculate consistency score (percentage of days with activity)
  const totalDays = streakHistory.length;
  const activeDays = streakHistory.filter((entry) => entry.completed).length;
  const consistencyScore =
    totalDays > 0 ? Math.round((activeDays / totalDays) * 100) : 0;

  // Determine streak trend
  const recentStreaks = streaks.slice(-3); // Last 3 streaks
  let streakTrend: "increasing" | "decreasing" | "stable" = "stable";
  if (recentStreaks.length >= 2) {
    const latest = recentStreaks[recentStreaks.length - 1];
    const previous = recentStreaks[recentStreaks.length - 2];
    if (latest > previous) streakTrend = "increasing";
    else if (latest < previous) streakTrend = "decreasing";
  }

  // Find next milestone (next 10-day increment)
  const nextMilestone = Math.ceil(currentStreak / 10) * 10;
  const daysToNextMilestone = nextMilestone - currentStreak;

  return {
    currentStreak,
    longestStreak,
    averageStreak,
    totalStreaks: streaks.length,
    consistencyScore,
    streakTrend,
    nextMilestone: nextMilestone > currentStreak ? nextMilestone : undefined,
    daysToNextMilestone:
      nextMilestone > currentStreak ? daysToNextMilestone : undefined,
  };
}

/**
 * Get consecutive streak runs from history
 */
function getStreakRuns(history: StreakEntry[]): number[] {
  const runs: number[] = [];
  let currentRun = 0;

  for (const entry of history) {
    if (entry.completed) {
      currentRun++;
    } else {
      if (currentRun > 0) {
        runs.push(currentRun);
        currentRun = 0;
      }
    }
  }

  // Don't forget the last run if it's still active
  if (currentRun > 0) {
    runs.push(currentRun);
  }

  return runs;
}

/**
 * Update streak data based on today's activity
 */
export function updateStreakData(
  currentStreakData: StreakData | undefined,
  tasksCompleted: number,
  effortCompleted: number,
  goal: number = 1
): StreakData {
  const today = new Date().toISOString().split("T")[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  // Initialize streak data if it doesn't exist
  const streakData: StreakData = currentStreakData || {
    currentStreak: 0,
    longestStreak: 0,
    totalDaysActive: 0,
    streakHistory: [],
    personalBests: [],
    streakProtection: {
      isActive: false,
      protectionType: "grace_period",
      daysRemaining: 0,
    },
  };

  // Check if today's entry already exists
  const todayEntry = streakData.streakHistory.find(
    (entry) => entry.date === today
  );
  const goalMet = tasksCompleted >= goal;

  if (todayEntry) {
    // Update existing entry
    todayEntry.completed = goalMet;
    todayEntry.tasksCompleted = tasksCompleted;
    todayEntry.effortCompleted = effortCompleted;
    todayEntry.streakAtTime = streakData.currentStreak;
  } else {
    // Create new entry
    const newEntry: StreakEntry = {
      date: today,
      completed: goalMet,
      tasksCompleted,
      effortCompleted,
      streakAtTime: streakData.currentStreak,
    };
    streakData.streakHistory.push(newEntry);
  }

  // Update streak counters
  if (goalMet) {
    // Check if this continues the streak
    const yesterdayEntry = streakData.streakHistory.find(
      (entry) => entry.date === yesterday
    );
    const wasActiveYesterday = yesterdayEntry?.completed || false;

    if (wasActiveYesterday || streakData.currentStreak === 0) {
      streakData.currentStreak++;
      if (!streakData.streakStartDate) {
        streakData.streakStartDate = today;
      }
    } else {
      // New streak starting
      streakData.currentStreak = 1;
      streakData.streakStartDate = today;
    }

    streakData.totalDaysActive++;
  } else {
    // Streak broken
    if (streakData.currentStreak > 0) {
      // Activate streak protection if streak was significant
      if (streakData.currentStreak >= 7) {
        streakData.streakProtection = {
          isActive: true,
          protectionType: "grace_period",
          daysRemaining: 1,
          lastBreakDate: today,
        };
      }
    }
    streakData.currentStreak = 0;
    streakData.streakStartDate = undefined;
  }

  // Update longest streak
  if (streakData.currentStreak > streakData.longestStreak) {
    streakData.longestStreak = streakData.currentStreak;

    // Check for personal best
    updatePersonalBest(
      streakData,
      "longest_streak",
      streakData.currentStreak,
      today
    );
  }

  // Update other personal bests
  updatePersonalBest(streakData, "most_tasks_day", tasksCompleted, today);
  updatePersonalBest(streakData, "most_effort_day", effortCompleted, today);

  streakData.lastActivityDate = today;

  return streakData;
}

/**
 * Update personal best records
 */
function updatePersonalBest(
  streakData: StreakData,
  type: PersonalBest["type"],
  value: number,
  date: string,
  trackerId?: string
): void {
  const existing = streakData.personalBests.find((pb) => pb.type === type);

  if (!existing || value > existing.value) {
    const personalBest: PersonalBest = {
      id: `${type}_${Date.now()}`,
      type,
      value,
      date,
      trackerId,
      description: getPersonalBestDescription(type, value),
      achieved: true,
    };

    if (existing) {
      // Update existing record
      Object.assign(existing, personalBest);
    } else {
      // Add new record
      streakData.personalBests.push(personalBest);
    }
  }
}

/**
 * Get description for personal best type
 */
function getPersonalBestDescription(
  type: PersonalBest["type"],
  value: number
): string {
  switch (type) {
    case "longest_streak":
      return `Longest streak: ${value} days`;
    case "most_tasks_day":
      return `Most tasks in a day: ${value}`;
    case "most_effort_day":
      return `Most effort in a day: ${value}`;
    case "fastest_completion":
      return `Fastest completion: ${value} minutes`;
    default:
      return `Personal best: ${value}`;
  }
}

/**
 * Create a recovery plan for broken streaks
 */
export function createRecoveryPlan(
  streakData: StreakData,
  targetStreak: number = 30,
  planName: string = "Streak Recovery"
): RecoveryPlan {
  const milestones: RecoveryPlan["milestones"] = [
    { id: "milestone_1", targetDays: 3, reward: "Small win!", achieved: false },
    {
      id: "milestone_2",
      targetDays: 7,
      reward: "One week strong!",
      achieved: false,
    },
    {
      id: "milestone_3",
      targetDays: 14,
      reward: "Two weeks momentum!",
      achieved: false,
    },
    {
      id: "milestone_4",
      targetDays: 21,
      reward: "Three weeks habit!",
      achieved: false,
    },
    {
      id: "milestone_5",
      targetDays: targetStreak,
      reward: "Recovery complete!",
      achieved: false,
    },
  ];

  return {
    id: `recovery_${Date.now()}`,
    name: planName,
    description: `Get back to a ${targetStreak}-day streak`,
    targetStreak,
    milestones,
    isActive: true,
    startDate: new Date().toISOString().split("T")[0],
  };
}

/**
 * Check if streak protection should be activated
 */
export function shouldActivateStreakProtection(
  streakData: StreakData
): boolean {
  const { currentStreak, streakProtection } = streakData;

  // Don't activate if already active
  if (streakProtection.isActive) return false;

  // Activate for streaks of 7+ days
  return currentStreak >= 7;
}

/**
 * Get motivational message based on streak status
 */
export function getStreakMotivation(streakData: StreakData): string {
  const { currentStreak, longestStreak, streakProtection } = streakData;

  if (streakProtection.isActive) {
    return "Don't give up! You're in protection mode - one more day to save your streak!";
  }

  if (currentStreak === 0) {
    return "Ready to start a new streak? Every journey begins with a single step!";
  }

  if (currentStreak < 7) {
    return `Great start! ${
      7 - currentStreak
    } more days until you build a strong habit!`;
  }

  if (currentStreak < 30) {
    return `Amazing consistency! You're ${
      30 - currentStreak
    } days away from a month-long streak!`;
  }

  if (currentStreak >= longestStreak) {
    return `New personal record! You're at your longest streak ever - keep it going!`;
  }

  return `Incredible dedication! You're on a ${currentStreak}-day streak!`;
}

/**
 * Calculate streak investment value (psychological commitment)
 */
export function calculateStreakInvestment(streakData: StreakData): number {
  const { currentStreak, totalDaysActive, longestStreak } = streakData;

  // Base investment from current streak
  const streakValue = currentStreak * 10;

  // Bonus for total activity
  const activityBonus = totalDaysActive * 2;

  // Bonus for reaching personal records
  const recordBonus = currentStreak >= longestStreak ? 50 : 0;

  return streakValue + activityBonus + recordBonus;
}
