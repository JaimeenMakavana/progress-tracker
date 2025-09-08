import { LLMProviderImpl } from "../llm/LLMProvider";
import {
  UserContext,
  TaskBreakdown,
  JSONSchema,
  WorkPatterns,
  Timeline,
  DependencyGraph,
} from "../../../types/ai";
import { Task } from "../../../types";

export interface TaskNode {
  id: string;
  task: Task;
  estimatedDuration: number;
  dependencies: string[];
  dependents: string[];
}

export interface DependencyEdge {
  from: string;
  to: string;
  type: "blocks" | "enables" | "suggests";
}

export class AITaskPlanner {
  private llmProvider: LLMProviderImpl;
  private cache: Map<string, TaskBreakdown> = new Map();
  private readonly CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

  constructor(llmProvider: LLMProviderImpl) {
    this.llmProvider = llmProvider;
  }

  async breakDownGoal(
    goal: string,
    context: UserContext
  ): Promise<TaskBreakdown> {
    // Check cache first
    const cacheKey = this.generateCacheKey(goal, context);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      console.log("📦 Using cached task breakdown");
      return cached;
    }

    try {
      const prompt = this.buildTaskBreakdownPrompt(goal, context);
      const schema = this.getTaskBreakdownSchema();

      console.log("🤖 Generating task breakdown...");
      const response = await this.llmProvider.generateStructured<TaskBreakdown>(
        prompt,
        schema,
        { maxTokens: 2048, temperature: 0.7 }
      );

      // Validate and enhance the response
      const enhancedBreakdown = this.enhanceTaskBreakdown(response, context);

      // Cache the result
      this.cache.set(cacheKey, enhancedBreakdown);

      return enhancedBreakdown;
    } catch (error) {
      console.error("Failed to generate task breakdown:", error);

      // Return fallback breakdown
      return this.createFallbackBreakdown(goal, context);
    }
  }

  async suggestOptimalOrder(
    tasks: Task[],
    userPatterns: WorkPatterns
  ): Promise<Task[]> {
    try {
      const prompt = this.buildTaskOrderingPrompt(tasks, userPatterns);
      const schema = this.getTaskOrderingSchema();

      console.log("🤖 Optimizing task order...");
      const response = await this.llmProvider.generateStructured<{
        orderedTasks: number[];
      }>(prompt, schema, { maxTokens: 1024, temperature: 0.5 });

      return this.applyTaskOrdering(tasks, response.orderedTasks);
    } catch (error) {
      console.error("Failed to optimize task order:", error);
      return tasks; // Return original order as fallback
    }
  }

  async estimateRealisticTimeline(tasks: Task[]): Promise<Timeline> {
    try {
      const prompt = this.buildTimelinePrompt(tasks);
      const schema = this.getTimelineSchema();

      console.log("🤖 Estimating timeline...");
      const response = await this.llmProvider.generateStructured<Timeline>(
        prompt,
        schema,
        { maxTokens: 1024, temperature: 0.3 }
      );

      return response;
    } catch (error) {
      console.error("Failed to estimate timeline:", error);
      return this.createFallbackTimeline(tasks);
    }
  }

  async identifyDependencies(tasks: Task[]): Promise<DependencyGraph> {
    try {
      const prompt = this.buildDependencyPrompt(tasks);
      const schema = this.getDependencySchema();

      console.log("🤖 Identifying dependencies...");
      const response =
        await this.llmProvider.generateStructured<DependencyGraph>(
          prompt,
          schema,
          { maxTokens: 1536, temperature: 0.4 }
        );

      return response;
    } catch (error) {
      console.error("Failed to identify dependencies:", error);
      return this.createFallbackDependencyGraph(tasks);
    }
  }

  private buildTaskBreakdownPrompt(goal: string, context: UserContext): string {
    return `
You are an expert productivity coach and task breakdown specialist. Break down this goal into actionable tasks.

GOAL: "${goal}"

USER CONTEXT:
- Experience Level: ${context.experienceLevel}
- Available Time: ${context.availableTime} hours/day
- Preferred Difficulty: ${context.preferredDifficulty}
- Learning Style: ${context.learningStyle}

TASK BREAKDOWN REQUIREMENTS:
1. Create 5-8 specific, actionable tasks
2. Each task should be completable in 1-4 hours
3. Include clear execution instructions
4. Provide realistic effort estimates (1-5 scale)
5. Identify prerequisites and dependencies
6. Set clear success criteria
7. Suggest optimal time allocation
8. Consider the user's experience level and available time

Make tasks progressively challenging but achievable. Start with foundational tasks and build up to more complex ones.
    `.trim();
  }

  private buildTaskOrderingPrompt(
    tasks: Task[],
    userPatterns: WorkPatterns
  ): string {
    const taskList = tasks
      .map(
        (task, index) =>
          `${index + 1}. ${task.title} (Effort: ${task.effort}/5)`
      )
      .join("\n");

    return `
Optimize the order of these tasks based on user productivity patterns:

TASKS:
${taskList}

USER PATTERNS:
- Most Productive Hours: ${userPatterns.mostProductiveHours.join(", ")}
- Average Session Length: ${userPatterns.averageSessionLength} hours
- Preferred Task Types: ${userPatterns.preferredTaskTypes.join(", ")}
- Completion Rate: ${userPatterns.completionRate}%
- Difficulty Preference: ${userPatterns.difficultyPreference}

OPTIMIZATION CRITERIA:
1. Start with easier tasks to build momentum
2. Group similar tasks together
3. Consider energy levels and session length
4. Balance difficulty throughout the day
5. Ensure logical dependencies are respected

Return the optimal order as an array of task indices (0-based).
    `.trim();
  }

  private buildTimelinePrompt(tasks: Task[]): string {
    const taskList = tasks
      .map((task) => `- ${task.title} (Effort: ${task.effort}/5)`)
      .join("\n");

    return `
Estimate a realistic timeline for completing these tasks:

TASKS:
${taskList}

Consider:
- Task complexity and effort levels
- Dependencies between tasks
- Realistic daily work capacity
- Buffer time for unexpected delays
- Learning curve for new concepts

Provide a detailed timeline with milestones and critical path.
    `.trim();
  }

  private buildDependencyPrompt(tasks: Task[]): string {
    const taskList = tasks
      .map((task, index) => `${index + 1}. ${task.title} - ${task.desc}`)
      .join("\n");

    return `
Analyze these tasks and identify dependencies:

TASKS:
${taskList}

Identify:
1. Which tasks must be completed before others
2. Which tasks can be done in parallel
3. Critical path through the task sequence
4. Potential bottlenecks

Return a dependency graph with nodes and edges.
    `.trim();
  }

  private getTaskBreakdownSchema(): JSONSchema {
    return {
      type: "object",
      properties: {
        description: { type: "string" },
        estimatedTotalTime: { type: "string" },
        difficulty: {
          type: "string",
          enum: ["beginner", "intermediate", "advanced"],
        },
        tasks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              title: { type: "string" },
              description: { type: "string" },
              execution: { type: "string" },
              effort: { type: "number", minimum: 1, maximum: 5 },
              estimatedTime: { type: "string" },
              prerequisites: { type: "array", items: { type: "string" } },
              successCriteria: { type: "string" },
              tags: { type: "array", items: { type: "string" } },
              order: { type: "number" },
            },
            required: [
              "title",
              "description",
              "execution",
              "effort",
              "estimatedTime",
              "successCriteria",
              "tags",
              "order",
            ],
          },
        },
      },
      required: ["description", "estimatedTotalTime", "difficulty", "tasks"],
    };
  }

  private getTaskOrderingSchema(): JSONSchema {
    return {
      type: "object",
      properties: {
        orderedTasks: {
          type: "array",
          items: { type: "number" },
        },
      },
      required: ["orderedTasks"],
    };
  }

  private getTimelineSchema(): JSONSchema {
    return {
      type: "object",
      properties: {
        estimatedDays: { type: "number" },
        estimatedHours: { type: "number" },
        milestones: {
          type: "array",
          items: {
            type: "object",
            properties: {
              name: { type: "string" },
              estimatedCompletion: { type: "string" },
              tasks: { type: "array", items: { type: "string" } },
              dependencies: { type: "array", items: { type: "string" } },
            },
          },
        },
        criticalPath: { type: "array", items: { type: "string" } },
      },
      required: [
        "estimatedDays",
        "estimatedHours",
        "milestones",
        "criticalPath",
      ],
    };
  }

  private getDependencySchema(): JSONSchema {
    return {
      type: "object",
      properties: {
        nodes: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              task: { type: "object" },
              estimatedDuration: { type: "number" },
              dependencies: { type: "array", items: { type: "string" } },
              dependents: { type: "array", items: { type: "string" } },
            },
          },
        },
        edges: {
          type: "array",
          items: {
            type: "object",
            properties: {
              from: { type: "string" },
              to: { type: "string" },
              type: { type: "string", enum: ["blocks", "enables", "suggests"] },
            },
          },
        },
        criticalPath: { type: "array", items: { type: "string" } },
      },
      required: ["nodes", "edges", "criticalPath"],
    };
  }

  private enhanceTaskBreakdown(
    breakdown: TaskBreakdown,
    context: UserContext
  ): TaskBreakdown {
    // Add execution details and optimize for user context
    const enhancedTasks = breakdown.tasks.map((task, index) => ({
      ...task,
      execution: this.enhanceExecutionInstructions(task.execution, context),
      tags: this.enhanceTags(task.tags, context),
      order: index + 1,
    }));

    return {
      ...breakdown,
      tasks: enhancedTasks,
    };
  }

  private enhanceExecutionInstructions(
    execution: string,
    context: UserContext
  ): string {
    // Add context-specific execution tips
    const tips = [];

    if (context.experienceLevel === "beginner") {
      tips.push(
        "Take your time and don't hesitate to research concepts you don't understand."
      );
    }

    if (context.availableTime < 2) {
      tips.push(
        "Break this into smaller chunks if needed to fit your available time."
      );
    }

    if (context.learningStyle === "hands-on") {
      tips.push("Focus on practical implementation and experimentation.");
    }

    return tips.length > 0
      ? `${execution}\n\nTips: ${tips.join(" ")}`
      : execution;
  }

  private enhanceTags(tags: string[], context: UserContext): string[] {
    const enhancedTags = [...tags];

    // Add context-specific tags
    enhancedTags.push(context.experienceLevel);
    enhancedTags.push(`${context.availableTime}h-session`);

    if (context.currentSkills.length > 0) {
      enhancedTags.push(...context.currentSkills.slice(0, 2));
    }

    return [...new Set(enhancedTags)]; // Remove duplicates
  }

  private applyTaskOrdering(tasks: Task[], orderedIndices: number[]): Task[] {
    const orderedTasks: Task[] = [];

    for (const index of orderedIndices) {
      if (index >= 0 && index < tasks.length) {
        orderedTasks.push(tasks[index]);
      }
    }

    // Add any remaining tasks that weren't in the ordered list
    for (let i = 0; i < tasks.length; i++) {
      if (!orderedIndices.includes(i)) {
        orderedTasks.push(tasks[i]);
      }
    }

    return orderedTasks;
  }

  private createFallbackBreakdown(
    goal: string,
    context: UserContext
  ): TaskBreakdown {
    return {
      description: `A structured approach to achieving: ${goal}`,
      estimatedTotalTime: `${context.availableTime * 3} hours`,
      difficulty: context.experienceLevel,
      tasks: [
        {
          title: "Research and Planning",
          description: "Research the topic and create a detailed plan",
          execution:
            "Start by researching the goal online, taking notes, and creating a structured plan.",
          effort: 2,
          estimatedTime: "2 hours",
          prerequisites: [],
          successCriteria:
            "Have a clear understanding of what needs to be done and a written plan",
          tags: ["planning", "research", context.experienceLevel],
          order: 1,
        },
        {
          title: "Setup and Preparation",
          description: "Set up the necessary tools and environment",
          execution:
            "Install required software, create accounts, or gather necessary materials.",
          effort: 2,
          estimatedTime: "1 hour",
          prerequisites: ["Research and Planning"],
          successCriteria: "All tools and resources are ready to begin work",
          tags: ["setup", "preparation", context.experienceLevel],
          order: 2,
        },
        {
          title: "Implementation",
          description: "Work on the main implementation or learning",
          execution:
            "Follow your plan and start working on the core aspects of your goal.",
          effort: 4,
          estimatedTime: `${context.availableTime * 2} hours`,
          prerequisites: ["Setup and Preparation"],
          successCriteria: "Make significant progress toward your goal",
          tags: ["implementation", "core-work", context.experienceLevel],
          order: 3,
        },
        {
          title: "Review and Refinement",
          description: "Review your work and make improvements",
          execution:
            "Test your work, identify areas for improvement, and make necessary adjustments.",
          effort: 3,
          estimatedTime: "1 hour",
          prerequisites: ["Implementation"],
          successCriteria: "Work is polished and meets your quality standards",
          tags: ["review", "refinement", context.experienceLevel],
          order: 4,
        },
      ],
    };
  }

  private createFallbackTimeline(tasks: Task[]): Timeline {
    const totalEffort = tasks.reduce((sum, task) => sum + task.effort, 0);
    const estimatedDays = Math.ceil(totalEffort / 3); // Assume 3 effort points per day
    const estimatedHours = totalEffort * 1.5; // Assume 1.5 hours per effort point

    return {
      estimatedHours,
      confidence: 0.5,
      breakdown: tasks.map((task) => ({
        taskId: task.id,
        estimatedHours: task.effort * 1.5,
        dependencies: [],
      })),
    };
  }

  private createFallbackDependencyGraph(tasks: Task[]): DependencyGraph {
    const nodes = tasks.map((task, index) => ({
      id: `task-${index}`,
      task,
      estimatedDuration: task.effort * 1.5,
      dependencies: index > 0 ? [`task-${index - 1}`] : [],
      dependents: index < tasks.length - 1 ? [`task-${index + 1}`] : [],
    }));

    const edges = tasks.slice(0, -1).map((_, index) => ({
      from: `task-${index}`,
      to: `task-${index + 1}`,
      type: "blocks" as const,
    }));

    return {
      dependencies: edges,
    };
  }

  private generateCacheKey(goal: string, context: UserContext): string {
    const keyData = {
      goal: goal.substring(0, 100),
      experienceLevel: context.experienceLevel,
      availableTime: context.availableTime,
      preferredDifficulty: context.preferredDifficulty,
    };
    return btoa(JSON.stringify(keyData));
  }

  // Utility methods
  clearCache(): void {
    this.cache.clear();
    console.log("🗑️ Task planner cache cleared");
  }

  getCacheStats(): { size: number; entries: number } {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.values()).length,
    };
  }
}
