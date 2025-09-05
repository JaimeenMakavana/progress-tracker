import { AppState } from "../types";

interface GitHubGist {
  id: string;
  description: string;
  public: boolean;
  files: Record<
    string,
    {
      filename: string;
      type: string;
      language: string;
      raw_url: string;
      size: number;
      truncated: boolean;
      content: string;
    }
  >;
  created_at: string;
  updated_at: string;
}

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
}

class GitHubSyncService {
  private accessToken: string | null = null;
  private gistId: string | null = null;
  private readonly GIST_DESCRIPTION = "Progress OS - Personal Tracker Data";
  private readonly GIST_FILENAME = "progress-os-data.json";

  // GitHub OAuth configuration
  private readonly CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  private readonly REDIRECT_URI =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/github/callback`
      : "";

  constructor() {
    this.loadStoredCredentials();
  }

  private loadStoredCredentials() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("github_access_token");
      this.gistId = localStorage.getItem("github_gist_id");
    }
  }

  private saveCredentials(token: string, gistId?: string) {
    if (typeof window !== "undefined") {
      localStorage.setItem("github_access_token", token);
      if (gistId) {
        localStorage.setItem("github_gist_id", gistId);
      }
    }
    this.accessToken = token;
    if (gistId) {
      this.gistId = gistId;
    }
  }

  private clearCredentials() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("github_access_token");
      localStorage.removeItem("github_gist_id");
    }
    this.accessToken = null;
    this.gistId = null;
  }

  /**
   * Start GitHub OAuth flow
   */
  async authenticate(): Promise<boolean> {
    if (!this.CLIENT_ID) {
      throw new Error("GitHub Client ID not configured");
    }

    const authUrl = new URL("https://github.com/login/oauth/authorize");
    authUrl.searchParams.set("client_id", this.CLIENT_ID);
    authUrl.searchParams.set("redirect_uri", this.REDIRECT_URI);
    authUrl.searchParams.set("scope", "gist");
    authUrl.searchParams.set("state", this.generateState());

    // Store state for verification
    if (typeof window !== "undefined") {
      sessionStorage.setItem(
        "github_oauth_state",
        authUrl.searchParams.get("state")!
      );
    }

    window.location.href = authUrl.toString();
    return true;
  }

  /**
   * Handle OAuth callback and exchange code for token
   */
  async handleCallback(code: string, state: string): Promise<boolean> {
    if (typeof window === "undefined") {
      return false;
    }

    const storedState = sessionStorage.getItem("github_oauth_state");
    if (state !== storedState) {
      throw new Error("Invalid OAuth state");
    }

    try {
      const response = await fetch("/api/github/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code, state }),
      });

      if (!response.ok) {
        throw new Error("Failed to exchange code for token");
      }

      const { access_token } = await response.json();
      this.saveCredentials(access_token);

      // Find or create gist
      await this.findOrCreateGist();

      sessionStorage.removeItem("github_oauth_state");
      return true;
    } catch (error) {
      console.error("OAuth callback error:", error);
      return false;
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<GitHubUser | null> {
    if (!this.accessToken) return null;

    try {
      const response = await fetch("https://api.github.com/user", {
        headers: {
          Authorization: `token ${this.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching user info:", error);
      return null;
    }
  }

  /**
   * Find existing gist or create new one
   */
  private async findOrCreateGist(): Promise<void> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    // First, try to find existing gist
    const existingGist = await this.findExistingGist();
    if (existingGist) {
      this.gistId = existingGist.id;
      this.saveCredentials(this.accessToken, this.gistId);
      return;
    }

    // Create new gist
    const gist = await this.createGist();
    this.gistId = gist.id;
    this.saveCredentials(this.accessToken, this.gistId);
  }

  /**
   * Find existing gist by description
   */
  private async findExistingGist(): Promise<GitHubGist | null> {
    if (!this.accessToken) return null;

    try {
      const response = await fetch("https://api.github.com/gists", {
        headers: {
          Authorization: `token ${this.accessToken}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch gists");
      }

      const gists: GitHubGist[] = await response.json();
      return (
        gists.find((gist) => gist.description === this.GIST_DESCRIPTION) || null
      );
    } catch (error) {
      console.error("Error finding existing gist:", error);
      return null;
    }
  }

  /**
   * Create new gist
   */
  private async createGist(): Promise<GitHubGist> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const initialData: AppState = {
      appMeta: {
        version: "2.0.0",
        lastUpdated: new Date().toISOString(),
      },
      trackers: {},
      snapshots: [],
      quizItems: {},
    };

    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${this.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: this.GIST_DESCRIPTION,
        public: false,
        files: {
          [this.GIST_FILENAME]: {
            content: JSON.stringify(initialData, null, 2),
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create gist");
    }

    return await response.json();
  }

  /**
   * Upload app data to GitHub Gist
   */
  async uploadData(data: AppState): Promise<boolean> {
    if (!this.accessToken || !this.gistId) {
      throw new Error("Not authenticated or gist not found");
    }

    try {
      const response = await fetch(
        `https://api.github.com/gists/${this.gistId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `token ${this.accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: this.GIST_DESCRIPTION,
            files: {
              [this.GIST_FILENAME]: {
                content: JSON.stringify(data, null, 2),
              },
            },
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload data");
      }

      return true;
    } catch (error) {
      console.error("Error uploading data:", error);
      return false;
    }
  }

  /**
   * Download app data from GitHub Gist
   */
  async downloadData(): Promise<AppState | null> {
    if (!this.accessToken || !this.gistId) {
      throw new Error("Not authenticated or gist not found");
    }

    try {
      const response = await fetch(
        `https://api.github.com/gists/${this.gistId}`,
        {
          headers: {
            Authorization: `token ${this.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to download data");
      }

      const gist: GitHubGist = await response.json();
      const file = gist.files[this.GIST_FILENAME];

      if (!file) {
        throw new Error("Data file not found in gist");
      }

      return JSON.parse(file.content);
    } catch (error) {
      console.error("Error downloading data:", error);
      return null;
    }
  }

  /**
   * Sync data (download, merge, upload)
   */
  async syncData(
    localData: AppState
  ): Promise<{ success: boolean; data?: AppState; error?: string }> {
    try {
      // Download remote data
      const remoteData = await this.downloadData();

      if (!remoteData) {
        // No remote data, upload local data
        await this.uploadData(localData);
        return { success: true, data: localData };
      }

      // Merge data (last-write-wins for now)
      const mergedData = this.mergeData(localData, remoteData);

      // Upload merged data
      await this.uploadData(mergedData);

      return { success: true, data: mergedData };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Merge local and remote data (simple last-write-wins strategy)
   */
  private mergeData(localData: AppState, remoteData: AppState): AppState {
    const localTime = new Date(localData.appMeta.lastUpdated).getTime();
    const remoteTime = new Date(remoteData.appMeta.lastUpdated).getTime();

    // Use the more recent data as base
    const baseData = localTime > remoteTime ? localData : remoteData;
    const otherData = localTime > remoteTime ? remoteData : localData;

    // Merge trackers (keep all unique trackers)
    const mergedTrackers = { ...baseData.trackers };
    Object.entries(otherData.trackers).forEach(([id, tracker]) => {
      if (!mergedTrackers[id]) {
        mergedTrackers[id] = tracker;
      } else {
        // If both exist, use the more recent one
        const baseTracker = mergedTrackers[id];
        const baseTrackerTime = new Date(baseTracker.updatedAt).getTime();
        const otherTrackerTime = new Date(tracker.updatedAt).getTime();

        if (otherTrackerTime > baseTrackerTime) {
          mergedTrackers[id] = tracker;
        }
      }
    });

    return {
      ...baseData,
      trackers: mergedTrackers,
      appMeta: {
        ...baseData.appMeta,
        lastUpdated: new Date().toISOString(),
      },
    };
  }

  /**
   * Logout and clear credentials
   */
  logout(): void {
    this.clearCredentials();
  }

  /**
   * Generate random state for OAuth
   */
  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}

export const githubSync = new GitHubSyncService();
export default githubSync;
