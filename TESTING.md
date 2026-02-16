# Testing Guide

This guide helps you verify that all features of the Smart Bookmark App are working correctly.

## Pre-Testing Checklist

- [ ] App is running (locally or deployed)
- [ ] Google OAuth is configured
- [ ] Database is set up with RLS policies
- [ ] Realtime is enabled

## Feature Tests

### 1. Authentication Tests

#### Test 1.1: Sign In with Google
- **Steps:**
  1. Visit the app homepage
  2. Click "Sign in with Google"
  3. Select your Google account
  4. Grant permissions
- **Expected:** Redirected to the app, see your email in the header

#### Test 1.2: Sign Out
- **Steps:**
  1. Click "Sign out" button in header
  2. Confirm you're signed out
- **Expected:** Redirected to login page

### 2. Bookmark Management Tests

#### Test 2.1: Add Bookmark
- **Steps:**
  1. Sign in
  2. Fill in title: "Test Bookmark"
  3. Fill in URL: "https://example.com"
  4. Click "Add Bookmark"
- **Expected:** 
  - Form clears
  - Bookmark appears at top of list
  - No errors

#### Test 2.2: Add Multiple Bookmarks
- **Steps:**
  1. Add 5 different bookmarks with unique titles/URLs
- **Expected:**
  - All appear in chronological order (newest first)
  - Each has correct title and URL

#### Test 2.3: Delete Bookmark
- **Steps:**
  1. Click trash icon on any bookmark
- **Expected:**
  - Bookmark disappears from list
  - No errors

#### Test 2.4: Invalid URL Handling
- **Steps:**
  1. Try to add bookmark with invalid URL (e.g., "not a url")
- **Expected:**
  - Browser validation prevents submission
  - Or error message appears

### 3. Real-time Synchronization Tests

#### Test 3.1: Real-time Add (Two Tabs)
- **Steps:**
  1. Open app in Tab A
  2. Open app in Tab B (same browser, signed in)
  3. In Tab A, add a bookmark
- **Expected:**
  - Bookmark appears in Tab B within 1-2 seconds
  - No page refresh needed

#### Test 3.2: Real-time Delete (Two Tabs)
- **Steps:**
  1. Have app open in Tab A and Tab B
  2. In Tab A, delete a bookmark
- **Expected:**
  - Bookmark disappears from Tab B within 1-2 seconds

#### Test 3.3: Different Browsers
- **Steps:**
  1. Open app in Chrome (signed in as User A)
  2. Open app in Firefox (signed in as User A)
  3. Add bookmark in Chrome
- **Expected:**
  - Bookmark appears in Firefox immediately

### 4. Privacy & Security Tests

#### Test 4.1: User Isolation
- **Steps:**
  1. Sign in as User A (use your Google account)
  2. Add 3 bookmarks
  3. Sign out
  4. Sign in as User B (use different Google account)
- **Expected:**
  - User B sees NO bookmarks
  - User B's bookmark list is empty

#### Test 4.2: Can't Delete Others' Bookmarks
- **Steps:**
  1. As User A, note the ID of one of your bookmarks
  2. Sign in as User B
  3. Try to delete User A's bookmark via direct API call
- **Expected:**
  - Should fail (RLS policy blocks it)
  - In practice, User B can't even see the bookmark

### 5. UI/UX Tests

#### Test 5.1: Mobile Responsiveness
- **Steps:**
  1. Open app on mobile device or resize browser to 375px width
- **Expected:**
  - Layout adapts to mobile
  - All buttons/inputs are usable
  - No horizontal scrolling

#### Test 5.2: Empty State
- **Steps:**
  1. Sign in with fresh account (no bookmarks)
- **Expected:**
  - See "No bookmarks yet" message with icon
  - Clear call-to-action

#### Test 5.3: Loading States
- **Steps:**
  1. Click "Add Bookmark" and observe button
  2. Click "Sign out" and observe button
- **Expected:**
  - Buttons show "Adding..." / "Signing out..." during action
  - Buttons are disabled during action

#### Test 5.4: Animations
- **Steps:**
  1. Add a bookmark
  2. Observe the animation
- **Expected:**
  - Bookmark slides in smoothly
  - Hover effects work on bookmark cards

### 6. Edge Cases

#### Test 6.1: Very Long URL
- **Steps:**
  1. Add bookmark with 500+ character URL
- **Expected:**
  - URL is truncated in display
  - Full URL works when clicked

#### Test 6.2: Very Long Title
- **Steps:**
  1. Add bookmark with 200+ character title
- **Expected:**
  - Title is truncated with ellipsis
  - Full title visible on hover (optional)

#### Test 6.3: Special Characters in Title
- **Steps:**
  1. Add bookmark with title: `"Test & <Script> 'Quotes'"`
- **Expected:**
  - Characters display correctly
  - No XSS vulnerabilities

#### Test 6.4: Rapid Fire Adding
- **Steps:**
  1. Add 10 bookmarks rapidly (1 per second)
- **Expected:**
  - All appear in correct order
  - No race conditions or duplicates

### 7. Performance Tests

#### Test 7.1: Large Dataset
- **Steps:**
  1. Add 100 bookmarks
  2. Scroll through list
- **Expected:**
  - Smooth scrolling
  - No lag or jank

#### Test 7.2: Real-time with Many Bookmarks
- **Steps:**
  1. With 50+ bookmarks, add one more in another tab
- **Expected:**
  - New bookmark appears at top immediately
  - No noticeable performance degradation

## Automated Testing (Optional)

You can add these test scripts to `package.json`:

```json
{
  "scripts": {
    "test": "echo 'No tests yet'",
    "test:e2e": "echo 'E2E tests would go here'"
  }
}
```

Consider adding:
- **Unit tests:** Jest + React Testing Library
- **E2E tests:** Playwright or Cypress
- **Type checking:** `tsc --noEmit`

## Bug Reporting

If you find issues during testing:

1. Note the exact steps to reproduce
2. Record what happened vs. what should happen
3. Check browser console for errors
4. Note your environment (browser, OS, etc.)
5. Create a GitHub issue with details

## Test Results Template

```markdown
## Test Results - [Date]

**Environment:**
- Browser: Chrome 120
- OS: macOS 14
- Deployment: Production / Local

**Tests Passed:** 18/20

**Failed Tests:**
- Test 6.2: Very Long Title - Title not truncating properly
- Test 7.1: Large Dataset - Scroll lag with 100+ items

**Notes:**
- Real-time sync working perfectly
- Mobile experience excellent
```

---

Happy testing! 🧪
