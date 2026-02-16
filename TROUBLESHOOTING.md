# Troubleshooting Guide

Common issues and their solutions for the Smart Bookmark App.

## 🔐 Authentication Issues

### Problem: "Invalid API key" error

**Symptoms:**
- Can't load the app
- Error message about invalid API key
- Console shows Supabase connection errors

**Solutions:**
1. Check `.env.local` file exists and has correct values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```
2. Verify you copied the **anon/public** key, not the service_role key
3. Make sure there are no extra spaces or quotes around the values
4. Restart the dev server: `npm run dev`

### Problem: Google Sign-In redirect fails

**Symptoms:**
- Click "Sign in with Google" but nothing happens
- Redirected to Google but then error
- "Redirect URI mismatch" error

**Solutions:**
1. **Check redirect URIs in Google Cloud Console:**
   ```
   https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback
   ```
   
2. **Verify Google OAuth is enabled in Supabase:**
   - Go to Authentication → Providers → Google
   - Should be toggled ON
   - Client ID and Secret should be filled in

3. **Check callback route exists:**
   - File should exist: `app/api/auth/callback/route.ts`

4. **Clear browser cache and cookies:**
   - Sometimes old auth state causes issues

### Problem: Sign-in works but immediately signs out

**Symptoms:**
- Successfully sign in with Google
- Redirected back to app
- Immediately shown as signed out

**Solutions:**
1. Check middleware.ts exists and is properly configured
2. Verify cookies are not blocked in browser
3. Check that `NEXT_PUBLIC_SITE_URL` matches your actual URL
4. In Supabase, check Auth → URL Configuration → Site URL is correct

## 📊 Database Issues

### Problem: "Failed to fetch" when loading bookmarks

**Symptoms:**
- Can sign in
- But can't see bookmarks
- Console shows network errors

**Solutions:**
1. **Verify Supabase URL is correct:**
   - No trailing slash
   - Uses https://
   - Matches your project

2. **Check RLS policies are configured:**
   ```sql
   -- Run this in Supabase SQL Editor to check
   SELECT * FROM pg_policies WHERE tablename = 'bookmarks';
   ```
   Should show 3 policies (SELECT, INSERT, DELETE)

3. **Test database connection:**
   - Go to Supabase → Database
   - Table Editor → bookmarks
   - Try manually adding a row

### Problem: Can't add bookmarks (no error message)

**Symptoms:**
- Form submits
- No error shown
- Bookmark doesn't appear

**Solutions:**
1. **Check RLS INSERT policy exists:**
   ```sql
   CREATE POLICY "Users can insert own bookmarks"
     ON bookmarks FOR INSERT
     TO authenticated
     WITH CHECK (auth.uid() = user_id);
   ```

2. **Verify user is authenticated:**
   - Check browser DevTools → Application → Cookies
   - Should see Supabase auth cookies

3. **Check browser console for errors:**
   - Open DevTools (F12)
   - Look for red error messages

### Problem: Can see other users' bookmarks

**Symptoms:**
- Sign in as User A, see bookmarks
- Sign in as User B, see User A's bookmarks
- Privacy is broken

**Solutions:**
1. **CRITICAL - RLS not enabled:**
   ```sql
   ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
   ```

2. **Verify SELECT policy:**
   ```sql
   CREATE POLICY "Users can view own bookmarks"
     ON bookmarks FOR SELECT
     TO authenticated
     USING (auth.uid() = user_id);
   ```

3. **Test in SQL Editor:**
   ```sql
   -- This should only show YOUR bookmarks
   SELECT * FROM bookmarks;
   ```

## ⚡ Real-time Issues

### Problem: Bookmarks don't update in real-time

**Symptoms:**
- Add bookmark in Tab 1
- Tab 2 doesn't update
- Need to refresh to see changes

**Solutions:**
1. **Enable Realtime in Supabase:**
   - Go to Database → Replication
   - Find `bookmarks` table
   - Toggle ON (it should be green)
   - Wait 1-2 minutes for it to activate

2. **Check subscription code:**
   ```typescript
   // In BookmarksList.tsx
   const channel = supabase
     .channel('bookmarks-changes')
     .on(
       'postgres_changes',
       {
         event: '*',
         schema: 'public',
         table: 'bookmarks',
       },
       (payload) => {
         // Handle changes
       }
     )
     .subscribe()
   ```

3. **Check browser console:**
   - Look for WebSocket connection errors
   - Should see "SUBSCRIBED" status

4. **Test the subscription:**
   ```typescript
   // Add console.log in the onChange handler
   .on('postgres_changes', ..., (payload) => {
     console.log('Realtime event:', payload)
   })
   ```

### Problem: Real-time only works sometimes

**Symptoms:**
- Works in one tab, not another
- Works for a while then stops
- Inconsistent behavior

**Solutions:**
1. **Check for multiple subscriptions:**
   - Make sure cleanup function runs:
   ```typescript
   return () => {
     supabase.removeChannel(channel)
   }
   ```

2. **Verify Supabase connection limits:**
   - Free tier has connection limits
   - Check Supabase dashboard for usage

3. **Test with fewer tabs:**
   - Each tab = 1 connection
   - Too many tabs can exhaust connections

## 🎨 UI/Display Issues

### Problem: Bookmarks appear but URL is broken

**Symptoms:**
- Bookmark shows in list
- Click on it, nothing happens
- Or goes to wrong page

**Solutions:**
1. **Check URL format in database:**
   - URLs should start with `http://` or `https://`
   - Add validation to form:
   ```typescript
   <input type="url" required />
   ```

2. **Verify the link component:**
   ```tsx
   <a 
     href={bookmark.url}
     target="_blank"
     rel="noopener noreferrer"
   >
   ```

### Problem: Styling is broken / no Tailwind classes

**Symptoms:**
- Page looks unstyled
- Tailwind classes not working
- Plain HTML appearance

**Solutions:**
1. **Check globals.css is imported:**
   - Should be in `app/layout.tsx`
   ```typescript
   import './globals.css'
   ```

2. **Verify Tailwind config:**
   - Check `tailwind.config.js` content paths:
   ```javascript
   content: [
     './app/**/*.{js,ts,jsx,tsx,mdx}',
   ]
   ```

3. **Restart dev server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

## 🚀 Deployment Issues

### Problem: Vercel build fails

**Symptoms:**
- Deployment fails during build
- Error in build logs
- App doesn't deploy

**Solutions:**
1. **Check environment variables in Vercel:**
   - All three must be set:
     - NEXT_PUBLIC_SUPABASE_URL
     - NEXT_PUBLIC_SUPABASE_ANON_KEY
     - NEXT_PUBLIC_SITE_URL

2. **Check build locally first:**
   ```bash
   npm run build
   ```
   Fix any errors before deploying

3. **Check for TypeScript errors:**
   ```bash
   npx tsc --noEmit
   ```

4. **Review build logs in Vercel:**
   - Click on failed deployment
   - Read the error message carefully

### Problem: App works locally but not on Vercel

**Symptoms:**
- `npm run dev` works fine
- Deployed version has errors
- Different behavior in production

**Solutions:**
1. **Environment variables:**
   - Make sure they're set in Vercel
   - Not just in `.env.local`

2. **Update NEXT_PUBLIC_SITE_URL:**
   - Should be your Vercel URL
   - Not `localhost:3000`

3. **Check Vercel function logs:**
   - Vercel Dashboard → Deployments → View Function Logs

4. **Test production build locally:**
   ```bash
   npm run build
   npm run start
   ```

### Problem: OAuth works locally but not on Vercel

**Symptoms:**
- Sign in works at localhost:3000
- Fails on Vercel deployment

**Solutions:**
1. **Add Vercel URL to Google OAuth:**
   - Google Cloud Console → Credentials
   - Add: `https://your-app.vercel.app/api/auth/callback`

2. **Update redirect URL in Supabase:**
   - Authentication → URL Configuration
   - Add Vercel URL to Redirect URLs

3. **Wait for propagation:**
   - Google OAuth changes can take a few minutes

## 🐛 General Debugging

### Enable detailed logging

Add to your components:
```typescript
console.log('User:', user)
console.log('Bookmarks:', bookmarks)
console.log('Realtime event:', payload)
```

### Check Supabase logs

1. Go to Supabase Dashboard
2. Logs & Analytics → Logs Explorer
3. Look for auth or database errors

### Test API directly

Use browser DevTools → Network tab:
1. Watch for Supabase API calls
2. Check response status codes
3. Read error messages in responses

### Common error codes

- **401 Unauthorized:** User not signed in or token expired
- **403 Forbidden:** RLS policy blocking the action
- **404 Not Found:** Wrong Supabase URL or table doesn't exist
- **500 Server Error:** Check Supabase logs and Vercel function logs

## 🆘 Still Stuck?

1. **Check all the guides:**
   - README.md - Setup instructions
   - QUICKSTART.md - Quick setup
   - DEPLOYMENT.md - Deployment steps

2. **Verify each requirement:**
   - Use CHECKLIST.md to confirm everything is set up

3. **Start fresh:**
   - Sometimes easiest to:
     - Delete `.next` folder
     - Delete `node_modules`
     - Run `npm install`
     - Run `npm run dev`

4. **Check for typos:**
   - Environment variable names (must be exact)
   - Supabase table name (should be `bookmarks`)
   - File paths and imports

5. **Compare with example:**
   - Re-read the code in the repository
   - Make sure your code matches

## 📧 Getting Help

When asking for help, include:
1. What you're trying to do
2. What's happening instead
3. Error messages (full text)
4. Browser console screenshot
5. What you've already tried

**Example:**
```
I'm trying to add a bookmark but nothing happens.
- No error message shown
- Console shows: [paste error]
- Using Chrome on Windows
- Tried: restarting server, checking RLS policies
```

---

Good luck! Most issues are simple configuration problems that are easy to fix once you know where to look. 🔧
