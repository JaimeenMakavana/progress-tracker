# GitHub Sync Setup Guide

This app uses GitHub Gists API to sync your data across devices. Follow these steps to set it up:

## 1. Create GitHub OAuth App

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in the details:
   - **Application name**: Progress OS (or your preferred name)
   - **Homepage URL**: `http://localhost:3000` (for development)
   - **Authorization callback URL**: `http://localhost:3000/auth/github/callback`
4. Click "Register application"
5. Copy the **Client ID** and generate a **Client Secret**

## 2. Environment Variables

Create a `.env.local` file in your project root:

```bash
# GitHub OAuth Configuration
NEXT_PUBLIC_GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here
```

## 3. Production Setup

For production deployment on Vercel:

1. Update your GitHub OAuth App settings:

   - **Homepage URL**: `https://your-app.vercel.app`
   - **Authorization callback URL**: `https://your-app.vercel.app/auth/github/callback`

2. Add environment variables in Vercel:
   - Go to your project settings in Vercel
   - Add the same environment variables

## 4. How It Works

- Your data is stored as a private GitHub Gist
- Each sync creates/updates a single JSON file in the gist
- Data is encrypted in transit (HTTPS)
- Only you can access your private gists
- Last-write-wins conflict resolution

## 5. Security

- OAuth tokens are stored in localStorage (client-side only)
- No backend database required
- GitHub handles authentication and authorization
- Your data remains private in your GitHub account

## 6. Usage

1. Click "Connect GitHub" on the dashboard
2. Authorize the app in GitHub
3. Your data will be automatically synced
4. Use the sync button to manually sync changes
5. Data syncs across all devices where you're logged in

## Troubleshooting

- **"GitHub OAuth not configured"**: Check your environment variables
- **"Authentication failed"**: Verify your OAuth app callback URL
- **"Sync failed"**: Check your internet connection and GitHub API status
