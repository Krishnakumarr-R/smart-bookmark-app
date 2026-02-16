# Smart Bookmark App

A real-time bookmark manager built with Next.js 14 (App Router), Supabase, and Tailwind CSS. Users can sign in with Google, save bookmarks, and see them update instantly across multiple tabs.

## 🚀 Live Demo

**Vercel URL:** `[YOUR_DEPLOYED_URL_HERE]`

**GitHub Repository:** `[YOUR_GITHUB_REPO_URL_HERE]`

## ✨ Features

- 🔐 **Google OAuth Authentication** - Sign in securely with your Google account
- 📚 **Bookmark Management** - Add and delete bookmarks with title and URL
- 🔒 **Private Bookmarks** - Each user can only see their own bookmarks
- ⚡ **Real-time Updates** - Changes sync instantly across all open tabs using Supabase Realtime
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS and smooth animations
- 📱 **Mobile Friendly** - Works seamlessly on all device sizes

## 🛠️ Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Backend:** Next.js Server Actions
- **Database & Auth:** Supabase (PostgreSQL, Auth, Realtime)
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## 📋 Prerequisites

- Node.js 18+ installed
- A Supabase account ([supabase.com](https://supabase.com))
- A Google Cloud account for OAuth setup
- A Vercel account for deployment

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone [YOUR_REPO_URL]
cd smart-bookmark-app
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run this migration:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policy: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_bookmarks_user_id ON bookmarks(user_id);
CREATE INDEX idx_bookmarks_created_at ON bookmarks(created_at DESC);
```

3. **Enable Realtime** for the bookmarks table:
   - Go to **Database** → **Replication**
   - Find the `bookmarks` table and enable replication

### 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Configure the OAuth consent screen if needed
6. For **Application type**, select **Web application**
7. Add authorized redirect URIs:
   ```
   https://[YOUR_SUPABASE_PROJECT_ID].supabase.co/auth/v1/callback
   http://localhost:54321/auth/v1/callback  (for local development)
   ```
8. Copy your **Client ID** and **Client Secret**

9. In Supabase:
   - Go to **Authentication** → **Providers** → **Google**
   - Enable Google provider
   - Paste your Client ID and Client Secret
   - Save

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://[YOUR_PROJECT_ID].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Find these in Supabase under **Project Settings** → **API**

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 6. Deploy to Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repository
3. Add environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `NEXT_PUBLIC_SITE_URL` (your Vercel deployment URL)
4. Deploy!

5. **Update Google OAuth redirect URI** with your Vercel URL:
   - Add `https://[your-app].vercel.app/api/auth/callback` to authorized redirect URIs

## 🐛 Problems Encountered & Solutions

### Problem 1: Real-time Subscription Not Working
**Issue:** Initially, real-time updates weren't appearing when adding bookmarks in a different tab.

**Solution:** 
- Enabled replication on the `bookmarks` table in Supabase Dashboard (Database → Replication)
- The table must have replication enabled for the Supabase Realtime feature to work
- Made sure to properly subscribe to changes using the correct channel syntax

### Problem 2: Server Actions Cookie Handling
**Issue:** Server Actions were throwing errors when trying to set cookies in Server Components.

**Solution:**
- Wrapped cookie operations in try-catch blocks in `supabase-server.ts`
- This is expected behavior when using Server Actions - cookies can only be set in Route Handlers or middleware
- The middleware handles session refresh properly, so the errors can be safely ignored in Server Actions

### Problem 3: OAuth Redirect Loop
**Issue:** After Google sign-in, users would get stuck in a redirect loop.

**Solution:**
- Properly implemented the `/api/auth/callback` route to exchange the code for a session
- Used `exchangeCodeForSession()` instead of manually handling the OAuth flow
- Added the correct redirect URL in both Google Cloud Console and Supabase settings

### Problem 4: Type Safety with Supabase
**Issue:** TypeScript errors when accessing Supabase data without proper typing.

**Solution:**
- Created proper TypeScript interfaces for the Bookmark type
- Used type assertions when necessary (e.g., `payload.new as Bookmark`)
- Enabled strict mode in `tsconfig.json` to catch issues early

### Problem 5: Environment Variables in Client Components
**Issue:** Environment variables weren't accessible in client components.

**Solution:**
- Prefixed all public environment variables with `NEXT_PUBLIC_`
- This tells Next.js to expose these variables to the browser
- Server-only secrets (if any) should not have this prefix

### Problem 6: Database Schema and RLS Policies
**Issue:** Users could potentially see or modify other users' bookmarks.

**Solution:**
- Implemented Row Level Security (RLS) policies on the bookmarks table
- Created separate policies for SELECT, INSERT, and DELETE operations
- Each policy checks that `auth.uid() = user_id` to ensure users only access their own data
- Added indexes on `user_id` and `created_at` for better query performance

### Problem 7: UI Flickering on Real-time Updates
**Issue:** When a bookmark was deleted, there would be a brief flash as the UI updated.

**Solution:**
- Implemented optimistic UI updates by tracking the `deletingId` state
- The bookmark appears disabled immediately when delete is clicked
- Real-time subscription then removes it from the list
- Added smooth animations using CSS transitions

## 🏗️ Project Structure

```
smart-bookmark-app/
├── app/
│   ├── api/
│   │   └── auth/
│   │       └── callback/
│   │           └── route.ts          # OAuth callback handler
│   ├── components/
│   │   ├── AddBookmarkForm.tsx       # Form to add bookmarks
│   │   ├── BookmarksList.tsx         # List with real-time updates
│   │   ├── GoogleSignInButton.tsx    # Google OAuth button
│   │   └── SignOutButton.tsx         # Sign out functionality
│   ├── lib/
│   │   ├── actions.ts                # Server Actions
│   │   ├── supabase-client.ts        # Browser Supabase client
│   │   └── supabase-server.ts        # Server Supabase client
│   ├── globals.css                   # Global styles
│   ├── layout.tsx                    # Root layout
│   └── page.tsx                      # Home page
├── middleware.ts                     # Auth session refresh
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## 🔒 Security Features

- **Row Level Security (RLS):** Database-level security ensures users can only access their own bookmarks
- **Server-side Authentication:** User sessions are validated on the server
- **OAuth 2.0:** Secure Google authentication flow
- **CSRF Protection:** Built-in with Next.js Server Actions
- **Environment Variables:** Sensitive data never exposed to the client

## 📝 Database Schema

```sql
Table: bookmarks
- id: UUID (Primary Key)
- user_id: UUID (Foreign Key to auth.users)
- title: TEXT
- url: TEXT
- created_at: TIMESTAMP WITH TIME ZONE
```

## 🎨 Design Decisions

- **Warm Color Palette:** Used amber/stone colors for a friendly, inviting feel
- **Smooth Animations:** CSS transitions and keyframe animations for better UX
- **Responsive Design:** Mobile-first approach with Tailwind CSS
- **Accessibility:** Proper ARIA labels, keyboard navigation, and focus states
- **Real-time Feedback:** Loading states and optimistic updates for snappy interactions

## 🚀 Future Enhancements

- [ ] Search and filter bookmarks
- [ ] Tags/categories for organization
- [ ] Browser extension
- [ ] Import/export bookmarks
- [ ] Bookmark folders
- [ ] Collaborative bookmark collections
- [ ] Bookmark previews with screenshots
- [ ] Dark mode

## 📄 License

MIT License - feel free to use this project for learning or as a starting point for your own applications.

## 🙏 Acknowledgments

- Next.js team for the amazing App Router
- Supabase for the excellent database and auth platform
- Vercel for seamless deployment

---

**Note:** Make sure to update the Vercel URL and GitHub repository URL in this README after deployment!
