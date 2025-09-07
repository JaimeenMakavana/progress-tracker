# Multi-Gist Sync Service Guide

## Overview

The Multi-Gist Sync Service is a powerful upgrade to the original single-gist GitHub sync system. It organizes your app data across multiple GitHub Gists for better organization, performance, and maintainability.

## Key Features

### 🗂️ **Organized Data Storage**

- **App Metadata**: Version info, sync timestamps
- **Trackers**: All your tracker data and groups
- **Challenges**: Gamification challenges and achievements
- **Todos**: Todo items, categories, stats, and achievements
- **Analytics**: Snapshots, quiz items, and task pages

### ⚡ **Selective Syncing**

- Sync only specific data types (e.g., just todos)
- Upload/download multiple types in parallel
- Full app state sync with intelligent merging

### 🔄 **Smart Data Merging**

- Combines local and remote data intelligently
- Handles conflicts gracefully
- Preserves data integrity

## Usage Examples

### Basic Authentication

```typescript
import { multiGistSync } from "@/services/multiGistSync";

// Check if authenticated
const isConnected = multiGistSync.isAuthenticated();

// Start OAuth flow
await multiGistSync.authenticate();

// Get current user
const user = await multiGistSync.getCurrentUser();
```

### Selective Data Operations

```typescript
// Upload only todos
const todoData = {
  todos: [...],
  categories: [...],
  stats: {...},
  achievements: [...]
};
await multiGistSync.uploadDataByType('todos', todoData);

// Download only trackers
const result = await multiGistSync.downloadDataByType('trackers');
if (result.success) {
  console.log('Trackers:', result.data);
}

// Upload multiple types at once
const dataMap = {
  todos: todoData,
  trackers: trackerData,
  challenges: challengeData
};
await multiGistSync.uploadMultipleDataTypes(dataMap);
```

### Full App State Sync

```typescript
// Complete sync (download, merge, upload)
const result = await multiGistSync.syncAppState(localAppState);
if (result.success) {
  console.log("Sync successful!");
  console.log("Merged state:", result.mergedAppState);
} else {
  console.error("Sync failed:", result.error);
}
```

## Gist Organization

Each data type gets its own GitHub Gist:

| Data Type    | Gist Description                        | Filename                      |
| ------------ | --------------------------------------- | ----------------------------- |
| `appMeta`    | Progress OS - App Metadata              | `progress-os-app-meta.json`   |
| `trackers`   | Progress OS - Trackers Data             | `progress-os-trackers.json`   |
| `challenges` | Progress OS - Challenges & Achievements | `progress-os-challenges.json` |
| `todos`      | Progress OS - Todos & Quick Tasks       | `progress-os-todos.json`      |
| `analytics`  | Progress OS - Analytics & History       | `progress-os-analytics.json`  |

## Migration from Single Gist

The service automatically handles migration from the old single-gist system:

1. **First Authentication**: Creates all required gists
2. **Data Migration**: Existing data is automatically distributed
3. **Backward Compatibility**: Old gist is preserved during transition

## Error Handling

The service provides comprehensive error handling:

```typescript
const result = await multiGistSync.uploadDataByType("todos", data);
if (!result.success) {
  console.error("Upload failed:", result.error);
  // Handle error appropriately
}
```

Common error scenarios:

- **Not authenticated**: User needs to connect GitHub
- **Invalid data type**: Check gist type spelling
- **Network issues**: Retry or show user-friendly message
- **Gist not found**: Service will create missing gists automatically

## Performance Benefits

### 🚀 **Faster Sync Times**

- Only sync what changed
- Parallel uploads/downloads
- Smaller individual gist files

### 💾 **Better Storage Efficiency**

- Organized data structure
- Easier to debug and maintain
- Reduced GitHub API rate limiting

### 🔧 **Improved Development**

- Easier to test individual components
- Better error isolation
- Cleaner data organization

## Testing

Run the integration tests:

```typescript
// In browser console
testMultiGistIntegration.testFullSyncFlow();
testMultiGistIntegration.testDataMerging();
```

## Best Practices

1. **Use Selective Sync**: Only sync data types that have changed
2. **Handle Errors Gracefully**: Always check `result.success`
3. **Monitor Sync Status**: Show users sync progress and results
4. **Backup Important Data**: Keep local backups before major syncs
5. **Test Thoroughly**: Use the provided test functions

## Troubleshooting

### Common Issues

**"Not authenticated" errors**

- Ensure user has completed GitHub OAuth flow
- Check if access token is valid

**"Gist not found" errors**

- Service will create missing gists automatically
- Check GitHub permissions

**Sync conflicts**

- Service handles merging automatically
- Local data takes precedence in conflicts
- Check console logs for merge details

### Debug Mode

Enable detailed logging by checking browser console for:

- Gist creation/updates
- Data upload/download progress
- Merge operations
- Error details

## Future Enhancements

Planned improvements:

- **Conflict Resolution UI**: Let users choose how to resolve conflicts
- **Sync Scheduling**: Automatic background sync
- **Data Compression**: Reduce gist sizes
- **Offline Support**: Queue sync operations when offline
- **Sync Analytics**: Track sync performance and usage

---

## Quick Reference

```typescript
// Import
import { multiGistSync } from "@/services/multiGistSync";

// Check status
multiGistSync.isAuthenticated();
multiGistSync.getAvailableGistTypes();
multiGistSync.getAllGistIds();

// Sync operations
multiGistSync.uploadDataByType(type, data);
multiGistSync.downloadDataByType(type);
multiGistSync.syncAppState(appState);

// Authentication
multiGistSync.authenticate();
multiGistSync.logout();
multiGistSync.getCurrentUser();
```

For more details, check the source code in `src/services/multiGistSync.ts`.
