"use client";
import React from "react";
import { motion } from "framer-motion";
import { TabNavigation } from "./TabNavigation";
import { AITaskPlannerButton, AIStatusBadge, TapasAIButton } from "../ai";

export const DashboardHeader = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: "overview" | "challenges" | "profile";
  setActiveTab: (tab: "overview" | "challenges" | "profile") => void;
}) => {
  return (
    <motion.div
      className="mb-6 sm:mb-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-6">
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-[#2C3930] to-[#2C3930]/80 bg-clip-text text-transparent">
                Progress Dashboard
              </h1>
              <AIStatusBadge />
              <TapasAIButton />
            </div>
            <motion.p
              className="text-base sm:text-lg text-gray-600 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Track your productivity journey with gamified features and
              AI-powered insights
            </motion.p>
            <motion.div
              className="mt-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <AITaskPlannerButton
                variant="default"
                size="sm"
                onTasksCreated={(trackerId) => {
                  console.log("New tracker created with AI:", trackerId);
                  // You can add navigation logic here
                }}
              />
            </motion.div>
          </motion.div>
        </div>
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      </div>
    </motion.div>
  );
};
