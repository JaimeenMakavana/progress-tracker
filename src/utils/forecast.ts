import { Tracker, DailySnapshot, Activity } from "../types";

export interface VelocityStats {
  daily: number;
  weekly: number;
  monthly: number;
  trend: "increasing" | "decreasing" | "stable";
}

export interface ForecastData {
  estimatedCompletion: string;
  confidence: "high" | "medium" | "low";
  velocity: VelocityStats;
  bottlenecks: string[];
  recommendations: string[];
}

export function calculateVelocity(
  tracker: Tracker,
  snapshots: DailySnapshot[] = [],
  weeks: number = 4
): VelocityStats {
  const now = new Date();
  const startDate = new Date(now.getTime() - weeks * 7 * 24 * 60 * 60 * 1000);

  // Filter snapshots to the specified period
  const recentSnapshots = snapshots.filter(
    (s) => s.trackerId === tracker.id && new Date(s.date) >= startDate
  );

  if (recentSnapshots.length < 2) {
    return {
      daily: 0,
      weekly: 0,
      monthly: 0,
      trend: "stable",
    };
  }

  // Calculate daily velocity (tasks completed per day)
  const completedActivities = tracker.activityLog.filter(
    (activity) =>
      activity.type === "complete" && new Date(activity.at) >= startDate
  );

  const dailyVelocity = completedActivities.length / (weeks * 7);
  const weeklyVelocity = dailyVelocity * 7;
  const monthlyVelocity = dailyVelocity * 30;

  // Calculate trend
  const firstHalf = recentSnapshots.slice(
    0,
    Math.floor(recentSnapshots.length / 2)
  );
  const secondHalf = recentSnapshots.slice(
    Math.floor(recentSnapshots.length / 2)
  );

  const firstHalfAvg =
    firstHalf.reduce((sum, s) => sum + s.percent, 0) / firstHalf.length;
  const secondHalfAvg =
    secondHalf.reduce((sum, s) => sum + s.percent, 0) / secondHalf.length;

  let trend: "increasing" | "decreasing" | "stable" = "stable";
  if (secondHalfAvg > firstHalfAvg + 5) trend = "increasing";
  else if (secondHalfAvg < firstHalfAvg - 5) trend = "decreasing";

  return {
    daily: Math.round(dailyVelocity * 100) / 100,
    weekly: Math.round(weeklyVelocity * 100) / 100,
    monthly: Math.round(monthlyVelocity * 100) / 100,
    trend,
  };
}

export function generateForecast(
  tracker: Tracker,
  snapshots: DailySnapshot[] = []
): ForecastData {
  const velocity = calculateVelocity(tracker, snapshots);
  const totalTasks = Object.keys(tracker.tasks).length;
  const completedTasks = Object.values(tracker.tasks).filter(
    (t) => t.status === "done"
  ).length;
  const remainingTasks = totalTasks - completedTasks;

  // Calculate estimated completion
  let estimatedDays = 0;
  let confidence: "high" | "medium" | "low" = "low";

  if (velocity.daily > 0) {
    estimatedDays = Math.ceil(remainingTasks / velocity.daily);
    confidence =
      velocity.daily > 1 ? "high" : velocity.daily > 0.5 ? "medium" : "low";
  } else {
    estimatedDays = 999; // No progress, can't estimate
    confidence = "low";
  }

  const estimatedCompletion = new Date(
    Date.now() + estimatedDays * 24 * 60 * 60 * 1000
  )
    .toISOString()
    .split("T")[0];

  // Identify bottlenecks
  const bottlenecks: string[] = [];
  const tasks = Object.values(tracker.tasks);

  // Tasks stuck in progress for too long
  const stuckTasks = tasks.filter((task) => {
    if (task.status !== "inprogress" || !task.startedAt) return false;
    const daysSinceStart =
      (Date.now() - new Date(task.startedAt).getTime()) / (1000 * 60 * 60 * 24);
    return daysSinceStart > 7; // Stuck for more than a week
  });

  if (stuckTasks.length > 0) {
    bottlenecks.push(`${stuckTasks.length} task(s) stuck in progress`);
  }

  // High effort tasks not started
  const highEffortTasks = tasks.filter(
    (task) => task.status === "todo" && task.effort >= 4
  );

  if (highEffortTasks.length > 0) {
    bottlenecks.push(
      `${highEffortTasks.length} high-effort task(s) not started`
    );
  }

  // No recent activity
  const recentActivity = tracker.activityLog.filter((activity) => {
    const daysSince =
      (Date.now() - new Date(activity.at).getTime()) / (1000 * 60 * 60 * 24);
    return daysSince <= 7;
  });

  if (recentActivity.length === 0) {
    bottlenecks.push("No recent activity");
  }

  // Generate recommendations
  const recommendations: string[] = [];

  if (velocity.daily < 0.5) {
    recommendations.push(
      "Consider breaking down large tasks into smaller ones"
    );
  }

  if (stuckTasks.length > 0) {
    recommendations.push("Review and potentially reassess stuck tasks");
  }

  if (highEffortTasks.length > 0) {
    recommendations.push(
      "Start working on high-effort tasks to build momentum"
    );
  }

  if (velocity.trend === "decreasing") {
    recommendations.push(
      "Focus on consistency - even small daily progress adds up"
    );
  }

  if (recommendations.length === 0) {
    recommendations.push("Keep up the great work!");
  }

  return {
    estimatedCompletion,
    confidence,
    velocity,
    bottlenecks,
    recommendations,
  };
}

export function calculateStreak(tracker: Tracker): number {
  const activities = tracker.activityLog
    .filter((activity) => activity.type === "complete")
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());

  if (activities.length === 0) return 0;

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const activity of activities) {
    const activityDate = new Date(activity.at);
    activityDate.setHours(0, 0, 0, 0);

    if (activityDate.getTime() === currentDate.getTime()) {
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    } else if (activityDate.getTime() < currentDate.getTime()) {
      break;
    }
  }

  return streak;
}

export function getProgressInsights(
  tracker: Tracker,
  snapshots: DailySnapshot[] = []
): string[] {
  const insights: string[] = [];
  const forecast = generateForecast(tracker, snapshots);
  const streak = calculateStreak(tracker);

  if (streak > 0) {
    insights.push(`You're on a ${streak}-day completion streak! 🔥`);
  }

  if (forecast.velocity.trend === "increasing") {
    insights.push("Your progress is accelerating - great momentum!");
  }

  if (forecast.confidence === "high") {
    insights.push(`On track to complete by ${forecast.estimatedCompletion}`);
  }

  if (forecast.bottlenecks.length === 0) {
    insights.push("No major bottlenecks detected - smooth sailing!");
  }

  return insights;
}
