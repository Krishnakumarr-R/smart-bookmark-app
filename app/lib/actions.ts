'use server'

import { createServerSupabaseClient } from './supabase-server'
import { revalidatePath } from 'next/cache'

export async function addBookmark(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const url = formData.get('url') as string
  const title = formData.get('title') as string

  if (!url || !title) {
    throw new Error('URL and title are required')
  }

  const { error } = await supabase
    .from('bookmarks')
    .insert({
      user_id: user.id,
      url,
      title,
    })

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
}

export async function deleteBookmark(bookmarkId: string) {
  const supabase = await createServerSupabaseClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('Not authenticated')
  }

  const { error } = await supabase
    .from('bookmarks')
    .delete()
    .eq('id', bookmarkId)
    .eq('user_id', user.id)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/')
}

export async function signInWithGoogle() {
  const supabase = await createServerSupabaseClient()
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/api/auth/callback`,
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  return data.url
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/')
}
