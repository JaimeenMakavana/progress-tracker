"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./dialog";
import { Button } from "./button";
import { Input } from "./input";
// import { Textarea } from "./textarea";
import { Label } from "./label";

interface CommitmentContractModalProps {
  isOpen: boolean;
  taskTitle: string;
  onCreateContract: (contract: { penalty?: string; reward?: string }) => void;
  onCancel: () => void;
}

const penaltySuggestions = [
  "Donate $10 to a charity I dislike",
  "Post an embarrassing photo on social media",
  "Skip my favorite TV show for a week",
  "Do 50 push-ups in public",
  "Eat a food I hate",
  "Call my mom and tell her I failed",
  "Clean the entire house",
  "Give up coffee for 3 days",
];

const rewardSuggestions = [
  "Buy myself a nice dinner",
  "Get a massage",
  "Buy that book I&apos;ve been wanting",
  "Take a day off to relax",
  "Go to a movie",
  "Buy new workout gear",
  "Get a fancy coffee",
  "Order takeout from my favorite restaurant",
];

export default function CommitmentContractModal({
  isOpen,
  taskTitle,
  onCreateContract,
  onCancel,
}: CommitmentContractModalProps) {
  const [penalty, setPenalty] = useState("");
  const [reward, setReward] = useState("");
  const [customPenalty, setCustomPenalty] = useState("");
  const [customReward, setCustomReward] = useState("");

  const handleSubmit = () => {
    onCreateContract({
      penalty: customPenalty || penalty,
      reward: customReward || reward,
    });
    // Reset form
    setPenalty("");
    setReward("");
    setCustomPenalty("");
    setCustomReward("");
  };

  const handleCancel = () => {
    onCancel();
    // Reset form
    setPenalty("");
    setReward("");
    setCustomPenalty("");
    setCustomReward("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-center">
            🤝 Create Commitment Contract
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task title */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">For the task:</p>
            <p className="font-semibold text-lg text-black">{taskTitle}</p>
          </div>

          {/* Explanation */}
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Commitment contracts</strong> use loss aversion to help
              you stay disciplined. If you break your commitment, you&apos;ll
              face the penalty. If you succeed, you get the reward!
            </p>
          </div>

          {/* Penalty Section */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              What happens if you break this commitment? (Penalty)
            </Label>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {penaltySuggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => setPenalty(suggestion)}
                  className={`p-2 text-xs rounded-lg border transition-all ${
                    penalty === suggestion
                      ? "border-[#2C3930] bg-[#2C3930]/10 text-[#2C3930]"
                      : "border-gray-200 hover:border-[#2C3930]"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-1 block">
                Or write your own penalty:
              </Label>
              <Input
                value={customPenalty}
                onChange={(e) => setCustomPenalty(e.target.value)}
                placeholder="Enter your custom penalty..."
                className="text-sm"
              />
            </div>
          </div>

          {/* Reward Section */}
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-3 block">
              What do you get if you succeed? (Reward)
            </Label>

            <div className="grid grid-cols-2 gap-2 mb-3">
              {rewardSuggestions.map((suggestion) => (
                <motion.button
                  key={suggestion}
                  onClick={() => setReward(suggestion)}
                  className={`p-2 text-xs rounded-lg border transition-all ${
                    reward === suggestion
                      ? "border-[#2C3930] bg-[#2C3930]/10 text-[#2C3930]"
                      : "border-gray-200 hover:border-[#2C3930]"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {suggestion}
                </motion.button>
              ))}
            </div>

            <div>
              <Label className="text-xs text-gray-600 mb-1 block">
                Or write your own reward:
              </Label>
              <Input
                value={customReward}
                onChange={(e) => setCustomReward(e.target.value)}
                placeholder="Enter your custom reward..."
                className="text-sm"
              />
            </div>
          </div>

          {/* Warning */}
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              ⚠️ <strong>Warning:</strong> Commitment contracts are serious!
              Make sure you&apos;re willing to follow through with your penalty
              if you break the commitment.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            <Button onClick={handleCancel} variant="outline" className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!penalty && !customPenalty}
              className="flex-1"
            >
              Create Contract
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
