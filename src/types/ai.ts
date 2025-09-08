// AI Agent Type Definitions
export interface AIAgentConfig {
  llm: {
    defaultProvider: "gemini" | "openai" | "anthropic" | "local";
    gemini: {
      apiKey: string;
      model: "gemini-1.5-flash" | "gemini-1.5-pro" | "gemini-1.5-flash-8b";
      maxOutputTokens?: number;
      temperature?: number;
      topP?: number;
      topK?: number;
    };
    openai?: {
      apiKey: string;
      model: string;
      maxTokens: number;
      temperature?: number;
    };
    anthropic?: {
      apiKey: string;
      model: string;
      maxTokens: number;
    };
    local?: {
      enabled: boolean;
      modelPath: string;
      apiUrl: string;
    };
  };
  features: {
    taskPlanner: {
      enabled: boolean;
      maxTasksPerGoal: number;
      includeDependencies: boolean;
    };
    personalization: {
      enabled: boolean;
      learningRate: number;
      adaptationThreshold: number;
    };
    reflectionCoach: {
      enabled: boolean;
      questionDepth: "shallow" | "medium" | "deep";
      includeCodeAnalysis: boolean;
    };
    predictiveAnalytics: {
      enabled: boolean;
      predictionHorizon: number;
      riskThreshold: number;
    };
    naturalLanguage: {
      enabled: boolean;
      supportedLanguages: string[];
      contextWindow: number;
    };
    notifications: {
      enabled: boolean;
      maxNotificationsPerDay: number;
      quietHours: { start: string; end: string };
    };
  };
  costLimits: {
    dailyLimit: number;
    monthlyLimit: number;
    alertThreshold: number;
  };
  vercel: {
    edgeRuntime: boolean;
    maxExecutionTime: number;
    cacheResponses: boolean;
    cacheTTL: number;
  };
}

export interface LLMOptions {
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  stream?: boolean;
}

export interface ModelInfo {
  name: string;
  provider: string;
  maxTokens: number;
  supportsStructuredOutput: boolean;
  supportsEmbeddings: boolean;
  costPer1kTokens: { input: number; output: number };
}

export interface LLMService {
  generateText(prompt: string, options?: LLMOptions): Promise<string>;
  generateStructured<T>(
    prompt: string,
    schema: JSONSchema,
    options?: LLMOptions
  ): Promise<T>;
  generateEmbedding(text: string): Promise<number[]>;
  isAvailable(): boolean;
  getModelInfo(): ModelInfo;
}

export interface JSONSchema {
  type: string;
  properties?: Record<string, unknown>;
  required?: string[];
  items?: JSONSchema;
}

// Task Planning Types
export interface UserContext {
  experienceLevel: "beginner" | "intermediate" | "advanced";
  availableTime: number; // hours per day
  preferredDifficulty: "easy" | "medium" | "hard";
  learningStyle: "visual" | "auditory" | "kinesthetic" | "hands-on";
  currentSkills: string[];
  goals?: string[];
  constraints?: string[];
}

export interface TaskBreakdown {
  description: string;
  estimatedTotalTime: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tasks: TaskBreakdownItem[];
}

export interface TaskBreakdownItem {
  title: string;
  description: string;
  execution: string;
  effort: number; // 1-5 scale
  estimatedTime: string;
  prerequisites: string[];
  successCriteria: string;
  tags: string[];
  order: number;
}

// Reflection Types
export interface ReflectionData {
  taskId: string;
  taskTitle: string;
  learned: string;
  challenges: string[];
  insights: string[];
  nextSteps: string[];
}

export interface ReflectionQuestion {
  id: string;
  question: string;
  type: "learning" | "challenge" | "insight" | "future";
  priority: "high" | "medium" | "low";
}

// Cost Tracking Types
export interface CostUsage {
  totalTokens: number;
  totalCost: number;
  dailyLimit: number;
  monthlyLimit: number;
  geminiTokens: number;
  openaiTokens: number;
  geminiCost: number;
  openaiCost: number;
  dailyRequests: number;
  monthlyRequests: number;
  dailyCost: number;
  monthlyCost: number;
}

export interface CostEstimate {
  inputTokens: number;
  outputTokens: number;
  totalCost: number;
  provider: "gemini" | "openai";
}

// Personalization Types
export interface UserProfile {
  id: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  learningStyle: "visual" | "auditory" | "kinesthetic" | "hands-on";
  preferredDifficulty: "easy" | "medium" | "hard";
  availableTime: number;
  currentSkills: string[];
  learningGoals: string[];
  productivityPatterns: ProductivityPatterns;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface ProductivityPatterns {
  mostProductiveHours: number[];
  averageSessionLength: number;
  preferredTaskTypes: string[];
  completionRate: number;
  difficultyPreference: "easy" | "medium" | "hard";
}

export interface UserPreferences {
  notificationFrequency: "low" | "medium" | "high";
  reminderTiming: "morning" | "afternoon" | "evening";
  preferredTaskSize: "small" | "medium" | "large";
  learningDepth: "shallow" | "medium" | "deep";
}

// Predictive Analytics Types
export interface PredictionData {
  streakBreakRisk: number; // 0-1
  productivityTrend: "increasing" | "stable" | "decreasing";
  completionForecast: number; // percentage
  recommendedActions: string[];
  riskFactors: RiskFactor[];
}

export interface RiskFactor {
  type: "streak" | "difficulty" | "time" | "motivation";
  severity: "low" | "medium" | "high";
  description: string;
  mitigation: string;
}

// Natural Language Types
export interface NaturalLanguageRequest {
  text: string;
  context: UserContext;
  intent: "create_task" | "breakdown_goal" | "ask_question" | "get_suggestion";
}

export interface NaturalLanguageResponse {
  intent: string;
  confidence: number;
  structuredData: unknown;
  suggestions: string[];
}

// Notification Types
export interface SmartNotification {
  id: string;
  type: "reminder" | "motivation" | "insight" | "warning";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  scheduledFor: string;
  isRead: boolean;
  actionRequired: boolean;
  actionUrl?: string;
}

export interface NotificationPreferences {
  enabled: boolean;
  types: string[];
  frequency: "low" | "medium" | "high";
  quietHours: { start: string; end: string };
  maxPerDay: number;
}

// Error Types
export interface AIAgentError {
  code: string;
  message: string;
  provider: "gemini" | "openai" | "anthropic" | "local";
  timestamp: string;
  context?: Record<string, unknown>;
}

// Cache Types
export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  key: string;
}

export interface CacheConfig {
  defaultTTL: number;
  maxSize: number;
  enablePersistence: boolean;
}

// Additional types for AI services
export interface WorkPatterns {
  mostProductiveHours: number[];
  averageSessionLength: number;
  preferredTaskTypes: string[];
  completionRate: number;
  difficultyPreference: "easy" | "medium" | "hard";
}

export interface Note {
  id: string;
  content: string;
  timestamp: string;
  tags: string[];
}

export interface Reflection {
  id: string;
  taskId: string;
  content: string;
  insights: string[];
  timestamp: string;
}

export interface LearningGap {
  id: string;
  description: string;
  severity: "low" | "medium" | "high";
  suggestedResources: string[];
}

export interface Learning {
  id: string;
  concept: string;
  mastery: number;
  lastReviewed: string;
  nextReview: string;
}

export interface ReviewSchedule {
  id: string;
  learningId: string;
  scheduledDate: string;
  interval: number;
}

export interface PerformanceData {
  taskId: string;
  completionTime: number;
  quality: number;
  difficulty: number;
  timestamp: string;
}

export interface MotivationStrategy {
  type: "encouragement" | "challenge" | "reward" | "social";
  message: string;
  action: string;
}

export interface StreakData {
  current: number;
  longest: number;
  lastActivity: string;
  riskLevel: "low" | "medium" | "high";
}

export interface RiskFactor {
  id: string;
  type: "streak" | "difficulty" | "time" | "motivation";
  severity: "low" | "medium" | "high";
  description: string;
  mitigation: string;
}

export interface Intervention {
  id: string;
  type: string;
  description: string;
  priority: number;
  estimatedEffect: number;
}

export interface AITask {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  estimatedTime: number;
  dependencies: string[];
}

export interface AITracker {
  id: string;
  name: string;
  description: string;
  tasks: AITask[];
  milestones: Milestone[];
  createdAt: string;
  updatedAt: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  completed: boolean;
  tasks: string[];
}

export interface Forecast {
  completionDate: string;
  confidence: number;
  factors: string[];
  recommendations: string[];
}

export interface Activity {
  id: string;
  type: string;
  duration: number;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export interface Pattern {
  id: string;
  type: string;
  frequency: number;
  strength: number;
  description: string;
}

export interface TaskDraft {
  title: string;
  description: string;
  estimatedTime: number;
  priority: "low" | "medium" | "high";
  tags: string[];
}

export interface Concept {
  id: string;
  name: string;
  description: string;
  relatedTasks: string[];
  difficulty: number;
}

export interface NotificationContext {
  userId: string;
  currentTask: string;
  timeOfDay: string;
  recentActivity: Activity[];
  preferences: NotificationPreferences;
}

export interface Message {
  id: string;
  content: string;
  type: "reminder" | "motivation" | "insight" | "warning";
  priority: "low" | "medium" | "high";
  timestamp: string;
}

export interface Notification {
  id: string;
  type: string;
  content: string;
  timestamp: string;
  read: boolean;
  action?: string;
}

export interface Timeline {
  estimatedHours: number;
  confidence: number;
  breakdown: Array<{
    taskId: string;
    estimatedHours: number;
    dependencies: string[];
  }>;
}

// Additional missing types for AI services
export interface DifficultyLevel {
  level: "easy" | "medium" | "hard";
  adjustment: number;
  reasoning: string;
}

export interface Schedule {
  id: string;
  tasks: Array<{
    taskId: string;
    scheduledTime: string;
    duration: number;
  }>;
  totalDuration: number;
}

export interface BreakSuggestion {
  type: "short" | "long" | "activity";
  duration: number;
  activities: string[];
  timing: string;
}

export interface LearningPattern {
  id: string;
  type: string;
  frequency: number;
  effectiveness: number;
  lastObserved: string;
}

export interface RiskLevel {
  level: "low" | "medium" | "high";
  factors: string[];
  confidence: number;
}

export interface TaskDetails {
  id: string;
  title: string;
  description: string;
  estimatedTime: number;
  difficulty: "easy" | "medium" | "hard";
  prerequisites: string[];
  resources: string[];
}

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
  confidence: number;
}

export interface ExecutionPlan {
  id: string;
  steps: Array<{
    order: number;
    description: string;
    estimatedTime: number;
    dependencies: number[];
  }>;
  totalTime: number;
  prerequisites: string[];
}

export interface NotificationTiming {
  optimalTimes: string[];
  frequency: "low" | "medium" | "high";
  reasoning: string;
}

export interface Escalation {
  level: "gentle" | "firm" | "urgent";
  message: string;
  action: string;
  timing: string;
}

export interface Frequency {
  daily: number;
  weekly: number;
  monthly: number;
  reasoning: string;
}

export interface DependencyGraph {
  dependencies: Array<{
    from: string;
    to: string;
    type: string;
  }>;
}
