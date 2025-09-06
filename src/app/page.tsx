"use client";
import React from "react";
import { useDashboard } from "../hooks/useDashboard";
import {
  LoadingSpinner,
  DashboardHeader,
  StatsOverview,
  TabContent,
} from "../components/dashboard";

export default function Dashboard() {
  const {
    isLoading,
    activeTab,
    setActiveTab,
    trackers,
    totalTrackers,
    completedTasks,
    activeChallenges,
    totalPoints,
    enableStreakTracking,
  } = useDashboard();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 py-2 sm:py-4 lg:py-6">
        {/* Header */}
        <DashboardHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Stats Overview */}
        <StatsOverview
          totalTrackers={totalTrackers}
          completedTasks={completedTasks}
          totalPoints={totalPoints}
          activeChallenges={activeChallenges.length}
        />

        {/* Tab Content */}
        <TabContent
          activeTab={activeTab}
          trackers={trackers}
          enableStreakTracking={enableStreakTracking}
        />
      </div>
    </div>
  );
}
