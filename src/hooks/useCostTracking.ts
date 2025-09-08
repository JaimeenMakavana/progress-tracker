import { useState, useEffect, useCallback } from "react";
import { CostUsage } from "../types/ai";

export interface UseCostTrackingReturn {
  costTracker: CostUsage;
  trackRequest: (provider: "gemini" | "openai", estimatedCost: number) => void;
  isWithinLimits: boolean;
  getRemainingRequests: () => { daily: number; monthly: number };
  getCostEstimate: (
    provider: "gemini" | "openai",
    promptLength: number,
    expectedResponseLength?: number
  ) => number;
  resetDailyUsage: () => void;
  resetMonthlyUsage: () => void;
}

export function useCostTracking(): UseCostTrackingReturn {
  const [costTracker, setCostTracker] = useState<CostUsage>({
    totalTokens: 0,
    totalCost: 0,
    dailyLimit: 0.05, // $0.05 per day
    monthlyLimit: 1.5, // $1.50 per month
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

  // Reset functions
  const resetDailyUsage = useCallback(() => {
    setCostTracker((prev) => ({
      ...prev,
      dailyCost: 0,
      dailyRequests: 0,
    }));
    console.log("🔄 Daily usage reset");
  }, []);

  const resetMonthlyUsage = useCallback(() => {
    setCostTracker((prev) => ({
      ...prev,
      monthlyCost: 0,
      monthlyRequests: 0,
    }));
    console.log("🔄 Monthly usage reset");
  }, []);

  // Save cost tracking to localStorage
  useEffect(() => {
    localStorage.setItem("ai-cost-tracker", JSON.stringify(costTracker));
  }, [costTracker]);

  // Reset daily usage at midnight
  useEffect(() => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const timeUntilMidnight = tomorrow.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      resetDailyUsage();
    }, timeUntilMidnight);

    return () => clearTimeout(timeout);
  }, [resetDailyUsage]);

  // Reset monthly usage on the first day of the month
  useEffect(() => {
    const now = new Date();
    const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const timeUntilFirstOfMonth = firstOfNextMonth.getTime() - now.getTime();

    const timeout = setTimeout(() => {
      resetMonthlyUsage();
    }, timeUntilFirstOfMonth);

    return () => clearTimeout(timeout);
  }, [resetMonthlyUsage]);

  const trackRequest = useCallback(
    (provider: "gemini" | "openai", estimatedCost: number) => {
      setCostTracker((prev) => ({
        ...prev,
        totalCost: prev.totalCost + estimatedCost,
        [`${provider}Cost`]: prev[`${provider}Cost`] + estimatedCost,
        dailyCost: prev.dailyCost + estimatedCost,
        monthlyCost: prev.monthlyCost + estimatedCost,
        dailyRequests: prev.dailyRequests + 1,
        monthlyRequests: prev.monthlyRequests + 1,
      }));
    },
    []
  );

  const isWithinLimits = useCallback(() => {
    return (
      costTracker.dailyCost < costTracker.dailyLimit &&
      costTracker.monthlyCost < costTracker.monthlyLimit
    );
  }, [
    costTracker.dailyCost,
    costTracker.dailyLimit,
    costTracker.monthlyCost,
    costTracker.monthlyLimit,
  ]);

  const getRemainingRequests = useCallback(() => {
    // Rough estimation: 50 requests per day, 1000 per month
    const dailyLimit = 50;
    const monthlyLimit = 1000;

    return {
      daily: Math.max(0, dailyLimit - costTracker.dailyRequests),
      monthly: Math.max(0, monthlyLimit - costTracker.monthlyRequests),
    };
  }, [costTracker.dailyRequests, costTracker.monthlyRequests]);

  const getCostEstimate = useCallback(
    (
      provider: "gemini" | "openai",
      promptLength: number,
      expectedResponseLength: number = 500
    ): number => {
      // Rough token estimation: 1 token ≈ 4 characters
      const inputTokens = Math.ceil(promptLength / 4);
      const outputTokens = Math.ceil(expectedResponseLength / 4);

      // Pricing per 1K tokens (as of 2024)
      const pricing = {
        gemini: { input: 0.000075, output: 0.0003 }, // Gemini 1.5 Flash
        openai: { input: 0.00015, output: 0.0006 }, // GPT-4o Mini
      };

      const inputCost = (inputTokens / 1000) * pricing[provider].input;
      const outputCost = (outputTokens / 1000) * pricing[provider].output;

      return inputCost + outputCost;
    },
    []
  );

  return {
    costTracker,
    trackRequest,
    isWithinLimits: isWithinLimits(),
    getRemainingRequests,
    getCostEstimate,
    resetDailyUsage,
    resetMonthlyUsage,
  };
}
