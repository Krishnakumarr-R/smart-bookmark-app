'use client'

import { signOut } from '@/app/lib/actions'
import { useState } from 'react'

export default function SignOutButton({ userEmail }: { userEmail: string }) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleSignOut() {
    setIsLoading(true)
    try {
      await signOut()
      window.location.reload()
    } catch (error) {
      console.error('Error signing out:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-stone-600">{userEmail}</span>
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className="px-4 py-2 text-sm text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-50 transition-all disabled:opacity-50"
      >
        {isLoading ? 'Signing out...' : 'Sign out'}
      </button>
    </div>
  )
}
