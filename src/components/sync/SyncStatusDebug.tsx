"use client";

import { useState, useEffect } from "react";
import { multiGistSync } from "../../services/multiGistSync";
import { useTrackers } from "../../context/TrackersContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { RefreshCw, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export function SyncStatusDebug() {
  const { state, syncWithGitHub, isGitHubConnected } = useTrackers();
  const [syncStatus, setSyncStatus] = useState<{
    isAuthenticated: boolean;
    gistIds: Record<string, string>;
    lastSyncTime?: string;
    lastSyncStatus?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);
  const [lastSyncStatus, setLastSyncStatus] = useState<string | null>(null);

  const updateStatus = () => {
    const status = multiGistSync.getSyncStatus();
    setSyncStatus(status);
    setLastSyncTime(localStorage.getItem("last_sync_time"));
    setLastSyncStatus(localStorage.getItem("last_sync_status"));
  };

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const handleManualSync = async () => {
    setIsLoading(true);
    try {
      const result = await syncWithGitHub();
      console.log("Manual sync result:", result);
      updateStatus();
    } catch (error) {
      console.error("Manual sync error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-orange-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "error":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <RefreshCw className="h-5 w-5" />
          Real-time Sync Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-semibold mb-2">Connection Status</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>GitHub Connected:</span>
                <Badge
                  variant={isGitHubConnected() ? "default" : "destructive"}
                >
                  {isGitHubConnected() ? "Yes" : "No"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span>Sync Needed:</span>
                <Badge
                  variant={
                    multiGistSync.isSyncNeeded() ? "destructive" : "default"
                  }
                >
                  {multiGistSync.isSyncNeeded() ? "Yes" : "No"}
                </Badge>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Last Sync</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span>Time:</span>
                <span className="text-sm text-gray-600">
                  {lastSyncTime || "Never"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(lastSyncStatus || "unknown")}
                  <Badge
                    className={getStatusColor(lastSyncStatus || "unknown")}
                  >
                    {lastSyncStatus || "Unknown"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {syncStatus && (
          <div>
            <h4 className="font-semibold mb-2">Gist Status</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(syncStatus.gistIds || {}).map(([type, id]) => (
                <div key={type} className="text-sm">
                  <div className="font-medium">{type}</div>
                  <div className="text-gray-600 truncate">{id as string}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h4 className="font-semibold mb-2">Local Data</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Trackers: {Object.keys(state.trackers || {}).length}</div>
            <div>Todos: {(state.todos || []).length}</div>
            <div>Categories: {(state.categories || []).length}</div>
            <div>Last Updated: {state.appMeta?.lastUpdated}</div>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleManualSync}
            disabled={isLoading || !isGitHubConnected()}
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Syncing...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Force Sync
              </>
            )}
          </Button>
          <Button variant="outline" onClick={updateStatus}>
            Refresh Status
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
