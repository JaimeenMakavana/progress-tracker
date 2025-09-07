"use client";

import { useState } from "react";
import { multiGistSync } from "../../services/multiGistSync";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { AlertCircle, CheckCircle, XCircle, RefreshCw } from "lucide-react";

interface DebugStatus {
  isAuthenticated: boolean;
  gistIds: Record<string, string>;
  gistStatus: Record<
    string,
    { exists: boolean; accessible: boolean; error?: string }
  >;
  recommendations: string[];
}

export function SyncDebugger() {
  const [debugStatus, setDebugStatus] = useState<DebugStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const runDebugCheck = async () => {
    setIsLoading(true);
    try {
      const status = await multiGistSync.debugSyncStatus();
      setDebugStatus(status);
    } catch (error) {
      console.error("Debug check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const reauthenticate = async () => {
    try {
      await multiGistSync.authenticate();
    } catch (error) {
      console.error("Authentication failed:", error);
    }
  };

  const recreateGists = async () => {
    setIsLoading(true);
    try {
      const result = await multiGistSync.forceRecreateAllGists();
      if (result.success) {
        console.log("✅ All gists recreated successfully");
        // Refresh debug status
        await runDebugCheck();
      } else {
        console.error("❌ Gist recreation failed:", result.error);
        console.error("Individual results:", result.results);
      }
    } catch (error) {
      console.error("Gist recreation failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetSyncState = async () => {
    setIsLoading(true);
    try {
      await multiGistSync.resetSyncState();
      console.log("✅ Sync state reset complete");
      setDebugStatus(null);
    } catch (error) {
      console.error("Reset failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          GitHub Gist Sync Debugger
        </CardTitle>
        <CardDescription>
          Diagnose and fix GitHub Gist synchronization issues
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          <Button onClick={runDebugCheck} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                Checking...
              </>
            ) : (
              <>
                <AlertCircle className="h-4 w-4 mr-2" />
                Run Debug Check
              </>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={reauthenticate}
            disabled={isLoading}
          >
            Re-authenticate
          </Button>
          <Button
            variant="outline"
            onClick={recreateGists}
            disabled={isLoading}
          >
            Recreate Gists
          </Button>
          <Button
            variant="destructive"
            onClick={resetSyncState}
            disabled={isLoading}
          >
            Reset All
          </Button>
        </div>

        {debugStatus && (
          <div className="space-y-4">
            {/* Authentication Status */}
            <div className="flex items-center gap-2">
              <span className="font-medium">Authentication:</span>
              {debugStatus.isAuthenticated ? (
                <Badge
                  variant="default"
                  className="bg-green-100 text-green-800"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Authenticated
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <XCircle className="h-3 w-3 mr-1" />
                  Not Authenticated
                </Badge>
              )}
            </div>

            {/* Gist Status */}
            <div>
              <h4 className="font-medium mb-2">Gist Status:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {Object.entries(debugStatus.gistStatus).map(
                  ([dataType, status]) => (
                    <div
                      key={dataType}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="font-mono text-sm">{dataType}</span>
                      <div className="flex items-center gap-2">
                        {status.accessible ? (
                          <Badge
                            variant="default"
                            className="bg-green-100 text-green-800"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            OK
                          </Badge>
                        ) : (
                          <Badge variant="destructive">
                            <XCircle className="h-3 w-3 mr-1" />
                            Error
                          </Badge>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Gist IDs */}
            <div>
              <h4 className="font-medium mb-2">Stored Gist IDs:</h4>
              <div className="bg-gray-50 p-3 rounded font-mono text-sm">
                {Object.entries(debugStatus.gistIds).map(([type, id]) => (
                  <div key={type} className="flex justify-between">
                    <span>{type}:</span>
                    <span className="text-blue-600">{id}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div>
              <h4 className="font-medium mb-2">Recommendations:</h4>
              <ul className="space-y-1">
                {debugStatus.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Error Details */}
            {Object.entries(debugStatus.gistStatus).some(
              ([, status]) => !status.accessible
            ) && (
              <div>
                <h4 className="font-medium mb-2">Error Details:</h4>
                <div className="space-y-2">
                  {Object.entries(debugStatus.gistStatus)
                    .filter(([, status]) => !status.accessible)
                    .map(([dataType, status]) => (
                      <div
                        key={dataType}
                        className="bg-red-50 p-3 rounded border border-red-200"
                      >
                        <div className="font-medium text-red-800">
                          {dataType}
                        </div>
                        <div className="text-red-600 text-sm mt-1">
                          {status.error}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
