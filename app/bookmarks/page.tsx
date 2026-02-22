'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/app/_libs/supabase'
import BookmarkShowForm, { Bookmark } from '@/app/_components/BookmarkShowForm'

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setIsLoading(false)
          return
        }

        const res = await fetch(`/api/bookmarks?supabaseId=${user.id}`)
        if (!res.ok) return
        const data = await res.json()
        setBookmarks(data.bookmarks)
      } catch (e) {
        console.error(e)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookmarks()
  }, [])

  return (
    <BookmarkShowForm
      bookmarks={bookmarks}
      isLoading={isLoading}
      showStatusBadge
      pageTitle="マイブックマーク"
    />
  )
}
