import { createServerSupabaseClient } from "./lib/supabase-server";
import { redirect } from "next/navigation";
import AddBookmarkForm from "./components/AddBookmarkForm";
import BookmarksList from "./components/BookmarksList";
import SignOutButton from "./components/SignOutButton";
import GoogleSignInButton from "./components/GoogleSignInButton";

export default async function Home() {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="text-6xl mb-6">🔖</div>
            <h1 className="text-4xl font-display font-bold text-stone-900 mb-3">
              Smart Bookmarks
            </h1>
            <p className="text-stone-600 mb-8">
              Save and organize your favorite links in one beautiful place
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-xl p-8">
            <h2 className="text-xl font-semibold text-stone-800 mb-6 text-center">
              Get Started
            </h2>
            <div className="flex justify-center">
              <GoogleSignInButton />
            </div>
          </div>

          <div className="text-center text-sm text-stone-500">
            Sign in with Google to start saving bookmarks
          </div>
        </div>
      </div>
    );
  }

  // Fetch user's bookmarks
  const { data: bookmarks, error } = await supabase
    .from("bookmarks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching bookmarks:", error);
  }

  return (
    <div className="min-h-screen p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="text-4xl">🔖</div>
              <h1 className="text-3xl font-display font-bold text-stone-900">
                Smart Bookmarks
              </h1>
            </div>
            <SignOutButton userEmail={user.email || ""} />
          </div>
          <p className="text-stone-600">
            Save and organize your favorite links. Changes sync in real-time
            across all your devices.
          </p>
        </header>

        {/* Add Bookmark Form */}
        <div className="mb-8">
          <AddBookmarkForm />
        </div>

        {/* Bookmarks List */}
        <div>
          <h2 className="text-xl font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <span>Your Bookmarks</span>
          </h2>
          <BookmarksList initialBookmarks={bookmarks || []} userId={user.id} />
        </div>
      </div>
    </div>
  );
}
