'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/app/lib/supabase-client'
import { deleteBookmark } from '@/app/lib/actions'

type Bookmark = {
  id: string
  title: string
  url: string
  created_at: string
  user_id: string
}

export default function BookmarksList({ initialBookmarks, userId }: { initialBookmarks: Bookmark[]; userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(initialBookmarks)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const supabase = createClient()

  useEffect(() => {
    // Sync state with initialBookmarks when they change
    setBookmarks(initialBookmarks)
  }, [initialBookmarks])

  useEffect(() => {
    // Set up real-time subscription
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
          console.log('Realtime event:', payload) // Debug log
          
          if (payload.eventType === 'INSERT') {
            const newBookmark = payload.new as Bookmark
            // Only add if it belongs to current user
            if (newBookmark.user_id === userId) {
              setBookmarks((current) => {
                // Avoid duplicates
                if (current.some(b => b.id === newBookmark.id)) {
                  return current
                }
                return [newBookmark, ...current]
              })
            }
          } else if (payload.eventType === 'DELETE') {
            setBookmarks((current) => current.filter((b) => b.id !== payload.old.id))
          } else if (payload.eventType === 'UPDATE') {
            const updatedBookmark = payload.new as Bookmark
            if (updatedBookmark.user_id === userId) {
              setBookmarks((current) =>
                current.map((b) => (b.id === updatedBookmark.id ? updatedBookmark : b))
              )
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status) // Debug log
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase, userId])

  async function handleDelete(bookmarkId: string) {
    try {
      setDeletingId(bookmarkId)
      await deleteBookmark(bookmarkId)
    } catch (error) {
      console.error('Error deleting bookmark:', error)
      setDeletingId(null)
    }
  }

  function getDomain(url: string) {
    try {
      return new URL(url).hostname.replace('www.', '')
    } catch {
      return url
    }
  }

  if (bookmarks.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-md">
        <div className="text-6xl mb-4">📚</div>
        <h3 className="text-xl font-display font-semibold text-stone-800 mb-2">
          No bookmarks yet
        </h3>
        <p className="text-stone-600">
          Add your first bookmark above to get started
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark, index) => (
        <div
          key={bookmark.id}
          className="bookmark-card bg-white rounded-xl shadow-md p-5 hover:shadow-lg animate-slide-in"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
              >
                <h3 className="font-semibold text-stone-900 group-hover:text-amber-600 transition-colors mb-1 truncate">
                  {bookmark.title}
                </h3>
                <p className="text-sm text-stone-500 truncate flex items-center gap-2">
                  <svg
                    className="w-4 h-4 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                    />
                  </svg>
                  {getDomain(bookmark.url)}
                </p>
              </a>
              <p className="text-xs text-stone-400 mt-2">
                {new Date(bookmark.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </p>
            </div>
            <button
              onClick={() => handleDelete(bookmark.id)}
              disabled={deletingId === bookmark.id}
              className="flex-shrink-0 text-stone-400 hover:text-red-600 transition-colors disabled:opacity-50"
              title="Delete bookmark"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
