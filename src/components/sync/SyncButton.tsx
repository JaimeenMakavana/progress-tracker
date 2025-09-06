"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useTrackers } from "../../context/TrackersContext";
import { GitHubUser } from "../../services/githubSync";
import { Github, RefreshCw, Check, ChevronDown } from "lucide-react";
import { Button } from "../ui/button";

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
  const [showSuccess, setShowSuccess] = useState(false);

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

        // Show success state briefly
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);

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

  // Check if this is a floating button (compact mode)
  const isFloating =
    className.includes("w-8") ||
    className.includes("h-8") ||
    className.includes("w-full h-full") ||
    className.includes("w-10") ||
    className.includes("h-10");

  if (!isConnected) {
    return (
      <Button
        onClick={handleConnect}
        variant={isFloating ? "ghost" : "outline"}
        size={isFloating ? "icon" : "default"}
        className={`${
          isFloating
            ? "w-full h-full bg-white border-2 border-[#2C3930] text-[#2C3930] hover:bg-[#2C3930] hover:text-white rounded-xl"
            : "gap-2 px-6 py-3 whitespace-nowrap h-12 bg-white border-2 border-[#2C3930] text-[#2C3930] hover:bg-[#2C3930] hover:text-white"
        } ${className}`}
        title="Connect to GitHub for cloud sync"
      >
        <Github
          className={`${isFloating ? "w-4 h-4 lg:w-5 lg:h-5" : "w-5 h-5"}`}
        />
        {!isFloating && <span>Connect GitHub</span>}
      </Button>
    );
  }

  // For floating mode, show only the sync button
  if (isFloating) {
    return (
      <Button
        onClick={handleSync}
        disabled={isSyncing || showSuccess}
        variant="ghost"
        size="icon"
        className={`w-full h-full transition-all duration-200 rounded-xl ${
          showSuccess
            ? "bg-green-500 hover:bg-green-500 text-white"
            : "bg-white border-2 border-[#2C3930] text-[#2C3930] hover:bg-[#2C3930] hover:text-white"
        } ${className}`}
        title={
          showSuccess
            ? "Sync completed successfully!"
            : lastSyncTime
            ? `Last synced: ${lastSyncTime}`
            : "Sync with GitHub"
        }
      >
        {isSyncing ? (
          <div
            className={`animate-spin rounded-full h-4 w-4 lg:h-5 lg:w-5 border-b-2 ${
              showSuccess ? "border-white" : "border-[#2C3930]"
            }`}
          ></div>
        ) : showSuccess ? (
          <Check className="w-4 h-4 lg:w-5 lg:h-5" />
        ) : (
          <RefreshCw className="w-4 h-4 lg:w-5 lg:h-5" />
        )}
      </Button>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center gap-2">
        <Button
          onClick={handleSync}
          disabled={isSyncing}
          className="gap-2 px-6 py-3 bg-white border-2 border-[#2C3930] text-[#2C3930] hover:bg-[#2C3930] hover:text-white whitespace-nowrap h-12 transition-all"
          title={
            lastSyncTime ? `Last synced: ${lastSyncTime}` : "Sync with GitHub"
          }
        >
          {isSyncing ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#2C3930]"></div>
              <span>Syncing...</span>
            </>
          ) : (
            <>
              <RefreshCw className="w-5 h-5" />
              <span>Sync</span>
            </>
          )}
        </Button>

        <Button
          variant="outline"
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="gap-2 p-3 h-12"
          title="GitHub account menu"
        >
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.login}
              width={24}
              height={24}
              className="w-6 h-6 rounded-full"
            />
          ) : (
            <Github className="w-6 h-6 text-gray-600" />
          )}

          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              showUserMenu ? "rotate-180" : ""
            }`}
          />
        </Button>
      </div>

      {/* User Menu Dropdown */}
      {showUserMenu && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3">
              {user?.avatar_url && (
                <Image
                  src={user.avatar_url}
                  alt={user.login}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div>
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

            <Button
              variant="ghost"
              onClick={handleDisconnect}
              className="w-full justify-start text-sm text-red-600 hover:bg-red-50"
            >
              Disconnect GitHub
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
