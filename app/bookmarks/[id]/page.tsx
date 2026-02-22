'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import BookmarkForm, { SupabaseUser, FormValues } from '@/app/_components/BookmarkForm'
import { supabase } from '@/app/_libs/supabase'

type Bookmark = {
  id: string
  url: string
  comment: string | null
  isFavorite: boolean
  publishStatus: string
  createdAt: string
  user: {
    userName: string
    thumbnailKey: string | null
  }
}

export default function BookmarkEditPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()

  const [supabaseUser, setSupabaseUser] = useState<SupabaseUser | null>(null)
  const [bookmark, setBookmark] = useState<Bookmark | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) setSupabaseUser({ id: user.id, email: user.email })

        const res = await fetch(`/api/bookmarks/${id}`)
        if (!res.ok) {
          const data = await res.json()
          throw new Error(data.error ?? 'ブックマークの取得に失敗しました')
        }
        const data = await res.json()
        setBookmark(data.bookmark)
      } catch (e) {
        setError(e instanceof Error ? e.message : 'エラーが発生しました')
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleUpdate = async ({ url, comment, isFavorite, isPublic }: FormValues) => {
    setError(null)

    if (!supabaseUser) {
      setError('ログインが必要です。')
      return
    }
    if (!url) {
      setError('URLを入力してください。')
      return
    }

    setIsUpdating(true)
    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: 'PUT',
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
      setIsUpdating(false)
    }
  }

  const handleDelete = async () => {
    setError(null)

    if (!supabaseUser) {
      setError('ログインが必要です。')
      return
    }

    setIsDeleting(true)
    try {
      const res = await fetch(`/api/bookmarks/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supabaseId: supabaseUser.id }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error ?? 'エラーが発生しました')
      }

      router.push('/')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'エラーが発生しました')
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-muted text-sm">読み込み中...</p>
      </div>
    )
  }

  return (
    <BookmarkForm
      mode="edit"
      supabaseUser={supabaseUser}
      initialUrl={bookmark?.url}
      initialComment={bookmark?.comment ?? ''}
      initialIsFavorite={bookmark?.isFavorite}
      initialIsPublic={bookmark?.publishStatus === 'PUBLISHED'}
      createdAt={bookmark?.createdAt}
      onSubmit={handleUpdate}
      onDelete={handleDelete}
      isSubmitting={isUpdating}
      isDeleting={isDeleting}
      error={error}
      onCancel={() => router.back()}
    />
  )
}
