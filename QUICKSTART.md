# Quick Start Guide

Get the Smart Bookmark App running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Supabase

### Create Project
1. Go to [supabase.com](https://supabase.com) → "New Project"
2. Name it "smart-bookmarks"
3. Set a database password (save it!)
4. Choose a region close to you

### Run Database Migration
1. In Supabase, go to **SQL Editor**
2. Copy and paste the contents of `supabase-setup.sql`
3. Click "Run"

### Enable Realtime
1. Go to **Database** → **Replication**
2. Find the `bookmarks` table
3. Toggle it ON

### Configure Google OAuth
1. In Supabase, go to **Authentication** → **Providers**
2. Find **Google** and enable it
3. You'll need to set up Google OAuth credentials:

#### Get Google OAuth Credentials
1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project (or use existing)
3. Enable Google+ API
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Choose "Web application"
6. Add authorized redirect URI:
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   ```
7. Copy the **Client ID** and **Client Secret**
8. Paste them back in Supabase Google provider settings

## 3. Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env.local

# Edit .env.local with your values
```

Get your Supabase credentials:
1. In Supabase, go to **Project Settings** → **API**
2. Copy **Project URL** → use for `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon/public** key → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Your `.env.local` should look like:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci....
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

## 5. Test It Out

1. Click "Sign in with Google"
2. Authorize the app
3. Add a bookmark (title + URL)
4. Open the app in another tab
5. Add another bookmark
6. Watch them sync in real-time! ⚡

## Troubleshooting

### "Invalid API key" error
- Check your `.env.local` file
- Make sure you copied the **anon/public** key, not the service_role key
- Restart the dev server after changing `.env.local`

### Google Sign-In doesn't work
- Verify you added the correct redirect URI in Google Cloud Console
- Make sure Google provider is enabled in Supabase
- Check that Client ID and Secret are correct

### Bookmarks don't sync in real-time
- Make sure Realtime is enabled for the `bookmarks` table in Supabase
- Check browser console for errors
- Try refreshing the page

### "Failed to fetch" errors
- Verify your Supabase URL is correct
- Check your internet connection
- Make sure your Supabase project is not paused

## Next Steps

- Read the full [README.md](./README.md) for detailed information
- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deploying to Vercel
- Customize the app's styling in `app/globals.css`

Need help? Check the Problems Encountered section in the README!
