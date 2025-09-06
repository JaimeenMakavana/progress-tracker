import React from "react";

interface TrackerNotFoundProps {
  onBackToDashboard: () => void;
}

export function TrackerNotFound({ onBackToDashboard }: TrackerNotFoundProps) {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">
          Tracker not found
        </h1>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-3 btn-[#2C3930]"
          aria-label="Go back to dashboard"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
