import { QuizItem } from "../types";

export interface SpacedRepetitionResult {
  interval: number;
  repetitions: number;
  ease: number;
  nextDue: string;
}

export interface ReviewSession {
  quizItem: QuizItem;
  grade: "again" | "hard" | "good" | "easy";
  reviewTime: string;
}

// SM-2 Algorithm implementation
export function calculateNextReview(
  quizItem: QuizItem,
  grade: "again" | "hard" | "good" | "easy"
): SpacedRepetitionResult {
  let { interval = 1, repetitions = 0, ease = 2.5 } = quizItem;

  // Update ease factor based on grade
  ease =
    ease +
    (0.1 -
      (5 - getGradeValue(grade)) * (0.08 + (5 - getGradeValue(grade)) * 0.02));
  ease = Math.max(1.3, ease); // Minimum ease factor

  if (grade === "again") {
    repetitions = 0;
    interval = 1;
  } else if (grade === "hard") {
    repetitions = repetitions + 1;
    interval = Math.max(1, Math.round(interval * 1.2));
  } else if (grade === "good") {
    repetitions = repetitions + 1;
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 6;
    } else {
      interval = Math.round(interval * ease);
    }
  } else if (grade === "easy") {
    repetitions = repetitions + 1;
    interval = Math.round(interval * ease * 1.3);
  }

  // Calculate next due date
  const nextDue = new Date();
  nextDue.setDate(nextDue.getDate() + interval);

  return {
    interval,
    repetitions,
    ease: Math.round(ease * 100) / 100,
    nextDue: nextDue.toISOString(),
  };
}

function getGradeValue(grade: "again" | "hard" | "good" | "easy"): number {
  switch (grade) {
    case "again":
      return 0;
    case "hard":
      return 3;
    case "good":
      return 4;
    case "easy":
      return 5;
    default:
      return 3;
  }
}

export function getDueQuizItems(
  quizItems: Record<string, QuizItem>
): QuizItem[] {
  const now = new Date();

  return Object.values(quizItems)
    .filter((item) => {
      if (!item.nextDue) return true; // New items are due immediately
      return new Date(item.nextDue) <= now;
    })
    .sort((a, b) => {
      // Sort by due date, with overdue items first
      const aDue = a.nextDue ? new Date(a.nextDue) : new Date(0);
      const bDue = b.nextDue ? new Date(b.nextDue) : new Date(0);
      return aDue.getTime() - bDue.getTime();
    });
}

export function getQuizStats(quizItems: Record<string, QuizItem>): {
  total: number;
  due: number;
  overdue: number;
  new: number;
  mastered: number;
} {
  const now = new Date();
  const items = Object.values(quizItems);

  const total = items.length;
  const due = items.filter((item) => {
    if (!item.nextDue) return false;
    return new Date(item.nextDue) <= now;
  }).length;

  const overdue = items.filter((item) => {
    if (!item.nextDue) return false;
    const dueDate = new Date(item.nextDue);
    return (
      dueDate < now && dueDate < new Date(now.getTime() - 24 * 60 * 60 * 1000)
    );
  }).length;

  const newItems = items.filter((item) => !item.nextDue).length;
  const mastered = items.filter(
    (item) =>
      item.repetitions &&
      item.repetitions >= 5 &&
      item.interval &&
      item.interval >= 30
  ).length;

  return {
    total,
    due,
    overdue,
    new: newItems,
    mastered,
  };
}

export function generateReviewSchedule(quizItems: Record<string, QuizItem>): {
  today: QuizItem[];
  tomorrow: QuizItem[];
  thisWeek: QuizItem[];
  nextWeek: QuizItem[];
} {
  const now = new Date();
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000);

  const items = Object.values(quizItems);

  return {
    today: items.filter((item) => {
      if (!item.nextDue) return true;
      const dueDate = new Date(item.nextDue);
      return dueDate <= now;
    }),
    tomorrow: items.filter((item) => {
      if (!item.nextDue) return false;
      const dueDate = new Date(item.nextDue);
      return dueDate > now && dueDate <= tomorrow;
    }),
    thisWeek: items.filter((item) => {
      if (!item.nextDue) return false;
      const dueDate = new Date(item.nextDue);
      return dueDate > tomorrow && dueDate <= weekFromNow;
    }),
    nextWeek: items.filter((item) => {
      if (!item.nextDue) return false;
      const dueDate = new Date(item.nextDue);
      return dueDate > weekFromNow && dueDate <= twoWeeksFromNow;
    }),
  };
}

export function calculateRetentionRate(
  quizItems: Record<string, QuizItem>
): number {
  const items = Object.values(quizItems);
  if (items.length === 0) return 0;

  const now = new Date();
  const recentlyReviewed = items.filter((item) => {
    if (!item.nextDue) return false;
    const dueDate = new Date(item.nextDue);
    const daysSinceDue =
      (now.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceDue <= 7; // Reviewed within a week of due date
  });

  return Math.round((recentlyReviewed.length / items.length) * 100);
}

export function getOptimalReviewTime(): string {
  // Suggest optimal review times based on research
  const now = new Date();
  const morning = new Date(now);
  morning.setHours(9, 0, 0, 0);

  const afternoon = new Date(now);
  afternoon.setHours(15, 0, 0, 0);

  const evening = new Date(now);
  evening.setHours(20, 0, 0, 0);

  const currentHour = now.getHours();

  if (currentHour < 9) {
    return morning.toLocaleTimeString();
  } else if (currentHour < 15) {
    return afternoon.toLocaleTimeString();
  } else {
    return evening.toLocaleTimeString();
  }
}
