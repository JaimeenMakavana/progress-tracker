import {
  AppState,
  Tracker,
  TrackerGroup,
  Challenge,
  Achievement,
  Todo,
  TodoCategory,
  TodoStats,
  TodoAchievement,
  DailySnapshot,
  QuizItem,
  TaskPage,
} from "../types";

// Gist configuration for different data types
export interface GistConfig {
  key: string;
  description: string;
  filename: string;
  storageKey: string;
}

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

class MultiGistSyncService {
  private accessToken: string | null = null;
  private gistIds: Record<string, string> = {};

  // Multi-gist configuration
  private readonly GIST_CONFIGS: Record<string, GistConfig> = {
    appMeta: {
      key: "appMeta",
      description: "Progress OS - App Metadata",
      filename: "progress-os-app-meta.json",
      storageKey: "github_gist_app_meta_id",
    },
    trackers: {
      key: "trackers",
      description: "Progress OS - Trackers Data",
      filename: "progress-os-trackers.json",
      storageKey: "github_gist_trackers_id",
    },
    challenges: {
      key: "challenges",
      description: "Progress OS - Challenges & Achievements",
      filename: "progress-os-challenges.json",
      storageKey: "github_gist_challenges_id",
    },
    todos: {
      key: "todos",
      description: "Progress OS - Todos & Quick Tasks",
      filename: "progress-os-todos.json",
      storageKey: "github_gist_todos_id",
    },
    analytics: {
      key: "analytics",
      description: "Progress OS - Analytics & History",
      filename: "progress-os-analytics.json",
      storageKey: "github_gist_analytics_id",
    },
  };

  // GitHub OAuth configuration
  private readonly CLIENT_ID = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  private readonly REDIRECT_URI =
    typeof window !== "undefined"
      ? `${window.location.origin}/auth/github/callback`
      : "";

  constructor() {
    this.loadStoredCredentials();
  }

  /**
   * Load stored credentials and gist IDs from localStorage
   */
  private loadStoredCredentials() {
    if (typeof window !== "undefined") {
      this.accessToken = localStorage.getItem("github_access_token");

      // Load all gist IDs
      Object.values(this.GIST_CONFIGS).forEach((config) => {
        const gistId = localStorage.getItem(config.storageKey);
        if (gistId) {
          this.gistIds[config.key] = gistId;
        }
      });
    }
  }

  /**
   * Save credentials and gist IDs to localStorage
   */
  private saveCredentials(token: string, gistIds?: Record<string, string>) {
    if (typeof window !== "undefined") {
      localStorage.setItem("github_access_token", token);

      if (gistIds) {
        Object.entries(gistIds).forEach(([key, gistId]) => {
          const config = this.GIST_CONFIGS[key];
          if (config) {
            localStorage.setItem(config.storageKey, gistId);
          }
        });
      }
    }
    this.accessToken = token;
    if (gistIds) {
      this.gistIds = { ...this.gistIds, ...gistIds };
    }
  }

  /**
   * Clear all credentials and gist IDs
   */
  private clearCredentials() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("github_access_token");

      // Clear all gist IDs
      Object.values(this.GIST_CONFIGS).forEach((config) => {
        localStorage.removeItem(config.storageKey);
      });
    }
    this.accessToken = null;
    this.gistIds = {};
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

      // Find or create all gists
      await this.findOrCreateAllGists();

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
   * Generate random state for OAuth
   */
  private generateState(): string {
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }

  /**
   * Logout and clear credentials
   */
  logout(): void {
    this.clearCredentials();
  }

  // =============================================================================
  // STEP 2: GIST MANAGEMENT METHODS
  // =============================================================================

  /**
   * Find or create all required gists
   */
  private async findOrCreateAllGists(): Promise<void> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const newGistIds: Record<string, string> = {};

    for (const [key, config] of Object.entries(this.GIST_CONFIGS)) {
      console.log(`Processing gist: ${key} (${config.description})`);

      // Check if we already have this gist ID
      if (this.gistIds[key]) {
        newGistIds[key] = this.gistIds[key];
        console.log(`Already have gist ID for ${key}: ${this.gistIds[key]}`);
        continue;
      }

      // Try to find existing gist
      const existingGist = await this.findExistingGist(config.description);
      if (existingGist) {
        newGistIds[key] = existingGist.id;
        console.log(`Found existing gist for ${key}: ${existingGist.id}`);
        continue;
      }

      // Create new gist
      console.log(`Creating new gist for ${key}...`);
      const gist = await this.createGist(
        config,
        this.getInitialDataForGist(key)
      );
      newGistIds[key] = gist.id;
      console.log(`Created new gist for ${key}: ${gist.id}`);
    }

    this.saveCredentials(this.accessToken, newGistIds);
    console.log("All gists processed successfully");
  }

  /**
   * Find existing gist by description
   */
  private async findExistingGist(
    description: string
  ): Promise<GitHubGist | null> {
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
      return gists.find((gist) => gist.description === description) || null;
    } catch (error) {
      console.error("Error finding existing gist:", error);
      return null;
    }
  }

  /**
   * Create new gist
   */
  private async createGist(
    config: GistConfig,
    initialData: unknown
  ): Promise<GitHubGist> {
    if (!this.accessToken) {
      throw new Error("Not authenticated");
    }

    const response = await fetch("https://api.github.com/gists", {
      method: "POST",
      headers: {
        Authorization: `token ${this.accessToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description: config.description,
        public: false,
        files: {
          [config.filename]: {
            content: JSON.stringify(initialData, null, 2),
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create gist: ${config.description}`);
    }

    return await response.json();
  }

  /**
   * Get initial data for each gist type
   */
  private getInitialDataForGist(gistType: string): unknown {
    switch (gistType) {
      case "appMeta":
        return {
          appMeta: {
            version: "2.0.0",
            lastUpdated: new Date().toISOString(),
          },
        };
      case "trackers":
        return {
          trackers: {},
          trackerGroups: {},
        };
      case "challenges":
        return {
          challenges: {},
          globalAchievements: {},
        };
      case "todos":
        return {
          todos: [],
          categories: [],
          stats: {
            totalTodos: 0,
            completedTodos: 0,
            pendingTodos: 0,
            totalXP: 0,
            currentStreak: 0,
            longestStreak: 0,
            averageCompletionTime: 0,
            categoryBreakdown: {},
            typeBreakdown: {},
            weeklyProgress: [],
          },
          achievements: [],
        };
      case "analytics":
        return {
          snapshots: [],
          quizItems: {},
          taskPages: {},
        };
      default:
        return {};
    }
  }

  /**
   * Get list of available gist types
   */
  getAvailableGistTypes(): string[] {
    return Object.keys(this.GIST_CONFIGS);
  }

  /**
   * Get gist configuration for a specific type
   */
  getGistConfig(gistType: string): GistConfig | null {
    return this.GIST_CONFIGS[gistType] || null;
  }

  /**
   * Check if a specific gist is available
   */
  hasGist(gistType: string): boolean {
    return !!this.gistIds[gistType];
  }

  /**
   * Get all current gist IDs
   */
  getAllGistIds(): Record<string, string> {
    return { ...this.gistIds };
  }

  /**
   * Debug method to check sync status and identify issues
   */
  async debugSyncStatus(): Promise<{
    isAuthenticated: boolean;
    gistIds: Record<string, string>;
    gistStatus: Record<
      string,
      { exists: boolean; accessible: boolean; error?: string }
    >;
    recommendations: string[];
  }> {
    const debugInfo = {
      isAuthenticated: this.isAuthenticated(),
      gistIds: this.getAllGistIds(),
      gistStatus: {} as Record<
        string,
        { exists: boolean; accessible: boolean; error?: string }
      >,
      recommendations: [] as string[],
    };

    // Check authentication
    if (!debugInfo.isAuthenticated) {
      debugInfo.recommendations.push(
        "Not authenticated - please re-authenticate with GitHub"
      );
      return debugInfo;
    }

    // Check each gist
    for (const [dataType, gistId] of Object.entries(debugInfo.gistIds)) {
      try {
        const response = await fetch(`https://api.github.com/gists/${gistId}`, {
          headers: {
            Authorization: `token ${this.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        });

        if (response.ok) {
          debugInfo.gistStatus[dataType] = { exists: true, accessible: true };
        } else {
          debugInfo.gistStatus[dataType] = {
            exists: true,
            accessible: false,
            error: `HTTP ${response.status}: ${await response.text()}`,
          };
        }
      } catch (error) {
        debugInfo.gistStatus[dataType] = {
          exists: false,
          accessible: false,
          error: error instanceof Error ? error.message : "Unknown error",
        };
      }
    }

    // Generate recommendations
    const inaccessibleGists = Object.entries(debugInfo.gistStatus).filter(
      ([, status]) => !status.accessible
    );

    if (inaccessibleGists.length > 0) {
      debugInfo.recommendations.push(
        `Found ${
          inaccessibleGists.length
        } inaccessible gists: ${inaccessibleGists
          .map(([type]) => type)
          .join(", ")}`
      );
    }

    const missingGists = Object.keys(this.GIST_CONFIGS).filter(
      (type) => !debugInfo.gistIds[type]
    );

    if (missingGists.length > 0) {
      debugInfo.recommendations.push(
        `Missing gist IDs for: ${missingGists.join(
          ", "
        )} - run findOrCreateAllGists()`
      );
    }

    if (debugInfo.recommendations.length === 0) {
      debugInfo.recommendations.push(
        "All gists appear to be accessible - check network connectivity"
      );
    }

    return debugInfo;
  }

  /**
   * Force recreate all gists (useful for fixing sync issues)
   */
  async forceRecreateAllGists(): Promise<{
    success: boolean;
    results: Record<
      string,
      { success: boolean; error?: string; gistId?: string }
    >;
    error?: string;
  }> {
    if (!this.accessToken) {
      return {
        success: false,
        results: {},
        error: "Not authenticated",
      };
    }

    const results: Record<
      string,
      { success: boolean; error?: string; gistId?: string }
    > = {};
    const newGistIds: Record<string, string> = {};

    console.log("🔄 Force recreating all gists...");

    for (const [key, config] of Object.entries(this.GIST_CONFIGS)) {
      try {
        console.log(`Creating gist for ${key}...`);

        // Create new gist with initial data
        const gist = await this.createGist(
          config,
          this.getInitialDataForGist(key)
        );
        newGistIds[key] = gist.id;
        results[key] = { success: true, gistId: gist.id };

        console.log(`✅ Created gist for ${key}: ${gist.id}`);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        results[key] = { success: false, error: errorMessage };
        console.error(`❌ Failed to create gist for ${key}:`, errorMessage);
      }
    }

    // Update stored gist IDs
    this.saveCredentials(this.accessToken, newGistIds);

    const allSuccessful = Object.values(results).every(
      (result) => result.success
    );

    return {
      success: allSuccessful,
      results,
      error: allSuccessful ? undefined : "Some gists failed to create",
    };
  }

  /**
   * Clear all stored gist IDs and force re-authentication
   */
  async resetSyncState(): Promise<void> {
    console.log("🔄 Resetting sync state...");

    // Clear all stored data
    this.clearCredentials();

    // Clear localStorage
    if (typeof window !== "undefined") {
      // Clear all gist-related localStorage items
      Object.values(this.GIST_CONFIGS).forEach((config) => {
        localStorage.removeItem(config.storageKey);
      });
      localStorage.removeItem("github_access_token");
      localStorage.removeItem("last_sync_time");
    }

    console.log("✅ Sync state reset complete");
  }

  /**
   * Quick status check for debugging
   */
  getSyncStatus(): {
    isAuthenticated: boolean;
    gistCount: number;
    missingGists: string[];
    gistIds: Record<string, string>;
  } {
    const missingGists = Object.keys(this.GIST_CONFIGS).filter(
      (type) => !this.gistIds[type]
    );

    return {
      isAuthenticated: this.isAuthenticated(),
      gistCount: Object.keys(this.gistIds).length,
      missingGists,
      gistIds: { ...this.gistIds },
    };
  }

  // =============================================================================
  // STEP 4: SELECTIVE SYNC METHODS
  // =============================================================================

  /**
   * Upload specific data type to its gist
   */
  async uploadDataByType(
    dataType: string,
    data: unknown
  ): Promise<{ success: boolean; error?: string }> {
    const config = this.GIST_CONFIGS[dataType];
    if (!config) {
      return { success: false, error: `Invalid data type: ${dataType}` };
    }

    if (!this.accessToken) {
      return { success: false, error: "Not authenticated" };
    }

    // If gist doesn't exist, try to create it first
    if (!this.gistIds[dataType]) {
      console.log(`🔄 No gist found for ${dataType}, attempting to create...`);
      try {
        const gist = await this.createGist(config, data);
        this.gistIds[dataType] = gist.id;
        this.saveCredentials(this.accessToken, { [dataType]: gist.id });
        console.log(`✅ Created new gist for ${dataType}: ${gist.id}`);
        return { success: true };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(
          `❌ Failed to create gist for ${dataType}:`,
          errorMessage
        );
        return {
          success: false,
          error: `Failed to create gist for ${dataType}: ${errorMessage}`,
        };
      }
    }

    try {
      console.log(
        `Uploading ${dataType} data to gist ${this.gistIds[dataType]}`
      );

      const response = await fetch(
        `https://api.github.com/gists/${this.gistIds[dataType]}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `token ${this.accessToken}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            description: config.description,
            files: {
              [config.filename]: {
                content: JSON.stringify(data, null, 2),
              },
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to upload ${dataType}: ${response.status} ${errorText}`
        );
      }

      console.log(`Successfully uploaded ${dataType} data`);
      return { success: true };
    } catch (error) {
      console.error(`Error uploading ${dataType}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Download specific data type from its gist
   */
  async downloadDataByType(
    dataType: string
  ): Promise<{ success: boolean; data?: unknown; error?: string }> {
    const config = this.GIST_CONFIGS[dataType];
    if (!config) {
      return { success: false, error: `Invalid data type: ${dataType}` };
    }

    if (!this.accessToken) {
      return { success: false, error: "Not authenticated" };
    }

    // If gist doesn't exist, try to create it first
    if (!this.gistIds[dataType]) {
      console.log(`🔄 No gist found for ${dataType}, attempting to create...`);
      try {
        const initialData = this.getInitialDataForGist(dataType);
        const gist = await this.createGist(config, initialData);
        this.gistIds[dataType] = gist.id;
        this.saveCredentials(this.accessToken, { [dataType]: gist.id });
        console.log(`✅ Created new gist for ${dataType}: ${gist.id}`);

        // Return the initial data since we just created the gist
        return { success: true, data: initialData };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(
          `❌ Failed to create gist for ${dataType}:`,
          errorMessage
        );
        return {
          success: false,
          error: `Failed to create gist for ${dataType}: ${errorMessage}`,
        };
      }
    }

    try {
      console.log(
        `Downloading ${dataType} data from gist ${this.gistIds[dataType]}`
      );

      const response = await fetch(
        `https://api.github.com/gists/${this.gistIds[dataType]}`,
        {
          headers: {
            Authorization: `token ${this.accessToken}`,
            Accept: "application/vnd.github.v3+json",
          },
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Failed to download ${dataType}: ${response.status} ${errorText}`
        );
      }

      const gist: GitHubGist = await response.json();
      const file = gist.files[config.filename];

      if (!file) {
        throw new Error(`${config.filename} not found in gist`);
      }

      const data = JSON.parse(file.content);
      console.log(`Successfully downloaded ${dataType} data`);

      return { success: true, data };
    } catch (error) {
      console.error(`Error downloading ${dataType}:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Upload multiple data types at once
   */
  async uploadMultipleDataTypes(dataMap: Record<string, unknown>): Promise<{
    success: boolean;
    results: Record<string, { success: boolean; error?: string }>;
    error?: string;
  }> {
    const results: Record<string, { success: boolean; error?: string }> = {};

    try {
      // Upload all data types in parallel
      const uploadPromises = Object.entries(dataMap).map(
        async ([dataType, data]) => {
          const result = await this.uploadDataByType(dataType, data);
          results[dataType] = result;
          return result;
        }
      );

      await Promise.all(uploadPromises);

      // Check if all uploads were successful
      const allSuccessful = Object.values(results).every(
        (result) => result.success
      );

      return {
        success: allSuccessful,
        results,
        error: allSuccessful ? undefined : "Some uploads failed",
      };
    } catch (error) {
      return {
        success: false,
        results,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Download multiple data types at once
   */
  async downloadMultipleDataTypes(dataTypes: string[]): Promise<{
    success: boolean;
    data: Record<string, unknown>;
    results: Record<string, { success: boolean; error?: string }>;
    error?: string;
  }> {
    const data: Record<string, unknown> = {};
    const results: Record<string, { success: boolean; error?: string }> = {};

    try {
      // Download all data types in parallel
      const downloadPromises = dataTypes.map(async (dataType) => {
        const result = await this.downloadDataByType(dataType);
        results[dataType] = { success: result.success, error: result.error };
        if (result.success && result.data) {
          data[dataType] = result.data;
        }
        return result;
      });

      await Promise.all(downloadPromises);

      // Check if all downloads were successful
      const allSuccessful = Object.values(results).every(
        (result) => result.success
      );

      return {
        success: allSuccessful,
        data,
        results,
        error: allSuccessful ? undefined : "Some downloads failed",
      };
    } catch (error) {
      return {
        success: false,
        data,
        results,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Download all available data types
   */
  async downloadAllData(): Promise<{
    success: boolean;
    data: Record<string, unknown>;
    results: Record<string, { success: boolean; error?: string }>;
    error?: string;
  }> {
    const availableTypes = this.getAvailableGistTypes();
    return await this.downloadMultipleDataTypes(availableTypes);
  }

  // =============================================================================
  // STEP 5: FULL APP SYNC METHODS
  // =============================================================================

  /**
   * Upload entire app state to all gists
   */
  async uploadFullAppState(appState: AppState): Promise<{
    success: boolean;
    results: Record<string, { success: boolean; error?: string }>;
    error?: string;
  }> {
    console.log("Starting full app state upload...");

    // Prepare data for each gist type
    const dataMap: Record<string, unknown> = {
      appMeta: {
        appMeta: {
          version: "2.0.0",
          lastUpdated: new Date().toISOString(),
          lastSync: new Date().toISOString(),
        },
      },
      trackers: {
        trackers: appState.trackers || {},
        trackerGroups: appState.trackerGroups || {},
      },
      challenges: {
        challenges: appState.challenges || {},
        globalAchievements: appState.globalAchievements || {},
      },
      todos: {
        todos: appState.todos || [],
        categories: appState.categories || [],
        stats: appState.todoStats || {
          totalTodos: 0,
          completedTodos: 0,
          pendingTodos: 0,
          totalXP: 0,
          currentStreak: 0,
          longestStreak: 0,
          averageCompletionTime: 0,
          categoryBreakdown: {},
          typeBreakdown: {},
          weeklyProgress: [],
        },
        achievements: appState.todoAchievements || [],
      },
      analytics: {
        snapshots: appState.snapshots || [],
        quizItems: appState.quizItems || {},
        taskPages: appState.taskPages || {},
      },
    };

    const result = await this.uploadMultipleDataTypes(dataMap);

    if (result.success) {
      console.log("Full app state upload completed successfully");
    } else {
      console.error("Full app state upload failed:", result.error);
    }

    return result;
  }

  /**
   * Download and merge all data into a complete app state
   */
  async downloadFullAppState(): Promise<{
    success: boolean;
    appState?: AppState;
    results: Record<string, { success: boolean; error?: string }>;
    error?: string;
  }> {
    console.log("Starting full app state download...");

    const downloadResult = await this.downloadAllData();

    if (!downloadResult.success) {
      return {
        success: false,
        results: downloadResult.results,
        error: downloadResult.error,
      };
    }

    try {
      // Merge all downloaded data into a complete AppState
      const appState: AppState = this.mergeDataIntoAppState(
        downloadResult.data
      );

      console.log("Full app state download and merge completed successfully");

      return {
        success: true,
        appState,
        results: downloadResult.results,
      };
    } catch (error) {
      console.error("Error merging app state:", error);
      return {
        success: false,
        results: downloadResult.results,
        error:
          error instanceof Error ? error.message : "Failed to merge app state",
      };
    }
  }

  /**
   * Merge downloaded data from all gists into a complete AppState
   */
  private mergeDataIntoAppState(data: Record<string, unknown>): AppState {
    const appState: AppState = {
      // Initialize with default values
      appMeta: {
        version: "2.0.0",
        lastUpdated: new Date().toISOString(),
      },
      trackers: {},
      trackerGroups: {},
      challenges: {},
      globalAchievements: {},
      todos: [],
      categories: [],
      todoStats: {
        totalTodos: 0,
        completedTodos: 0,
        pendingTodos: 0,
        totalXP: 0,
        currentStreak: 0,
        longestStreak: 0,
        averageCompletionTime: 0,
        categoryBreakdown: {},
        typeBreakdown: {},
        weeklyProgress: [],
      },
      todoAchievements: [],
      snapshots: [],
      quizItems: {},
      taskPages: {},
    };

    // Merge data from each gist type
    if (
      data.trackers &&
      typeof data.trackers === "object" &&
      data.trackers !== null
    ) {
      const trackersData = data.trackers as Record<string, unknown>;
      appState.trackers =
        (trackersData.trackers as Record<string, Tracker>) || {};
      appState.trackerGroups =
        (trackersData.trackerGroups as Record<string, TrackerGroup>) || {};
    }

    if (
      data.challenges &&
      typeof data.challenges === "object" &&
      data.challenges !== null
    ) {
      const challengesData = data.challenges as Record<string, unknown>;
      appState.challenges =
        (challengesData.challenges as Record<string, Challenge>) || {};
      appState.globalAchievements =
        (challengesData.globalAchievements as Record<string, Achievement>) ||
        {};
    }

    if (data.todos && typeof data.todos === "object" && data.todos !== null) {
      const todosData = data.todos as Record<string, unknown>;
      appState.todos = (todosData.todos as Todo[]) || [];
      appState.categories = (todosData.categories as TodoCategory[]) || [];
      appState.todoStats = (todosData.stats as TodoStats) || appState.todoStats;
      appState.todoAchievements =
        (todosData.achievements as TodoAchievement[]) || [];
    }

    if (
      data.analytics &&
      typeof data.analytics === "object" &&
      data.analytics !== null
    ) {
      const analyticsData = data.analytics as Record<string, unknown>;
      appState.snapshots = (analyticsData.snapshots as DailySnapshot[]) || [];
      appState.quizItems =
        (analyticsData.quizItems as Record<string, QuizItem>) || {};
      appState.taskPages =
        (analyticsData.taskPages as Record<string, TaskPage>) || {};
    }

    return appState;
  }

  /**
   * Ensure all required gists exist before sync
   */
  private async ensureAllGistsExist(): Promise<boolean> {
    const missingGists = Object.keys(this.GIST_CONFIGS).filter(
      (type) => !this.gistIds[type]
    );

    if (missingGists.length === 0) {
      return true; // All gists exist
    }

    console.log(`🔄 Creating missing gists: ${missingGists.join(", ")}`);

    for (const dataType of missingGists) {
      try {
        const config = this.GIST_CONFIGS[dataType];
        const initialData = this.getInitialDataForGist(dataType);
        const gist = await this.createGist(config, initialData);
        this.gistIds[dataType] = gist.id;
        console.log(`✅ Created gist for ${dataType}: ${gist.id}`);
      } catch (error) {
        console.error(`❌ Failed to create gist for ${dataType}:`, error);
        return false;
      }
    }

    // Save all new gist IDs
    if (this.accessToken) {
      this.saveCredentials(this.accessToken, this.gistIds);
    }
    return true;
  }

  /**
   * Sync app state (download, merge with local, upload)
   */
  async syncAppState(localAppState: AppState): Promise<{
    success: boolean;
    mergedAppState?: AppState;
    results: {
      download: { success: boolean; error?: string };
      upload: { success: boolean; error?: string };
    };
    error?: string;
  }> {
    console.log("Starting full app state sync...");

    // Ensure all gists exist before attempting sync
    const gistsReady = await this.ensureAllGistsExist();
    if (!gistsReady) {
      return {
        success: false,
        results: {
          download: {
            success: false,
            error: "Failed to create required gists",
          },
          upload: { success: false, error: "Failed to create required gists" },
        },
        error: "Failed to create required gists",
      };
    }

    const results = {
      download: { success: false, error: undefined as string | undefined },
      upload: { success: false, error: undefined as string | undefined },
    };

    try {
      // Step 1: Download remote data
      console.log("Step 1: Downloading remote data...");
      const downloadResult = await this.downloadFullAppState();
      results.download = {
        success: downloadResult.success,
        error: downloadResult.error,
      };

      if (!downloadResult.success) {
        console.error("Download failed, proceeding with local data only");
        console.error("Download error details:", downloadResult.error);
        console.error("Individual gist results:", downloadResult.results);

        // Log detailed failure information
        Object.entries(downloadResult.results).forEach(([gistType, result]) => {
          if (!result.success) {
            console.error(`❌ ${gistType} download failed:`, result.error);
          } else {
            console.log(`✅ ${gistType} download successful`);
          }
        });
      }

      // Step 2: Merge local and remote data
      console.log("Step 2: Merging local and remote data...");
      const mergedAppState =
        downloadResult.success && downloadResult.appState
          ? this.mergeLocalAndRemoteData(localAppState, downloadResult.appState)
          : localAppState;

      // Step 3: Upload merged data
      console.log("Step 3: Uploading merged data...");
      const uploadResult = await this.uploadFullAppState(mergedAppState);
      results.upload = {
        success: uploadResult.success,
        error: uploadResult.error,
      };

      if (uploadResult.success) {
        console.log("Full app state sync completed successfully");
        return {
          success: true,
          mergedAppState,
          results,
        };
      } else {
        console.error("Full app state sync failed:", uploadResult.error);
        console.error("Upload error details:", uploadResult.error);
        console.error("Individual upload results:", uploadResult.results);

        // Log detailed upload failure information
        Object.entries(uploadResult.results).forEach(([gistType, result]) => {
          if (!result.success) {
            console.error(`❌ ${gistType} upload failed:`, result.error);
          } else {
            console.log(`✅ ${gistType} upload successful`);
          }
        });

        return {
          success: false,
          mergedAppState,
          results,
          error: uploadResult.error,
        };
      }
    } catch (error) {
      console.error("Error during app state sync:", error);
      return {
        success: false,
        results,
        error: error instanceof Error ? error.message : "Unknown sync error",
      };
    }
  }

  /**
   * Merge local and remote app state data
   */
  private mergeLocalAndRemoteData(local: AppState, remote: AppState): AppState {
    console.log("Merging local and remote app state data...");

    // For now, we'll use a simple strategy: local data takes precedence
    // In a more sophisticated implementation, you might want to:
    // - Merge arrays (todos, snapshots) by ID
    // - Use timestamps to determine which data is newer
    // - Handle conflicts more intelligently

    const merged: AppState = {
      // Use local data as base, but merge in remote data where local is empty
      appMeta: local.appMeta ||
        remote.appMeta || {
          version: "2.0.0",
          lastUpdated: new Date().toISOString(),
        },
      trackers: { ...remote.trackers, ...local.trackers },
      trackerGroups: { ...remote.trackerGroups, ...local.trackerGroups },
      challenges: { ...remote.challenges, ...local.challenges },
      globalAchievements: {
        ...remote.globalAchievements,
        ...local.globalAchievements,
      },

      // For arrays, combine and deduplicate
      todos: this.mergeArrays(local.todos || [], remote.todos || [], "id"),
      categories: this.mergeArrays(
        local.categories || [],
        remote.categories || [],
        "id"
      ),
      todoAchievements: this.mergeArrays(
        local.todoAchievements || [],
        remote.todoAchievements || [],
        "id"
      ),
      snapshots: local.snapshots || remote.snapshots || [],

      // For stats, use local if it exists, otherwise use remote
      todoStats: local.todoStats || remote.todoStats,

      // For objects, merge them
      quizItems: { ...remote.quizItems, ...local.quizItems },
      taskPages: { ...remote.taskPages, ...local.taskPages },
    };

    console.log("App state merge completed");
    return merged;
  }

  /**
   * Helper method to merge arrays and deduplicate by ID
   */
  private mergeArrays<T extends { id: string }>(
    local: T[],
    remote: T[],
    idKey: keyof T
  ): T[] {
    const merged = [...remote];
    const remoteIds = new Set(remote.map((item) => item[idKey]));

    // Add local items that don't exist in remote
    local.forEach((item) => {
      if (!remoteIds.has(item[idKey])) {
        merged.push(item);
      }
    });

    return merged;
  }
}

export const multiGistSync = new MultiGistSyncService();
export default multiGistSync;
