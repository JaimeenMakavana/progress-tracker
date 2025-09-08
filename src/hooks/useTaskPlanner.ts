import { useState, useCallback } from "react";
import { useAIAgent } from "./useAIAgent";
import {
  UserContext,
  TaskBreakdown,
  WorkPatterns,
  Timeline,
  DependencyGraph,
} from "../types/ai";
import { Task } from "../types";

export interface UseTaskPlannerReturn {
  breakDownGoal: (
    goal: string,
    context?: Partial<UserContext>
  ) => Promise<TaskBreakdown>;
  suggestOptimalOrder: (
    tasks: Task[],
    userPatterns?: WorkPatterns
  ) => Promise<Task[]>;
  estimateTimeline: (tasks: Task[]) => Promise<Timeline>;
  identifyDependencies: (tasks: Task[]) => Promise<DependencyGraph>;
  isLoading: boolean;
  error: string | null;
  lastBreakdown: TaskBreakdown | null;
}

export function useTaskPlanner(): UseTaskPlannerReturn {
  const { aiAgent, isLoading: aiLoading, error: aiError } = useAIAgent();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastBreakdown, setLastBreakdown] = useState<TaskBreakdown | null>(
    null
  );

  const breakDownGoal = useCallback(
    async (
      goal: string,
      context: Partial<UserContext> = {}
    ): Promise<TaskBreakdown> => {
      if (!aiAgent?.isReady()) {
        throw new Error("AI Agent is not ready");
      }

      setIsLoading(true);
      setError(null);

      try {
        // Default context
        const defaultContext: UserContext = {
          experienceLevel: "intermediate",
          availableTime: 2,
          preferredDifficulty: "medium",
          learningStyle: "hands-on",
          currentSkills: ["javascript", "react"],
          ...context,
        };

        console.log("🤖 Breaking down goal:", goal);
        const breakdown = await aiAgent.taskPlanner.breakDownGoal(
          goal,
          defaultContext
        );

        setLastBreakdown(breakdown);
        return breakdown;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to break down goal";
        setError(errorMessage);
        console.error("❌ Task breakdown failed:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [aiAgent]
  );

  const suggestOptimalOrder = useCallback(
    async (
      tasks: Task[],
      userPatterns: WorkPatterns = {
        mostProductiveHours: [9, 10, 11, 14, 15, 16],
        averageSessionLength: 2,
        preferredTaskTypes: ["development", "learning"],
        completionRate: 0.8,
        difficultyPreference: "medium",
      }
    ): Promise<Task[]> => {
      if (!aiAgent?.isReady()) {
        throw new Error("AI Agent is not ready");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("🤖 Optimizing task order...");
        const orderedTasks = await aiAgent.taskPlanner.suggestOptimalOrder(
          tasks,
          userPatterns
        );
        return orderedTasks;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to optimize task order";
        setError(errorMessage);
        console.error("❌ Task ordering failed:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [aiAgent]
  );

  const estimateTimeline = useCallback(
    async (tasks: Task[]): Promise<Timeline> => {
      if (!aiAgent?.isReady()) {
        throw new Error("AI Agent is not ready");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("🤖 Estimating timeline...");
        const timeline = await aiAgent.taskPlanner.estimateRealisticTimeline(
          tasks
        );
        return timeline;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to estimate timeline";
        setError(errorMessage);
        console.error("❌ Timeline estimation failed:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [aiAgent]
  );

  const identifyDependencies = useCallback(
    async (tasks: Task[]): Promise<DependencyGraph> => {
      if (!aiAgent?.isReady()) {
        throw new Error("AI Agent is not ready");
      }

      setIsLoading(true);
      setError(null);

      try {
        console.log("🤖 Identifying dependencies...");
        const dependencies = await aiAgent.taskPlanner.identifyDependencies(
          tasks
        );
        return dependencies;
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Failed to identify dependencies";
        setError(errorMessage);
        console.error("❌ Dependency identification failed:", err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [aiAgent]
  );

  return {
    breakDownGoal,
    suggestOptimalOrder,
    estimateTimeline,
    identifyDependencies,
    isLoading: isLoading || aiLoading,
    error: error || aiError,
    lastBreakdown,
  };
}
