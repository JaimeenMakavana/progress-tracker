"use client";
import React from "react";
import { motion } from "framer-motion";
import { useAIAgent } from "../../hooks/useAIAgent";
import { useCostTracking } from "../../hooks/useCostTracking";
import { Badge } from "../ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import {
  Bot,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Zap,
  DollarSign,
  Activity,
} from "lucide-react";

interface AIStatusIndicatorProps {
  showDetails?: boolean;
  className?: string;
}

export function AIStatusIndicator({
  showDetails = false,
  className = "",
}: AIStatusIndicatorProps) {
  const { isReady, isLoading, error } = useAIAgent();
  const { costTracker, isWithinLimits } = useCostTracking();

  const getStatusIcon = () => {
    if (isLoading) {
      return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    }

    if (error) {
      return <AlertTriangle className="w-4 h-4 text-red-500" />;
    }

    if (isReady) {
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    }

    return <Bot className="w-4 h-4 text-gray-500" />;
  };

  const getStatusText = () => {
    if (isLoading) return "Initializing AI...";
    if (error) return "AI Unavailable";
    if (isReady) return "AI Ready";
    return "AI Offline";
  };

  const getStatusColor = () => {
    if (isLoading) return "bg-blue-100 text-blue-800 border-blue-200";
    if (error) return "bg-red-100 text-red-800 border-red-200";
    if (isReady) return "bg-green-100 text-green-800 border-green-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (showDetails) {
    return (
      <div className={`p-3 bg-white rounded-lg border ${className}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <span className="font-medium">{getStatusText()}</span>
          </div>
          <Badge
            className="text-white"
            variant={isWithinLimits ? "default" : "destructive"}
          >
            {isWithinLimits ? "Within Limits" : "Limit Exceeded"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Daily Requests</div>
              <div className="font-medium">{costTracker.dailyRequests}/50</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-gray-500" />
            <div>
              <div className="text-gray-600">Daily Cost</div>
              <div className="font-medium">
                ${costTracker.dailyCost.toFixed(3)}
              </div>
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{
              width: `${Math.min(
                (costTracker.dailyRequests / 50) * 100,
                100
              )}%`,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    );
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor()} ${className}`}
          >
            {getStatusIcon()}
            <span>{getStatusText()}</span>
            {isReady && <Zap className="w-3 h-3" />}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="space-y-1">
            <div className="font-medium">AI Agent Status</div>
            <div className="text-sm text-gray-600">
              Requests: {costTracker.dailyRequests}/50
            </div>
            <div className="text-sm text-gray-600">
              Cost: ${costTracker.dailyCost.toFixed(3)} today
            </div>
            {error && (
              <div className="text-sm text-red-600">Error: {error}</div>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// Compact version for headers
export function AIStatusBadge({ className = "" }: { className?: string }) {
  const { isReady, isLoading, error } = useAIAgent();
  const { costTracker } = useCostTracking();

  const getStatusColor = () => {
    if (isLoading) return "bg-blue-500";
    if (error) return "bg-red-500";
    if (isReady) return "bg-green-500";
    return "bg-gray-500";
  };

  return (
    <motion.div
      className={`w-3 h-3 rounded-full ${getStatusColor()} ${className}`}
      animate={{
        scale: isReady ? [1, 1.2, 1] : 1,
        opacity: isLoading ? [0.5, 1, 0.5] : 1,
      }}
      transition={{
        duration: isReady ? 2 : 1,
        repeat: isReady ? Infinity : isLoading ? Infinity : 0,
      }}
      title={`AI: ${isReady ? "Ready" : isLoading ? "Loading" : "Offline"} (${
        costTracker.dailyRequests
      }/50 requests)`}
    />
  );
}
