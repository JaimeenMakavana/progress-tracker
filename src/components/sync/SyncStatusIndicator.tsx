"use client";

import React, { useState, useEffect } from "react";
import { multiGistSync } from "../../services/multiGistSync";
import { Badge } from "../ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  RefreshCw,
} from "lucide-react";

interface SyncStatusIndicatorProps {
  className?: string;
  showDetails?: boolean;
}

export function SyncStatusIndicator({
  className = "",
  showDetails = false,
}: SyncStatusIndicatorProps) {
  const [syncStatus, setSyncStatus] = useState(multiGistSync.getSyncStatus());
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    // Update status every 30 seconds
    const interval = setInterval(() => {
      setSyncStatus(multiGistSync.getSyncStatus());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const refreshStatus = async () => {
    setIsRefreshing(true);
    try {
      setSyncStatus(multiGistSync.getSyncStatus());
    } finally {
      setIsRefreshing(false);
    }
  };

  const getStatusIcon = () => {
    if (!syncStatus.isAuthenticated) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }

    if (syncStatus.missingGists.length > 0) {
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    }

    if (syncStatus.lastSyncStatus === "success") {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }

    if (syncStatus.lastSyncStatus === "failed") {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }

    return <Clock className="h-4 w-4 text-gray-500" />;
  };

  const getStatusText = () => {
    if (!syncStatus.isAuthenticated) {
      return "Not Connected";
    }

    if (syncStatus.missingGists.length > 0) {
      return `${syncStatus.missingGists.length} Missing Gists`;
    }

    if (syncStatus.lastSyncStatus === "success") {
      return "Synced";
    }

    if (syncStatus.lastSyncStatus === "failed") {
      return "Sync Failed";
    }

    return "Ready";
  };

  const getStatusColor = () => {
    if (!syncStatus.isAuthenticated) {
      return "bg-red-100 text-red-800";
    }

    if (syncStatus.missingGists.length > 0) {
      return "bg-yellow-100 text-yellow-800";
    }

    if (syncStatus.lastSyncStatus === "success") {
      return "bg-green-100 text-green-800";
    }

    if (syncStatus.lastSyncStatus === "failed") {
      return "bg-red-100 text-red-800";
    }

    return "bg-gray-100 text-gray-800";
  };

  if (showDetails) {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="flex items-center gap-2">
          <button
            onClick={refreshStatus}
            disabled={isRefreshing}
            className="p-1 hover:bg-gray-100 rounded"
            title="Refresh status"
          >
            <RefreshCw
              className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
            />
          </button>
          <span className="font-medium text-sm">Sync Status</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getStatusIcon()}
            <Badge className={getStatusColor()}>{getStatusText()}</Badge>
          </div>

          {syncStatus.lastSyncTime && (
            <div className="text-xs text-gray-600">
              Last sync: {new Date(syncStatus.lastSyncTime).toLocaleString()}
            </div>
          )}

          {syncStatus.missingGists.length > 0 && (
            <div className="text-xs text-yellow-600">
              Missing: {syncStatus.missingGists.join(", ")}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        onClick={refreshStatus}
        disabled={isRefreshing}
        className="p-1 hover:bg-gray-100 rounded"
        title="Refresh sync status"
      >
        <RefreshCw
          className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
        />
      </button>
      {getStatusIcon()}
      <Badge className={getStatusColor()}>{getStatusText()}</Badge>
    </div>
  );
}
