import { v4 as uuid } from "uuid";
import {
  Task,
  MicroReward,
  TaskReflection,
  CommitmentContract,
} from "../types";

/**
 * Calculate micro-rewards for task completion
 */
export function calculateMicroRewards(
  task: Task,
  streakCount: number,
  totalTasksCompleted: number
): MicroReward[] {
  const rewards: MicroReward[] = [];
  const now = new Date().toISOString();

  // Streak bonus
  if (streakCount > 0) {
    const streakValue = Math.min(streakCount * 2, 20); // Cap at 20 points
    rewards.push({
      id: uuid(),
      type: "streak_bonus",
      value: streakValue,
      message: `🔥 +${streakCount} day streak bonus!`,
      earnedAt: now,
      animation: "fire",
    });
  }

  // Effort bonus
  if (task.effort >= 5) {
    const effortValue = task.effort * 3;
    rewards.push({
      id: uuid(),
      type: "effort_bonus",
      value: effortValue,
      message: `💪 +${effortValue} effort bonus!`,
      earnedAt: now,
      animation: "strength",
    });
  }

  // Consistency bonus (every 10th task)
  if (totalTasksCompleted % 10 === 0 && totalTasksCompleted > 0) {
    rewards.push({
      id: uuid(),
      type: "consistency_bonus",
      value: 25,
      message: `⚡ +25 consistency bonus!`,
      earnedAt: now,
      animation: "lightning",
    });
  }

  // Milestone bonus (every 50th task)
  if (totalTasksCompleted % 50 === 0 && totalTasksCompleted > 0) {
    rewards.push({
      id: uuid(),
      type: "milestone_bonus",
      value: 100,
      message: `🏆 +100 milestone bonus!`,
      earnedAt: now,
      animation: "victory",
    });
  }

  return rewards;
}

/**
 * Create a commitment contract for a task
 */
export function createCommitmentContract(
  penalty?: string,
  reward?: string
): CommitmentContract {
  return {
    id: uuid(),
    isActive: true,
    penalty,
    reward,
    createdAt: new Date().toISOString(),
    activatedAt: new Date().toISOString(),
  };
}

/**
 * Create task reflection data
 */
export function createTaskReflection(
  feeling: TaskReflection["feeling"],
  note?: string
): TaskReflection {
  return {
    feeling,
    note,
    completedAt: new Date().toISOString(),
  };
}

/**
 * Get motivational message based on streak and progress
 */
export function getMotivationalMessage(
  streakCount: number,
  totalTasksCompleted: number,
  consistencyScore: number
): string {
  if (streakCount === 0) {
    return "Ready to start your journey? Every expert was once a beginner! 🌱";
  }

  if (streakCount < 7) {
    return `Great start! ${
      7 - streakCount
    } more days to build a strong habit! 🔥`;
  }

  if (streakCount < 30) {
    return `Amazing consistency! You're ${
      30 - streakCount
    } days away from a month-long streak! ⚡`;
  }

  if (streakCount >= 30) {
    return `Incredible dedication! You're on a ${streakCount}-day streak! 💎`;
  }

  if (totalTasksCompleted >= 100) {
    return `You've completed ${totalTasksCompleted} tasks! You're a productivity machine! 🏆`;
  }

  if (consistencyScore >= 80) {
    return `Your ${consistencyScore}% consistency is outstanding! Keep the momentum! 🎯`;
  }

  return "Every task completed is a step toward your goals! 💪";
}

/**
 * Calculate user level based on total points
 */
export function calculateUserLevel(totalPoints: number): number {
  // Level progression: 100, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000
  const levelThresholds = [
    0, 100, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000,
  ];

  for (let i = levelThresholds.length - 1; i >= 0; i--) {
    if (totalPoints >= levelThresholds[i]) {
      return i;
    }
  }

  return 0;
}

/**
 * Get level title based on level number
 */
export function getLevelTitle(level: number): string {
  const titles = [
    "🌱 Beginner",
    "🔥 Starter",
    "⚡ Rising",
    "💪 Strong",
    "🎯 Focused",
    "💎 Elite",
    "🏆 Master",
    "👑 Legend",
    "🌟 Immortal",
    "🚀 Transcendent",
    "✨ Divine",
  ];

  return titles[Math.min(level, titles.length - 1)];
}

/**
 * Get next level requirements
 */
export function getNextLevelRequirements(currentLevel: number): {
  nextLevel: number;
  pointsNeeded: number;
  pointsToNext: number;
} {
  const levelThresholds = [
    0, 100, 250, 500, 1000, 2000, 5000, 10000, 20000, 50000, 100000,
  ];

  const nextLevel = Math.min(currentLevel + 1, levelThresholds.length - 1);
  const pointsNeeded = levelThresholds[nextLevel];
  const pointsToNext = pointsNeeded - (levelThresholds[currentLevel] || 0);

  return {
    nextLevel,
    pointsNeeded,
    pointsToNext,
  };
}

/**
 * Check if user should receive a difficulty adjustment suggestion
 */
export function shouldSuggestDifficultyAdjustment(
  streakCount: number,
  recentMissedDays: number,
  averageEffort: number
): boolean {
  // Suggest easier tasks if:
  // 1. Streak is 0 and user missed 2+ days recently
  // 2. Average effort is high (7+) but streak is low
  // 3. User has been struggling for 3+ days

  return (
    (streakCount === 0 && recentMissedDays >= 2) ||
    (averageEffort >= 7 && streakCount < 3) ||
    recentMissedDays >= 3
  );
}

/**
 * Get difficulty adjustment suggestion
 */
export function getDifficultySuggestion(
  currentDifficulty: "easy" | "medium" | "hard",
  struggleLevel: "low" | "medium" | "high"
): {
  suggestedDifficulty: "easy" | "medium" | "hard";
  message: string;
} {
  if (struggleLevel === "high") {
    return {
      suggestedDifficulty: "easy",
      message:
        "💡 Try breaking this into smaller, easier steps. Consistency beats intensity!",
    };
  }

  if (struggleLevel === "medium" && currentDifficulty === "hard") {
    return {
      suggestedDifficulty: "medium",
      message:
        "🎯 Consider a medium difficulty approach. Steady progress is key!",
    };
  }

  if (struggleLevel === "low" && currentDifficulty === "easy") {
    return {
      suggestedDifficulty: "medium",
      message: "🚀 Ready to level up? Try medium difficulty for more growth!",
    };
  }

  return {
    suggestedDifficulty: currentDifficulty,
    message: "Keep going! You're doing great! 💪",
  };
}
