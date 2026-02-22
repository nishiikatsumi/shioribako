'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import BookmarkForm, { SupabaseUser, FormValues } from '@/app/_components/BookmarkForm'
import { supabase } from '@/app/_libs/supabase'

export default function BookmarkNewPage() {
  const router = useRouter()

  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) setSupabaseUser({ id: user.id, email: user.email })
    }
    fetchUser()
  }, [])

  const handleSubmit = async ({ url, comment, isFavorite, isPublic }: FormValues) => {
    setError(null)

    if (!supabaseUser) {
      setError('ログインが必要です。')
      return
    }
    if (!url) {
      setError('URLを入力してください。')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/bookmarks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supabaseId: supabaseUser.id,
          url,
          comment,
          isFavorite,
          publishStatus: isPublic ? 'PUBLISHED' : 'DRAFT',
          categoryIds: [],
          tagIds: [],
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'エラーが発生しました')
      }

      router.push('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <BookmarkForm
      mode="new"
      supabaseUser={supabaseUser}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      error={error}
      onCancel={() => router.back()}
    />
  )
}
