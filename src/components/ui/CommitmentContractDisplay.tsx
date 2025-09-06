"use client";
import React from "react";
import { motion } from "framer-motion";
import { CommitmentContract } from "../../types";
import { Button } from "./button";
import { Shield, AlertTriangle, Gift, X } from "lucide-react";

interface CommitmentContractDisplayProps {
  contract: CommitmentContract;
  onDeactivate: () => void;
  onComplete: () => void;
  onBreak: () => void;
  className?: string;
}

export default function CommitmentContractDisplay({
  contract,
  onDeactivate,
  onComplete,
  onBreak,
  className = "",
}: CommitmentContractDisplayProps) {
  if (!contract.isActive) return null;

  return (
    <motion.div
      className={`bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-purple-600" />
          <span className="font-semibold text-purple-800">Active Contract</span>
        </div>
        <Button
          onClick={onDeactivate}
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Contract Details */}
      <div className="space-y-3">
        {/* Penalty */}
        {contract.penalty && (
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800">Penalty:</p>
              <p className="text-sm text-red-700">{contract.penalty}</p>
            </div>
          </div>
        )}

        {/* Reward */}
        {contract.reward && (
          <div className="flex items-start gap-3">
            <Gift className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Reward:</p>
              <p className="text-sm text-green-700">{contract.reward}</p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button
          onClick={onComplete}
          size="sm"
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          ✅ Complete
        </Button>
        <Button
          onClick={onBreak}
          variant="outline"
          size="sm"
          className="flex-1 border-red-300 text-red-600 hover:bg-red-50"
        >
          ❌ Break Contract
        </Button>
      </div>

      {/* Contract Date */}
      <div className="mt-3 pt-3 border-t border-purple-200">
        <p className="text-xs text-purple-600">
          Contract created: {new Date(contract.createdAt).toLocaleDateString()}
        </p>
      </div>
    </motion.div>
  );
}
