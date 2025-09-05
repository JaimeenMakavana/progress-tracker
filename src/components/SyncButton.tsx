"use client";

import React, { useState, useEffect } from "react";
import { useTrackers } from "../context/TrackersContext";
import { GitHubUser } from "../services/githubSync";

interface SyncButtonProps {
  className?: string;
}

export default function SyncButton({ className = "" }: SyncButtonProps) {
  const {
    isGitHubConnected,
    connectToGitHub,
    disconnectFromGitHub,
    syncWithGitHub,
    getGitHubUser,
  } = useTrackers();

  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  useEffect(() => {
    const checkConnection = async () => {
      const connected = isGitHubConnected();
      setIsConnected(connected);

      if (connected) {
        const userInfo = await getGitHubUser();
        setUser(userInfo);

        // Load last sync time from localStorage
        const lastSync = localStorage.getItem("last_sync_time");
        setLastSyncTime(lastSync);
      }
    };

    checkConnection();
  }, [isGitHubConnected, getGitHubUser]);

  const handleConnect = async () => {
    try {
      await connectToGitHub();
    } catch (error) {
      console.error("Connection failed:", error);
    }
  };

  const handleDisconnect = () => {
    disconnectFromGitHub();
    setIsConnected(false);
    setUser(null);
    setLastSyncTime(null);
    localStorage.removeItem("last_sync_time");
    setShowUserMenu(false);
  };

  const handleSync = async () => {
    if (!isConnected) return;

    setIsSyncing(true);
    try {
      const result = await syncWithGitHub();

      if (result.success) {
        const now = new Date().toLocaleString();
        setLastSyncTime(now);
        localStorage.setItem("last_sync_time", now);

        // Show success message (you could add a toast notification here)
        console.log("Sync successful");
      } else {
        console.error("Sync failed:", result.error);
        // Show error message (you could add a toast notification here)
      }
    } catch (error) {
      console.error("Sync error:", error);
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isConnected) {
    return (
      <button
        onClick={handleConnect}
        className={`flex items-center gap-2 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${className}`}
        title="Connect to GitHub for cloud sync"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
        Connect GitHub
      </button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title={
            lastSyncTime ? `Last synced: ${lastSyncTime}` : "Sync with GitHub"
          }
        >
          {isSyncing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Syncing...
            </>
          ) : (
            <>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Sync
            </>
          )}
        </button>

        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          title="GitHub account menu"
        >
          {user?.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <svg
              className="w-6 h-6 text-gray-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          )}
          <span className="text-sm font-medium text-gray-700">
            {user?.login || "GitHub"}
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform ${
              showUserMenu ? "rotate-180" : ""
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
        </button>
      </div>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {user?.avatar_url && (
                <img
                  src={user.avatar_url}
                  alt={user.login}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
                <p className="font-medium text-gray-900">
                  {user?.name || user?.login}
                </p>
                <p className="text-sm text-gray-500">@{user?.login}</p>
              </div>
            </div>
          </div>

          <div className="p-2">
            {lastSyncTime && (
              <div className="px-3 py-2 text-sm text-gray-600">
                Last synced: {lastSyncTime}
              </div>
            )}

            <button
              onClick={handleDisconnect}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
            >
              Disconnect GitHub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
