'use client'

import { addBookmark } from '@/app/lib/actions'
import { useState, useRef } from 'react'

export default function AddBookmarkForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)

    try {
      await addBookmark(formData)
      // Reset form after successful submission
      if (formRef.current) {
        formRef.current.reset()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add bookmark')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 animate-slide-in">
      <div className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-stone-700 mb-1">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            required
            className="input-focus w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 transition-all"
            placeholder="My Awesome Website"
            disabled={isSubmitting}
          />
        </div>
        
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-stone-700 mb-1">
            URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            required
            className="input-focus w-full px-4 py-2 border border-stone-300 rounded-lg focus:ring-2 transition-all"
            placeholder="https://example.com"
            disabled={isSubmitting}
          />
        </div>

        {error && (
          <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary w-full py-2.5 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Adding...' : '+ Add Bookmark'}
        </button>
      </div>
    </form>
  )
}
