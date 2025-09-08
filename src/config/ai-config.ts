import { AIAgentConfig } from "../types/ai";

export const DEFAULT_AI_CONFIG: AIAgentConfig = {
  llm: {
    defaultProvider: "gemini",
    gemini: {
      apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
      model: "gemini-1.5-flash",
      maxOutputTokens: 2048,
      temperature: 0.7,
      topP: 0.8,
      topK: 40,
    },
    openai: {
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || "",
      model: "gpt-4o-mini",
      maxTokens: 2048,
      temperature: 0.7,
    },
  },
  features: {
    taskPlanner: {
      enabled: true,
      maxTasksPerGoal: 6,
      includeDependencies: true,
    },
    personalization: {
      enabled: true,
      learningRate: 0.1,
      adaptationThreshold: 10,
    },
    reflectionCoach: {
      enabled: true,
      questionDepth: "medium",
      includeCodeAnalysis: false,
    },
    predictiveAnalytics: {
      enabled: true,
      predictionHorizon: 7,
      riskThreshold: 0.7,
    },
    naturalLanguage: {
      enabled: true,
      supportedLanguages: ["en"],
      contextWindow: 4000,
    },
    notifications: {
      enabled: true,
      maxNotificationsPerDay: 5,
      quietHours: { start: "22:00", end: "08:00" },
    },
  },
  costLimits: {
    dailyLimit: 0.05, // $0.05 per day
    monthlyLimit: 1.5, // $1.50 per month
    alertThreshold: 0.04, // Alert at $0.04 daily
  },
  vercel: {
    edgeRuntime: true,
    maxExecutionTime: 10000, // 10 seconds
    cacheResponses: true,
    cacheTTL: 300, // 5 minutes
  },
};

// Free tier optimized configuration
export const FREE_TIER_AI_CONFIG: AIAgentConfig = {
  ...DEFAULT_AI_CONFIG,
  llm: {
    ...DEFAULT_AI_CONFIG.llm,
    gemini: {
      ...DEFAULT_AI_CONFIG.llm.gemini,
      maxOutputTokens: 1024, // Reduced for free tier
    },
    openai: DEFAULT_AI_CONFIG.llm.openai
      ? {
          ...DEFAULT_AI_CONFIG.llm.openai,
          maxTokens: 1024, // Reduced for free tier
        }
      : undefined,
  },
  features: {
    ...DEFAULT_AI_CONFIG.features,
    taskPlanner: {
      ...DEFAULT_AI_CONFIG.features.taskPlanner,
      maxTasksPerGoal: 5, // Reduced for free tier
    },
    naturalLanguage: {
      ...DEFAULT_AI_CONFIG.features.naturalLanguage,
      contextWindow: 2000, // Reduced for free tier
    },
    notifications: {
      ...DEFAULT_AI_CONFIG.features.notifications,
      maxNotificationsPerDay: 3, // Reduced for free tier
    },
  },
  costLimits: {
    dailyLimit: 0.02, // $0.02 per day for free tier
    monthlyLimit: 0.6, // $0.60 per month for free tier
    alertThreshold: 0.015, // Alert at $0.015 daily
  },
};

// Load configuration based on environment
export function getAIConfig(): AIAgentConfig {
  // Check if we're in a free tier environment
  const isFreeTier =
    process.env.NODE_ENV === "development" ||
    process.env.VERCEL_ENV === "preview" ||
    !process.env.NEXT_PUBLIC_OPENAI_API_KEY;

  return isFreeTier ? FREE_TIER_AI_CONFIG : DEFAULT_AI_CONFIG;
}

// Validate configuration
export function validateAIConfig(config: AIAgentConfig): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!config.llm.gemini.apiKey) {
    errors.push("Gemini API key is required");
  }

  if (config.llm.openai && !config.llm.openai.apiKey) {
    errors.push("OpenAI API key is required when OpenAI is enabled");
  }

  if (config.costLimits.dailyLimit <= 0) {
    errors.push("Daily cost limit must be greater than 0");
  }

  if (config.costLimits.monthlyLimit <= 0) {
    errors.push("Monthly cost limit must be greater than 0");
  }

  if (config.costLimits.dailyLimit > config.costLimits.monthlyLimit) {
    errors.push("Daily limit cannot be greater than monthly limit");
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

// Get cost estimates for different operations
export function getCostEstimates() {
  return {
    taskBreakdown: {
      gemini: 0.001, // ~$0.001 per breakdown
      openai: 0.002, // ~$0.002 per breakdown
    },
    reflectionQuestions: {
      gemini: 0.0005, // ~$0.0005 per set of questions
      openai: 0.001, // ~$0.001 per set of questions
    },
    predictiveAnalysis: {
      gemini: 0.002, // ~$0.002 per analysis
      openai: 0.004, // ~$0.004 per analysis
    },
    naturalLanguageTask: {
      gemini: 0.0008, // ~$0.0008 per task creation
      openai: 0.0015, // ~$0.0015 per task creation
    },
  };
}
