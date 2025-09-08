import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import {
  AIAgentService,
  createAIAgent,
} from "../services/ai/core/AIAgentService";
import { AIAgentConfig, CostUsage } from "../types/ai";

export interface UseAIAgentReturn {
  aiAgent: AIAgentService | null;
  isLoading: boolean;
  error: string | null;
  isReady: boolean;
  costTracker: CostUsage;
  initialize: () => Promise<void>;
  shutdown: () => Promise<void>;
}

export function useAIAgent(config?: AIAgentConfig): UseAIAgentReturn {
  const [aiAgent, setAIAgent] = useState<AIAgentService | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const aiAgentRef = useRef<AIAgentService | null>(null);
  const [costTracker, setCostTracker] = useState<CostUsage>({
    totalTokens: 0,
    totalCost: 0,
    dailyLimit: 0.05,
    monthlyLimit: 1.5,
    geminiTokens: 0,
    openaiTokens: 0,
    geminiCost: 0,
    openaiCost: 0,
    dailyRequests: 0,
    monthlyRequests: 0,
    dailyCost: 0,
    monthlyCost: 0,
  });

  // Load cost tracking from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("ai-cost-tracker");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCostTracker((prev) => ({ ...prev, ...parsed }));
      } catch (error) {
        console.warn("Failed to parse saved cost tracker:", error);
      }
    }
  }, []);

  // Save cost tracking to localStorage
  useEffect(() => {
    localStorage.setItem("ai-cost-tracker", JSON.stringify(costTracker));
  }, [costTracker]);

  const initialize = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🚀 Initializing AI Agent...");
      const agent = createAIAgent(config);
      await agent.initialize();

      setAIAgent(agent);
      aiAgentRef.current = agent;
      console.log("✅ AI Agent initialized successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to initialize AI Agent";
      setError(errorMessage);
      console.error("❌ AI Agent initialization failed:", err);
    } finally {
      setIsLoading(false);
    }
  }, [config]);

  const shutdown = useCallback(async () => {
    if (aiAgentRef.current) {
      try {
        await aiAgentRef.current.shutdown();
        setAIAgent(null);
        aiAgentRef.current = null;
        console.log("✅ AI Agent shut down successfully");
      } catch (err) {
        console.error("❌ Error during AI Agent shutdown:", err);
      }
    }
  }, []);

  const isReady = useMemo(() => {
    return aiAgent?.isReady() ?? false;
  }, [aiAgent]);

  // Initialize on mount
  useEffect(() => {
    initialize();

    // Cleanup on unmount
    return () => {
      if (aiAgentRef.current) {
        aiAgentRef.current.shutdown().catch(console.error);
      }
    };
  }, [initialize]);

  return {
    aiAgent,
    isLoading,
    error,
    isReady,
    costTracker,
    initialize,
    shutdown,
  };
}
