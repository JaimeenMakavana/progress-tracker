# GitHub Gist Sync Troubleshooting Guide

## Common Sync Issues and Solutions

### 1. Data Not Syncing Between Devices

**Symptoms:**

- Data appears different on mobile vs laptop
- Changes made on one device don't appear on another
- Sync button shows success but data remains out of sync

**Possible Causes & Solutions:**

#### A. Authentication Issues

- **Check:** Go to `/sync-debug` page and run "Run Debug Check"
- **Solution:** If not authenticated, click "Re-authenticate" to refresh GitHub token

#### B. Missing Gists

- **Check:** Debug page shows missing gists
- **Solution:** Click "Recreate Gists" to create missing gist files

#### C. Network Issues

- **Check:** Console shows network errors during sync
- **Solution:** Check internet connection, try again later

#### D. Data Structure Mismatch

- **Check:** Console shows merge errors
- **Solution:** Use "Reset All" to clear sync state and re-authenticate

### 2. Sync Button Not Working

**Symptoms:**

- Sync button doesn't respond when clicked
- No loading state or feedback
- Console shows errors

**Solutions:**

1. Check browser console for errors
2. Try refreshing the page
3. Clear browser cache and localStorage
4. Re-authenticate with GitHub

### 3. Partial Sync Failures

**Symptoms:**

- Some data syncs but not all
- Specific gists fail to upload/download
- Inconsistent data across devices

**Solutions:**

1. Check which specific gists are failing in debug page
2. Try "Recreate Gists" to fix corrupted gists
3. Use "Reset All" for complete reset if needed

### 4. Authentication Expired

**Symptoms:**

- "Not Authenticated" status
- Sync fails with authentication errors
- GitHub token expired

**Solutions:**

1. Click "Re-authenticate" in sync debugger
2. Complete GitHub OAuth flow again
3. Ensure GitHub app has gist permissions

## Debugging Steps

### Step 1: Check Sync Status

1. Go to `/sync-debug` page
2. Click "Run Debug Check"
3. Review authentication and gist status

### Step 2: Check Console Logs

1. Open browser developer tools
2. Look for sync-related errors
3. Check network tab for failed requests

### Step 3: Verify GitHub Gists

1. Go to GitHub.com → Your Profile → Gists
2. Look for gists with "Progress OS" in description
3. Verify gists are accessible and not corrupted

### Step 4: Test Sync Process

1. Make a small change (add a task)
2. Click sync button
3. Check if change appears in GitHub gist
4. Test on another device

## Advanced Troubleshooting

### Manual Gist Recreation

If automatic recreation fails:

1. Go to GitHub.com → Gists
2. Delete existing "Progress OS" gists
3. Use "Reset All" in debug page
4. Re-authenticate and sync

### Data Recovery

If data is lost:

1. Check GitHub gists for backup data
2. Use browser's IndexedDB inspector
3. Export data from working device
4. Import to broken device

### Network Issues

If sync fails due to network:

1. Check firewall/proxy settings
2. Try different network
3. Use mobile hotspot to test
4. Check GitHub API status

## Prevention Tips

1. **Regular Syncs:** Sync frequently to avoid large data conflicts
2. **Stable Network:** Ensure good internet connection during sync
3. **Single Device:** Avoid editing on multiple devices simultaneously
4. **Backup:** Export data regularly as backup

## Getting Help

If issues persist:

1. Check browser console for detailed error messages
2. Note the exact steps that cause the issue
3. Check GitHub API rate limits
4. Verify GitHub app permissions

## Sync Status Indicators

- 🟢 **Green:** Sync successful, data up to date
- 🟡 **Yellow:** Missing gists or partial sync
- 🔴 **Red:** Authentication failed or sync error
- ⚪ **Gray:** No recent sync or unknown status

## Technical Details

### Sync Process

1. **Download:** Fetch data from all GitHub gists
2. **Merge:** Combine local and remote data intelligently
3. **Upload:** Save merged data back to gists
4. **Update:** Refresh local IndexedDB with merged data

### Data Structure

- **appMeta:** App metadata and sync timestamps
- **trackers:** Main tracker data and tasks
- **challenges:** Challenges and achievements
- **todos:** Todo items and categories
- **analytics:** Snapshots and quiz data

### Conflict Resolution

- Uses timestamp-based conflict resolution
- Local changes take precedence for recent edits
- Remote data fills in missing local data
- Arrays are merged and deduplicated by ID
