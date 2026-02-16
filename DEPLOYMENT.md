# Deployment Guide for Smart Bookmark App

This guide will walk you through deploying the Smart Bookmark App to Vercel.

## Pre-Deployment Checklist

- [ ] Supabase project created
- [ ] Database migrations run (`supabase-setup.sql`)
- [ ] Realtime enabled on `bookmarks` table
- [ ] Google OAuth configured in Supabase
- [ ] Code pushed to GitHub repository

## Step-by-Step Deployment

### 1. Prepare Your Repository

```bash
# Initialize git repository (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Smart Bookmark App"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/smart-bookmark-app.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure your project:
   - **Framework Preset:** Next.js
   - **Root Directory:** ./
   - **Build Command:** `npm run build` (default)
   - **Output Directory:** `.next` (default)

### 3. Add Environment Variables

In the Vercel project settings, add these environment variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

**Important:** Get these values from Supabase:
- Go to Project Settings → API
- Copy the Project URL and anon/public key

### 4. Deploy

Click "Deploy" and wait for the build to complete.

### 5. Update OAuth Redirect URLs

After deployment, you need to update your Google OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Navigate to your OAuth 2.0 Client ID
3. Add your Vercel URL to **Authorized redirect URIs**:
   ```
   https://your-project-id.supabase.co/auth/v1/callback
   https://your-app.vercel.app/api/auth/callback
   ```
4. Save changes

### 6. Test Your Deployment

1. Visit your Vercel URL
2. Click "Sign in with Google"
3. Add a bookmark
4. Open the app in another tab
5. Verify that bookmarks sync in real-time

## Troubleshooting

### Build Fails

**Check your environment variables:**
```bash
# In Vercel dashboard, verify all three env vars are set:
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY  
# - NEXT_PUBLIC_SITE_URL
```

### OAuth Not Working

**Common issues:**
1. Redirect URL mismatch - verify URLs in Google Cloud Console
2. Environment variables not set correctly in Vercel
3. Google OAuth not enabled in Supabase

**Fix:**
- Double-check redirect URLs include both Supabase and Vercel domains
- Ensure environment variables are set in Vercel (not just .env.local)

### Real-time Not Working

**Issue:** Bookmarks don't update in real-time

**Fix:**
1. Go to Supabase Dashboard
2. Database → Replication
3. Enable replication for `bookmarks` table
4. May take a few minutes to propagate

### "Failed to fetch" Errors

**Issue:** Network errors when accessing Supabase

**Fix:**
1. Verify Supabase URL is correct (no trailing slash)
2. Check that anon key matches your project
3. Ensure RLS policies are properly configured

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL | `https://abc123.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | `eyJhbGci...` |
| `NEXT_PUBLIC_SITE_URL` | Your deployed app URL | `https://my-app.vercel.app` |

## Post-Deployment

### Custom Domain (Optional)

1. In Vercel, go to Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` environment variable
5. Update Google OAuth redirect URLs

### Monitoring

Vercel automatically provides:
- **Analytics:** Track page views and performance
- **Logs:** View function logs and errors
- **Speed Insights:** Monitor Core Web Vitals

Access these in your Vercel dashboard.

## Updating Your App

To deploy updates:

```bash
# Make your changes
git add .
git commit -m "Description of changes"
git push

# Vercel automatically deploys on push to main branch
```

## Rollback

If something goes wrong:

1. Go to Vercel Dashboard → Deployments
2. Find a working deployment
3. Click "..." → "Promote to Production"

## Support

If you encounter issues:
- Check Vercel deployment logs
- Review Supabase logs (Logs & Analytics)
- Verify all environment variables are set correctly
- Ensure database migrations were applied

---

**Congratulations!** Your Smart Bookmark App is now live! 🎉
