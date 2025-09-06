"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MicroRewardAnimationProps {
  reward: {
    type:
      | "streak_bonus"
      | "effort_bonus"
      | "consistency_bonus"
      | "milestone_bonus";
    message: string;
    value: number;
  };
  onComplete: () => void;
}

export default function MicroRewardAnimation({
  reward,
  onComplete,
}: MicroRewardAnimationProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Wait for exit animation
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const getRewardConfig = (type: string) => {
    switch (type) {
      case "streak_bonus":
        return {
          emoji: "🔥",
          color: "from-orange-400 to-red-500",
          sound: "fire",
        };
      case "effort_bonus":
        return {
          emoji: "💪",
          color: "from-blue-400 to-purple-500",
          sound: "strength",
        };
      case "consistency_bonus":
        return {
          emoji: "⚡",
          color: "from-yellow-400 to-orange-500",
          sound: "lightning",
        };
      case "milestone_bonus":
        return {
          emoji: "🏆",
          color: "from-yellow-400 to-yellow-600",
          sound: "victory",
        };
      default:
        return {
          emoji: "✨",
          color: "from-gray-400 to-gray-600",
          sound: "sparkle",
        };
    }
  };

  const config = getRewardConfig(reward.type);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background overlay */}
          <motion.div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Reward card */}
          <motion.div
            className="relative bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
          >
            {/* Main emoji */}
            <motion.div
              className="text-6xl text-center mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
            >
              {config.emoji}
            </motion.div>

            {/* Reward message */}
            <motion.div
              className="text-center mb-2"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <h3 className="text-xl font-bold text-black mb-1">
                {reward.message}
              </h3>
              <p className="text-2xl font-bold bg-gradient-to-r from-green-500 to-blue-500 bg-clip-text text-transparent">
                +{reward.value} points
              </p>
            </motion.div>

            {/* Progress bar */}
            <motion.div
              className="w-full bg-gray-200 rounded-full h-2 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                className={`h-2 rounded-full bg-gradient-to-r ${config.color}`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
              />
            </motion.div>

            {/* Sparkle effects */}
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                  transformOrigin: "0 0",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                  opacity: 1,
                }}
                animate={{
                  x: Math.cos((i * 45 * Math.PI) / 180) * 60,
                  y: Math.sin((i * 45 * Math.PI) / 180) * 60,
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0],
                }}
                transition={{
                  duration: 2,
                  delay: 1 + i * 0.1,
                  ease: "easeOut",
                }}
              />
            ))}

            {/* Floating particles */}
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={{
                  left: "50%",
                  top: "50%",
                }}
                initial={{
                  x: 0,
                  y: 0,
                  scale: 0,
                }}
                animate={{
                  x: (Math.random() - 0.5) * 200,
                  y: (Math.random() - 0.5) * 200,
                  scale: [0, 1, 0],
                }}
                transition={{
                  duration: 2.5,
                  delay: 1.2 + Math.random() * 0.5,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
