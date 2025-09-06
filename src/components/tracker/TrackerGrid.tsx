import React from "react";
import { motion } from "framer-motion";
import { TrackerCard } from "../tasks";
import { Tracker } from "../../types";

interface TrackerGridProps {
  trackers: Tracker[];
  onOpenTracker: (id: string) => void;
  onDeleteTracker: (id: string) => void;
  onEnableStreak: (id: string) => void;
  onActivateProtection: (id: string) => void;
  onCreateRecoveryPlan: (id: string) => void;
}

export function TrackerGrid({
  trackers,
  onOpenTracker,
  onDeleteTracker,
  onEnableStreak,
  onActivateProtection,
  onCreateRecoveryPlan,
}: TrackerGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4">
      {trackers.map((tracker, index) => (
        <motion.div
          key={tracker.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.05 }}
          className="group"
        >
          <div className="bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl sm:rounded-2xl hover:bg-white/80 hover:shadow-lg transition-all duration-200">
            <TrackerCard
              tracker={tracker}
              variant="default"
              onOpen={onOpenTracker}
              onDelete={onDeleteTracker}
              onEnableStreak={onEnableStreak}
              onActivateProtection={onActivateProtection}
              onCreateRecoveryPlan={onCreateRecoveryPlan}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
}
