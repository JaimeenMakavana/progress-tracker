"use client";

import { SyncDebugger, SyncStatusDebug } from "../../components/sync";

export default function SyncDebugPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              GitHub Gist Sync Debugger
            </h1>
            <p className="text-gray-600">
              Diagnose and fix synchronization issues with your GitHub Gists
            </p>
          </div>

          <div className="space-y-6">
            <SyncStatusDebug />
            <SyncDebugger />
          </div>

          <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              How to Use This Debugger
            </h3>
            <ul className="text-blue-800 space-y-2">
              <li>
                • <strong>Run Debug Check:</strong> Analyzes your current sync
                status and identifies issues
              </li>
              <li>
                • <strong>Re-authenticate:</strong> Refreshes your GitHub
                authentication token
              </li>
              <li>
                • <strong>Recreate Gists:</strong> Creates new gists if existing
                ones are corrupted or missing
              </li>
              <li>
                • <strong>Reset All:</strong> Clears all sync data and forces a
                complete restart
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
