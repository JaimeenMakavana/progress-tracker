"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { QuizItem } from "../../types";

interface QuizCardProps {
  quizItem: QuizItem;
  onGrade: (grade: "again" | "hard" | "good" | "easy") => void;
  onSkip?: () => void;
}

export default function QuizCard({ quizItem, onGrade, onSkip }: QuizCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleGrade = (grade: "again" | "hard" | "good" | "easy") => {
    onGrade(grade);
    setShowAnswer(false);
    setShowHint(false);
  };

  const getGradeColor = (grade: "again" | "hard" | "good" | "easy") => {
    switch (grade) {
      case "again":
        return "bg-red-100 text-red-800 border-red-200";
      case "hard":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "good":
        return "bg-green-100 text-green-800 border-green-200";
      case "easy":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getGradeDescription = (grade: "again" | "hard" | "good" | "easy") => {
    switch (grade) {
      case "again":
        return "Again (0-1 min)";
      case "hard":
        return "Hard (6 min)";
      case "good":
        return "Good (1 day)";
      case "easy":
        return "Easy (4 days)";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white border-2 border-black rounded-lg p-6 w-full max-w-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-black"></div>
          <span className="text-sm font-semibold text-black">Quiz Review</span>
        </div>
        {onSkip && (
          <button
            onClick={onSkip}
            className="text-sm text-gray-500 hover:text-black transition-colors"
          >
            Skip
          </button>
        )}
      </div>

      {/* Tags */}
      {quizItem.tags && quizItem.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {quizItem.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-black mb-3">Question:</h3>
        <p className="text-gray-800 leading-relaxed">{quizItem.question}</p>
      </div>

      {/* Hint */}
      {quizItem.hint && (
        <div className="mb-4">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-sm text-gray-600 hover:text-black transition-colors flex items-center gap-1"
          >
            <svg
              className={`w-4 h-4 transition-transform ${
                showHint ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
            {showHint ? "Hide hint" : "Show hint"}
          </button>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 p-3 bg-gray-50 rounded-lg"
              >
                <p className="text-sm text-gray-700 italic">{quizItem.hint}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Show Answer Button */}
      {!showAnswer && (
        <div className="mb-6">
          <button
            onClick={handleShowAnswer}
            className="w-full btn-[#2C3930] py-3"
          >
            Show Answer
          </button>
        </div>
      )}

      {/* Answer and Grading */}
      <AnimatePresence>
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-4"
          >
            {/* Answer */}
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-black mb-2">Answer:</h4>
              <p className="text-gray-800">{quizItem.answer}</p>
            </div>

            {/* Grading Buttons */}
            <div className="space-y-3">
              <p className="text-sm text-gray-600 text-center">
                How well did you know this?
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(["again", "hard", "good", "easy"] as const).map((grade) => (
                  <motion.button
                    key={grade}
                    onClick={() => handleGrade(grade)}
                    className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${getGradeColor(
                      grade
                    )}`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="font-semibold capitalize">{grade}</div>
                    <div className="text-xs opacity-75">
                      {getGradeDescription(grade)}
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spaced Repetition Info */}
      {quizItem.interval && quizItem.repetitions && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Repetitions: {quizItem.repetitions}</span>
            <span>Interval: {quizItem.interval} days</span>
            {quizItem.nextDue && (
              <span>
                Next: {new Date(quizItem.nextDue).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
