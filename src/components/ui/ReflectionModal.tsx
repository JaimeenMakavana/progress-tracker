"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Textarea } from "./textarea";

interface ReflectionModalProps {
  isOpen: boolean;
  taskTitle: string;
  onReflect: (feeling: string, note?: string) => void;
  onSkip: () => void;
}

const feelingOptions = [
  { emoji: "😌", label: "Peaceful", description: "Calm and satisfied" },
  { emoji: "💪", label: "Strong", description: "Confident and powerful" },
  { emoji: "⚡", label: "Energized", description: "Excited and motivated" },
  { emoji: "😤", label: "Frustrated", description: "Challenging but worth it" },
  { emoji: "🎯", label: "Focused", description: "Clear and determined" },
  { emoji: "🔥", label: "On Fire", description: "Absolutely crushing it!" },
  { emoji: "💎", label: "Diamond", description: "Rare and valuable moment" },
  { emoji: "🏆", label: "Champion", description: "Victory and achievement" },
] as const;

export default function ReflectionModal({
  isOpen,
  taskTitle,
  onReflect,
  onSkip,
}: ReflectionModalProps) {
  const [selectedFeeling, setSelectedFeeling] = useState<string>("");
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    if (selectedFeeling) {
      onReflect(selectedFeeling, note.trim() || undefined);
      setSelectedFeeling("");
      setNote("");
    }
  };

  const handleSkip = () => {
    onSkip();
    setSelectedFeeling("");
    setNote("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">🎉 Task Completed!</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task title */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">You just completed:</p>
            <p className="font-semibold text-lg text-black">{taskTitle}</p>
          </div>

          {/* Feeling selection */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3 text-center">
              How did you feel completing this?
            </p>
            <div className="grid grid-cols-4 gap-3">
              {feelingOptions.map((feeling) => (
                <motion.button
                  key={feeling.emoji}
                  onClick={() => setSelectedFeeling(feeling.emoji)}
                  className={`p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    selectedFeeling === feeling.emoji
                      ? "border-black bg-black text-white"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="text-2xl mb-1">{feeling.emoji}</div>
                  <div className="text-xs font-medium">{feeling.label}</div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Optional note */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Add a note (optional)
            </label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What made this task special? Any insights?"
              className="min-h-[80px] resize-none"
              maxLength={200}
            />
            <p className="text-xs text-gray-500 mt-1">
              {note.length}/200 characters
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button onClick={handleSkip} variant="outline" className="flex-1">
              Skip
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!selectedFeeling}
              className="flex-1"
            >
              Reflect & Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
