"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AITaskPlannerModal } from "./AITaskPlannerModal";
import { Button } from "../ui/button";
import { Bot, Sparkles, Zap } from "lucide-react";

interface AITaskPlannerButtonProps {
  onTasksCreated?: (trackerId: string) => void;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
  children?: React.ReactNode;
}

export function AITaskPlannerButton({
  onTasksCreated,
  variant = "default",
  size = "default",
  className = "",
  children,
}: AITaskPlannerButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTasksCreated = (trackerId: string) => {
    onTasksCreated?.(trackerId);
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant={variant}
          size={size}
          className={`relative overflow-hidden ${className}`}
        >
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4" />
            {children || "AI Task Planner"}
            <Sparkles className="w-3 h-3 opacity-70" />
          </div>

          {/* Animated background */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "loop",
              ease: "linear",
            }}
          />
        </Button>
      </motion.div>

      <AITaskPlannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTasksCreated={handleTasksCreated}
      />
    </>
  );
}

// Compact version for toolbars
export function AITaskPlannerIconButton({
  onTasksCreated,
  className = "",
}: Omit<AITaskPlannerButtonProps, "size" | "children">) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTasksCreated = (trackerId: string) => {
    onTasksCreated?.(trackerId);
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
        <Button
          onClick={() => setIsModalOpen(true)}
          variant="outline"
          size="icon"
          className={`relative ${className}`}
          title="AI Task Planner"
        >
          <Bot className="w-4 h-4" />
          <Zap className="w-2 h-2 absolute -top-1 -right-1 text-blue-500" />
        </Button>
      </motion.div>

      <AITaskPlannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTasksCreated={handleTasksCreated}
      />
    </>
  );
}
