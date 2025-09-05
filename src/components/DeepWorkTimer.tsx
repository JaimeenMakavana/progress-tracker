"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Task } from "../types";

interface DeepWorkTimerProps {
  task?: Task;
  onSessionComplete?: (session: DeepWorkSession) => void;
  onClose?: () => void;
}

interface DeepWorkSession {
  id: string;
  taskId?: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  type: "work" | "break";
  reflection?: {
    blocked: string;
    insight: string;
  };
}

const WORK_DURATION = 50; // minutes
const BREAK_DURATION = 10; // minutes

export default function DeepWorkTimer({
  task,
  onSessionComplete,
  onClose,
}: DeepWorkTimerProps) {
  const [isActive, setIsActive] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WORK_DURATION * 60); // in seconds
  const [session, setSession] = useState<DeepWorkSession | null>(null);
  const [showReflection, setShowReflection] = useState(false);
  const [reflection, setReflection] = useState({ blocked: "", insight: "" });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<Date | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSessionComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft]);

  const startTimer = () => {
    setIsActive(true);
    startTimeRef.current = new Date();
    setSession({
      id: `session-${Date.now()}`,
      taskId: task?.id,
      startTime: new Date().toISOString(),
      endTime: "",
      duration: 0,
      type: "work",
    });
  };

  const pauseTimer = () => {
    setIsActive(false);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(isBreak ? BREAK_DURATION * 60 : WORK_DURATION * 60);
    setSession(null);
    setShowReflection(false);
    setReflection({ blocked: "", insight: "" });
  };

  const handleSessionComplete = () => {
    setIsActive(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    const endTime = new Date();
    const duration = startTimeRef.current
      ? Math.round(
          (endTime.getTime() - startTimeRef.current.getTime()) / (1000 * 60)
        )
      : 0;

    const completedSession: DeepWorkSession = {
      ...session!,
      endTime: endTime.toISOString(),
      duration,
      type: isBreak ? "break" : "work",
    };

    if (!isBreak) {
      // Show reflection for work sessions
      setShowReflection(true);
    } else {
      // Break completed, start work session
      setIsBreak(false);
      setTimeLeft(WORK_DURATION * 60);
      onSessionComplete?.(completedSession);
    }
  };

  const handleReflectionSubmit = () => {
    const completedSession: DeepWorkSession = {
      ...session!,
      endTime: new Date().toISOString(),
      duration: session?.duration || 0,
      type: "work",
      reflection,
    };

    onSessionComplete?.(completedSession);
    setShowReflection(false);

    // Start break
    setIsBreak(true);
    setTimeLeft(BREAK_DURATION * 60);
    setSession({
      id: `session-${Date.now()}`,
      taskId: task?.id,
      startTime: new Date().toISOString(),
      endTime: "",
      duration: 0,
      type: "break",
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progress = isBreak
    ? ((BREAK_DURATION * 60 - timeLeft) / (BREAK_DURATION * 60)) * 100
    : ((WORK_DURATION * 60 - timeLeft) / (WORK_DURATION * 60)) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        className="bg-white rounded-lg p-8 w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-black">
            {isBreak ? "Break Time" : "Deep Work"}
          </h2>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-black transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Task Info */}
        {task && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-black mb-1">{task.title}</h3>
            {task.execution && (
              <p className="text-sm text-gray-600">{task.execution}</p>
            )}
            {task.mindset && (
              <p className="text-sm text-gray-500 italic mt-1">
                "{task.mindset}"
              </p>
            )}
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center mb-6">
          <div className="text-6xl font-mono font-bold text-black mb-2">
            {formatTime(timeLeft)}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-black h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex gap-3 mb-6">
          {!isActive ? (
            <button
              onClick={startTimer}
              className="flex-1 btn-primary py-3 text-lg"
            >
              {timeLeft === (isBreak ? BREAK_DURATION : WORK_DURATION) * 60
                ? "Start"
                : "Resume"}
            </button>
          ) : (
            <button
              onClick={pauseTimer}
              className="flex-1 px-4 py-3 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors"
            >
              Pause
            </button>
          )}
          <button
            onClick={resetTimer}
            className="px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Session Info */}
        <div className="text-center text-sm text-gray-600">
          {isBreak ? (
            <p>Take a break! You've earned it.</p>
          ) : (
            <p>Focus on your task. No distractions.</p>
          )}
        </div>

        {/* Reflection Modal */}
        <AnimatePresence>
          {showReflection && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-60"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-lg p-6 w-full max-w-md"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
              >
                <h3 className="text-xl font-bold text-black mb-4">
                  Session Reflection
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What blocked you?
                    </label>
                    <textarea
                      value={reflection.blocked}
                      onChange={(e) =>
                        setReflection((prev) => ({
                          ...prev,
                          blocked: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Distractions, technical issues, etc."
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      What insight emerged?
                    </label>
                    <textarea
                      value={reflection.insight}
                      onChange={(e) =>
                        setReflection((prev) => ({
                          ...prev,
                          insight: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                      placeholder="Key learnings, breakthroughs, etc."
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleReflectionSubmit}
                    className="flex-1 btn-primary"
                  >
                    Complete Session
                  </button>
                  <button
                    onClick={() => setShowReflection(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Skip
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
